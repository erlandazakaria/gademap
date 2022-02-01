import { PerspectiveCamera } from 'three';
export interface CameraType extends PerspectiveCamera {
    getCurrentPosition: () => void;
}
export default class Camera extends PerspectiveCamera {
    constructor(ref: any);
    getCurrentPosition: () => import("three").Vector3;
}
