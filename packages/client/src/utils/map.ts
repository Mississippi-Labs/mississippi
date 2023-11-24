import { CellType } from '@/constants';
import { ICoordinate } from '@/components/MapCell';
import { IPlayer } from '@/components/Player';
import MAP_CFG, { MapConfig, DELIVERY } from '@/config/map';
const { cellSize } = MapConfig;

export const cutMapData = (mapData, startCoordinate, endCoordinate) => {
  const { x: startX, y: startY} = startCoordinate;
  const { x: endX, y: endY} = endCoordinate;
  return mapData.slice(startY, endY + 1).map((row) => row.slice(startX, endX + 1));
};

const formatCsvToArray = (csv: string) => {
  const lines = csv.split('\n');
  const result = [];
  lines.forEach((str) => {
    const line = str.trim();
    if (line.match(/^\d/)) {
      const tempLine = line.split(',');
      tempLine.pop();
      tempLine.shift();
      const numbers = tempLine.map(str => Number(str))
      result.push(numbers);
    }
  });
  return result;
}

export const loadMapData = async () => {
  // const response = await fetch('/src/assets/map2.csv');
  // const reader = response.body.getReader();
  // const result = await reader.read();
  // const decoder = new TextDecoder('utf-8');
  // const csv = decoder.decode(result.value);
  // console.log(formatCsvToArray(csv))
  return MAP_CFG;
}

const getNormalMovableCellClass = () => {
  const random = Math.random();
  if (random < 0.7) {
    return 23;
    // return 24;
  } else if (random < 0.9) {
    return 24;
    // return 25;
  } else {
    return 18;
  }
}

const getBorderMovableCellClass = () => {
  const random = Math.random();
  if (random < 0.8) {
    return 19;
  } else {
    return 20;
  }
}

const productWallIndexToFeIndex = (index) => {
  if (index <= 3) {
    return index + 5;
  } else if (index >= 7 ) {
    return index - 7;
  }
  return index - 1;
}

const getAroundCellMovableConfig = (data, x, y) => {
  const isLeftCritical = x === 0;
  const isRightCritical = x === data[0].length - 1;
  const isTopCritical = y === 0;
  const isBottomCritical = y === data.length - 1;

  const topMovable = !isTopCritical && isMovable(data[y - 1][x]);
  const bottomMovable = !isBottomCritical && isMovable(data[y + 1][x]);
  const leftMovable = !isLeftCritical && isMovable(data[y][x - 1]);
  const rightMovable = !isRightCritical && isMovable(data[y][x + 1]);
  const topLeftMovable = !(isTopCritical || isLeftCritical) && isMovable(data[y - 1][x - 1]);
  const topRightMovable = !(isTopCritical || isRightCritical) && isMovable(data[y - 1][x + 1]);
  const bottomLeftMovable = !(isBottomCritical || isLeftCritical) && isMovable(data[y + 1][x - 1]);
  const bottomRightMovable = !(isBottomCritical || isRightCritical) && isMovable(data[y + 1][x + 1]);

  return {
    topMovable,
    bottomMovable,
    leftMovable,
    rightMovable,
    topLeftMovable,
    topRightMovable,
    bottomLeftMovable,
    bottomRightMovable
  }
}

