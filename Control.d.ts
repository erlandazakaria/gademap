import { Vector3 } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CameraType } from './Camera';
import { RendererType } from './Renderer';
import { CalibrationType } from './Types';
export interface ControlType extends OrbitControls {
    init: () => Promise<string>;
}
export default class Control extends OrbitControls {
    private defaultCalibration;
    constructor(defaultCalibration: CalibrationType, camera: CameraType, renderer: RendererType);
    init(): Promise<string>;
    getCurrentTarget(): Vector3;
}
