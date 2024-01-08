export const getRandomStr = (length) => {
  let strs = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXWZ0123456789';
  let newStrs = '';
  for (let i = 0; i < length; i++) {
    let index = getRandom(0, 62);
    let tempStr = strs[index];

    newStrs += tempStr;
  }
  return newStrs;
}

const getRandom = (n, m) => {
  n = Math.ceil(n);
  m = Math.floor(m);
  return Math.floor(Math.random() * (m - n)) + n;
}