const getBlankCellClass = (movableConfig) => {
  const wallIndexArr = Array(9).fill(0);
  const transforms = [];

  const {
    topMovable,
    rightMovable,
    topRightMovable,
  } = movableConfig;

  // 上和右均可用
  if (topMovable && rightMovable) {
    // 右上方也可用 => 随机使用后缀0024，0025，0018的资源, 权重为7，2，1
    // 右上方不可用, 9位置使用后缀0022的资源, 其余位置随机使用后缀0024，0025，0018的资源, 权重为7，2，1
    wallIndexArr.forEach((_, index) => {
      wallIndexArr[index] = getNormalMovableCellClass();
    });
    if (!topRightMovable) {
      wallIndexArr[8] = 22;
    }
  } else if (topMovable && !rightMovable) {
    // 上可用 右不可用
    // 1. 右方三格（9，6，3）随机使用使用后缀0019，0020的资源 权重为4，1, 使用时资源需要顺时针选准90°
    [3, 6, 9].forEach((productIndex) => {
      wallIndexArr[productIndex - 1] = getBorderMovableCellClass();
      transforms.push({
        index: productWallIndexToFeIndex(productIndex),
        rotation: 90
      })
    });
    // 其他位置随机使用后缀0024，0025，0018的资源
    [1, 2, 4, 5, 7, 8].forEach((productIndex) => {
      wallIndexArr[productIndex - 1] = getNormalMovableCellClass();
    });
  } else if (!topMovable && rightMovable) {
    // 只有右方可用 上方三格（7，8，9）随机使用使用后缀0019，0020 , 其他位置随机使用后缀0024，0025，0018的资源
    [7, 8, 9].forEach((productIndex) => {
      wallIndexArr[productIndex - 1] = getBorderMovableCellClass();
    });
    [1, 2, 3, 4, 5, 6].forEach((productIndex) => {
      wallIndexArr[productIndex - 1] = getNormalMovableCellClass();
    });
  } else {
    // 上方和右方均不可用
    // 9号位置使用后缀0021的资源
    wallIndexArr[8] = 21;
    // 7，8号随机使用使用后缀0019，0020的资源
    wallIndexArr[6] = getBorderMovableCellClass();
    wallIndexArr[7] = getBorderMovableCellClass();
    // 6，3号随机使用使用后缀0019，0020的资源
    [3, 6].forEach((productIndex) => {
      wallIndexArr[productIndex - 1] = getBorderMovableCellClass();
      transforms.push({
        index: productWallIndexToFeIndex(productIndex),
        rotation: 90
      })
    });
    // 其他位置随机使用后缀0024，0025，0018的资源
    [1, 2, 4, 5].forEach((productIndex) => {
      wallIndexArr[productIndex - 1] = getNormalMovableCellClass();
    });
  }

  return {
    transforms,
    // 产品的 序号和前端渲染不同，这里做下处理
    wallIndexArr
  }
}

const getImmovableCellClass = (movableConfig) => {
  const wallIndexArr = Array(9).fill(0);
  const transforms = [];
  const {
    topMovable,
    bottomMovable,
    leftMovable,
    rightMovable,
    topLeftMovable,
    topRightMovable,
    bottomLeftMovable,
    bottomRightMovable
  } = movableConfig;

  // 2，5号位置
  [2, 5].forEach((productIndex) => {
    wallIndexArr[productIndex - 1] = bottomMovable ? 2 : 5;
  });
  // 4，1号位置
  [1, 4].forEach((productIndex) => {
    if (bottomMovable) {
      if (leftMovable) {
        wallIndexArr[productIndex - 1] = 1;
      } else {
        wallIndexArr[productIndex - 1] = 2;
      }
    } else {
      if (leftMovable) {
        wallIndexArr[productIndex - 1] = 4;
      } else {
        wallIndexArr[productIndex - 1] = bottomLeftMovable ? 4 : 5;
      }
    }
  });
  // 6，3号位置
  [3, 6].forEach((productIndex) => {
    if (bottomMovable) {
      if (rightMovable) {
        wallIndexArr[productIndex - 1] = 3;
      } else {
        wallIndexArr[productIndex - 1] = 2;
      }
    } else {
      if (rightMovable) {
        wallIndexArr[productIndex - 1] = 6;
      } else {
        wallIndexArr[productIndex - 1] = bottomRightMovable ? 6 : 5;
      }
    }
  });
  // 8号位置
  if (topMovable) {
    wallIndexArr[7] = 12;
  } else {
    wallIndexArr[7] = bottomMovable ? 10 : 5;
  }
  // 7号位置
  if (topMovable) {
    if (bottomMovable) {
      wallIndexArr[6] = leftMovable ? 8 : 12;
    } else {
      wallIndexArr[6] = leftMovable ? 8 : 12;
    }
  } else {
    if (bottomMovable) {
      wallIndexArr[6] = leftMovable ? 7 : 10;
    } else {
      if (leftMovable) {
        wallIndexArr[6] = 4;
      } else {
        if (topLeftMovable) {
          wallIndexArr[6] = 9;
        } else if (!topLeftMovable && !bottomLeftMovable) {
          wallIndexArr[6] = 5;
        } else if (!topLeftMovable && bottomLeftMovable) {
          wallIndexArr[6] = 16;
        } else {
          // TODO
        }
      }
    }
  }
  // 9号位置
  if (topMovable) {
    if (rightMovable) {
      wallIndexArr[8] = topRightMovable ? 13 : 6;
    } else {
      wallIndexArr[8] = topRightMovable ? 12 : 12;
    }
  } else {
    if (rightMovable) {
      wallIndexArr[8] = bottomRightMovable ? (bottomMovable ? 14 : 6) : 6;
    } else {
      wallIndexArr[8] = topRightMovable ?
        15
        :
        bottomMovable ?
          10
          :
          bottomRightMovable ? 17 : 5;
    }
  }

  return {
    transforms,
    wallIndexArr
  }
}

