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

const loadMapData = async () => {
  const response = await fetch('/src/assets/map.csv');
  const reader = response.body.getReader();
  const result = await reader.read();
  const decoder = new TextDecoder('utf-8');
  const csv = decoder.decode(result.value);
  return formatCsvToArray(csv);
}

export default loadMapData;