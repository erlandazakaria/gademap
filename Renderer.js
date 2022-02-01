import { PCFSoftShadowMap, WebGLRenderer, sRGBEncoding, ACESFilmicToneMapping } from 'three';
export default class Renderer extends WebGLRenderer {
    constructor(ref) {
        super({
            antialias: true,
            powerPreference: "high-performance",
        });
        this.ref = ref;
        this.canvas = this.domElement;
    }
    async init() {
        return new Promise((res) => {
            try {
                // renderer init
                this.setClearColor('white');
                this.setSize(this.ref.current.clientWidth, this.ref.current.clientHeight);
                this.setPixelRatio(window.devicePixelRatio);
                this.shadowMap.enabled = true;
                this.shadowMap.type = PCFSoftShadowMap;
                // this.alp = true;
                this.setClearAlpha(0);
                this.toneMappingExposure = 1;
                this.outputEncoding = sRGBEncoding;
                this.toneMapping = ACESFilmicToneMapping;
                // canvas init
                this.canvas.style.position = 'absolute';
                this.canvas.style.top = this.ref.current.offsetTop;
                this.canvas.style.boxSizing = 'border-box';
                this.ref.current.appendChild(this.canvas);
                res('done');
            }
            catch (err) {
                console.error('Renderer Init Error');
                console.log(err);
            }
        });
    }
}