const getDeliveryCellClass = () => {
  const wallIndexArr = [27, 26, 27, 26, 28, 26, 27, 26, 27];
  const transforms = [ {
    index: 0,
    rotation: -90
  }, {
    index: 3,
    rotation: -90
  }, {
    index: 5,
    rotation: 90
  }, {
    index: 6,
    rotation: 180
  }, {
    index: 7,
    rotation: 180
  }, {
    index: 8,
    rotation: 90
  }];

  return {
    transforms,
    wallIndexArr
  }
}

export const getCellClass = (data, coordinate) => {
  const { x, y } = coordinate;

  const movableConfig = getAroundCellMovableConfig(data, x, y);

  let cellClass;

  switch (data[y][x]) {
    case CellType.delivery:
      cellClass = getDeliveryCellClass();
      break;
    case CellType.blank:
      cellClass = getBlankCellClass(movableConfig)
      break;
    default:
      cellClass = getImmovableCellClass(movableConfig)
  }

  const { transforms, wallIndexArr } = cellClass;

  return {
    transforms,
    // 产品的 序号和前端渲染不同，这里做下处理
    classList: [...wallIndexArr.slice(6), ...wallIndexArr.slice(3, 6),...wallIndexArr.slice(0, 3)]
  }
}


export const isMovable = (type) => {
  return type !== CellType.immovable;
}

export const bfs = (mapData: number[][], from: ICoordinate, to: ICoordinate) => {
  const data = mapData.map((row) => [...row]);
  data[from.y][from.x] = 0;

  let paths = [[from]];
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  do {
    const newPaths = [];
    const hasFind = paths.some((path) => {
      const last = path[path.length - 1];
      return dirs.some((dir) => {
        const [dX, dY] = dir;
        const nextX = last.x + dX;
        const nextY = last.y + dY;

        if (data[nextY][nextX] === 1) {
          newPaths.push([...path, { x: nextX, y: nextY}]);
          data[nextY][nextX] = 0;
        }
        return nextX === to.x && nextY === to.y;
      });
    });
    if (hasFind) {
      return newPaths[newPaths.length - 1]
    }
    paths = newPaths;
  } while (paths.length !== 0);

  return [];
};

export const simplifyMapData = (mapData: number[][]) => {
  if (mapData.length === 0) {
    return mapData;
  }
  return  mapData.map((row) => row.map(type => isMovable(type) ? 1 : 0));
}


export const calculateOffset = (coordinate: ICoordinate) => {
  const { x, y } = coordinate;
  const { visualWidth, visualHeight, width, height, cellSize } = MapConfig;
  const offsetX = Math.max(0, Math.min(x - visualWidth / 2, width - visualWidth));
  const offsetY = Math.max(0, Math.min(y - visualHeight / 2, height - visualHeight));
  return { x: -offsetX * cellSize, y: -offsetY * cellSize };
}

export const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export const isDelivery = (target: ICoordinate) => {
  return DELIVERY.x === target.x && DELIVERY.y === target.y;
}

export const calculateMoveTime = (paths, blockTime) => {
  const step = paths.length - 1;
  const defaultTime = blockTime * 1.2;
  if (step > 5) {
    return defaultTime;
  }
  return defaultTime * step / 5;
}