import * as PIXI from 'pixi.js';
class WhiteFilter extends PIXI.Filter {
  constructor(){
    super(
      // 顶点着色器
      null,
      // 片段着色器
       `precision highp float;
        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;

        void main(void){
            vec4 color = texture2D(uSampler, vTextureCoord);
            if (color.a > 0.0) {
                gl_FragColor = vec4(1.0, 1.0, 1.0, color.a); // 白色，保持原来的透明度
            } else {
                gl_FragColor = color; // 保持透明
            }
        }`
    );
  }
}
const whiteFilter = new WhiteFilter();
export default whiteFilter;

