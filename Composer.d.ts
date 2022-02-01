import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RendererType } from "./Renderer";
import { GadeSceneType } from "./Scene";
import { CameraType } from "./Camera";
export interface ComposerType extends EffectComposer {
    init: () => Promise<string>;
}
export default class Composer extends EffectComposer {
    private scene;
    private camera;
    constructor(renderer: RendererType, scene: GadeSceneType, camera: CameraType);
    init(): Promise<string>;
}
