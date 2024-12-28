/**
 * Created by ui on 2016/6/13.
 */
const showFPS = (function () {
  const requestAnimationFrame =
    window.requestAnimationFrame;
  // 去他大爷的兼容
  //|| //Chromium
  //window.webkitRequestAnimationFrame || //Webkit
  //window.mozRequestAnimationFrame || //Mozilla Geko
  //window.oRequestAnimationFrame || //Opera Presto
  //window.msRequestAnimationFrame || //IE Trident?
  //function(callback) { //Fallback function
  //    window.setTimeout(callback, 1000/60);
  //}
  let e, pe, pid, fps, last, offset;

  fps = 0;
  last = Date.now();
  const step = function () {
    offset = Date.now() - last;
    fps += 1;
    if (offset >= 1000) {
      last += offset;
      appendFps(fps);
      fps = 0;
    }
    requestAnimationFrame(step);
  };
  //显示fps; 如果未指定元素id，默认<body>标签
  const appendFps = function (fps) {
    if (!e) e = document.createElement('span');
    e.style = `
      position: fixed;
      right: 0;
      top: 0;
      color: red;
      z-index: 999;
    `
    pe = pid ? document.getElementById(pid) : document.getElementsByTagName('body')[0];
    e.innerHTML = "fps: " + fps;
    pe.appendChild(e);
  }
  return {
    setParentElementId: function (id) {
      pid = id;
    },
    go: function () {
      step();
    }
  }
})();

export default showFPS;