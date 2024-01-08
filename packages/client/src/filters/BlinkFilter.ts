import * as PIXI from 'pixi.js';
const vertexShader = `precision mediump float;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat3 projectionMatrix;
varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`;

const fragmentShader = `precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform int isOddFrame;

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);
    if (isOddFrame == 1 && color.a > 0.0) {
        color = vec4(1.0, 1.0, 1.0, color.a);
    }
    gl_FragColor = color;
}`;

class BlinkFilter extends PIXI.Filter {
  constructor() {
    super(vertexShader, fragmentShader);
    this.uniforms.isOddFrame = 0;
  }

  get isOddFrame() {
    return this.uniforms.isOddFrame;
  }

  set isOddFrame(value) {
    this.uniforms.isOddFrame = value ? 1 : 0;
  }
}
export default BlinkFilter;

