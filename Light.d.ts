import { GadeSceneType } from './Scene';
import { GroundType, Pos3 } from './Types';
export interface LightType {
    defaultPosition: Pos3 | Object;
    init: () => Promise<string>;
}
export default class Light {
    private grounds;
    private scene;
    private ambientLight;
    private pointLight1;
    private pointLight2;
    private pointLight3;
    private sky;
    private sun;
    defaultPosition: Pos3 | Object;
    constructor(grounds: Array<GroundType>, scene: GadeSceneType);
    init(): Promise<string>;
    private findLightPosition;
}
