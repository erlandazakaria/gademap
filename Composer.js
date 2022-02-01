// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
export default class Composer extends EffectComposer {
    constructor(renderer, scene, camera) {
        super(renderer);
        this.scene = scene;
        this.camera = camera;
    }
    init() {
        return new Promise((res) => {
            try {
                this.addPass(new RenderPass(this.scene, this.camera));
                res('done');
            }
            catch (err) {
                console.warn('Composer Init Error');
                console.log(err);
            }
        });
    }
}
