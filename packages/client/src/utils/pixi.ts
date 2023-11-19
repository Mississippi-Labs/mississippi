
export const loadAssets = (src, cb) => {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    cb(img);
  }

  img.onerror = () => {
    console.error(`${src} not found`);
  }
}