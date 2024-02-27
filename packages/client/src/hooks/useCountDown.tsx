import {
  useState,
  useRef,
  useEffect,
} from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

function isDef(target: any) {
  return target !== null && target !== undefined;
};

dayjs.extend(duration);

const formatStringCache: {
  [key: string]: string[];
} = {};

export interface CountDownProps {
  endTime?: string;
  formatString?: string;
  parseFormatString?: string;
  onFinished?: () => void;
  children?: React.ReactNode;
  duration?: number;
};

const limitUnit = ['s', 'm', 'H', 'D', 'M', 'Y'];
const limitUnitMap: { [key: string]: number } = {};
limitUnit.forEach((item, idx) => {
  limitUnitMap[item] = idx;
});

export function getTimeObj(duration: number, endTime: string | undefined, parseFormatString: string | undefined): duration.Duration {
  let timeObj = dayjs.duration(duration < 0 ? 0 : duration, 'seconds');
  if (isDef(endTime) && isDef(parseFormatString)) {
    const thisMoment = dayjs();
    const targetMoment = dayjs(endTime, parseFormatString);
    if (targetMoment.isAfter(thisMoment)) {
      timeObj = dayjs.duration(targetMoment.diff(thisMoment));
    }
  }
  return timeObj;
}

export function parseFormatStr(formatString: string) {
  if (formatStringCache.hasOwnProperty(formatString)) {
    return formatStringCache[formatString];
  }
  const strArr = [];
  let piece = '';
  for (let i = 0; i < formatString.length;) {
    const c = formatString[i];
    if (limitUnitMap.hasOwnProperty(c)) {
      let j = i + 1;
      if (piece) {
        strArr.push(piece);
        piece = '';
      }
      while (j < formatString.length) {
        if (formatString[j] === c) {
          j++;
        } else {
          break;
        }
      }
      strArr.push(formatString.slice(i, j));
      i = j;
    } else {
      piece += c;
      i++;
    }
  }
  if (piece) {
    strArr.push(piece);
  }
  formatStringCache[formatString] = strArr;
  return strArr;
}

export function getTimeStr(timeObj: duration.Duration, formatString: string): string {
  const strArr = parseFormatStr(formatString);
  const unitSet = new Set<string>();
  for (let i = 0; i < strArr.length; i++) {
    const c = strArr[i][0];
    if (limitUnitMap.hasOwnProperty(c)) {
      unitSet.add(c);
    }
  }
  const unitArr = [...unitSet].sort((a, b) => {
    return limitUnitMap[b] - limitUnitMap[a];
  });
  let copyedTimeObj = timeObj.clone();
  const m: {
    [key: string]: number,
  } = {};
  for (let i = 0; i < unitArr.length; i++) {
    const mathFn = i === unitArr.length - 1 ? Math.round : Math.floor;
    switch(unitArr[i]) {
      case 'Y':
        m.Y = mathFn(copyedTimeObj.asYears());
        copyedTimeObj = copyedTimeObj.subtract(m.Y, 'years');
        break;
      case 'M':
        m.M = mathFn(copyedTimeObj.asMonths());
        copyedTimeObj = copyedTimeObj.subtract(m.M, 'months');
        break;
      case 'D':
        m.D = mathFn(copyedTimeObj.asDays());
        copyedTimeObj = copyedTimeObj.subtract(m.D, 'days');
        break;
      case 'H':
        m.H = mathFn(copyedTimeObj.asHours());
        copyedTimeObj = copyedTimeObj.subtract(m.H, 'hours');
        break;
      case 'm':
        m.m = mathFn(copyedTimeObj.asMinutes());
        copyedTimeObj = copyedTimeObj.subtract(m.m, 'minutes');
        break;
      case 's':
        m.s = mathFn(copyedTimeObj.asSeconds());
        copyedTimeObj = copyedTimeObj.subtract(m.s, 'seconds');
        break;
    }
  }
  return strArr.map(item => {
    const c = item[0];
    if (limitUnitMap.hasOwnProperty(c)) {
      return `${m[c]}`.padStart(item.length, '0');
    }
    return item;
  }).join('');
}

export default (props: CountDownProps) => {
  const {
    formatString = 'mm:ss',
    duration = 0,
    endTime,
    parseFormatString = 'YYYY-MM-DD HH:mm:ss',
    onFinished,
    children,
  } = props;
  const timeObjRef = useRef(getTimeObj(duration, endTime, parseFormatString));
  const [timeStr, setTimeStr] = useState(getTimeStr(timeObjRef.current, formatString));

  useEffect(() => {
    if (timeObjRef.current.asSeconds() < 1) {
      typeof onFinished === 'function' && onFinished();
    } else {
      const timer = setInterval(() => {
        if (timeObjRef.current.asSeconds() < 1) {
          clearInterval(timer);
          typeof onFinished === 'function' && onFinished();
        } else {
          timeObjRef.current = timeObjRef.current.subtract(1, 'seconds');
          setTimeStr(getTimeStr(timeObjRef.current, formatString));
        }
      }, 1000);
      return () => {
        clearInterval(timer);
      }
    }
  }, []);

  return typeof children === 'function' ? children(timeStr) : null;
}