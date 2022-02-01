import { Vector3 } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default class Control extends OrbitControls {
    constructor(defaultCalibration, camera, renderer) {
        super(camera, renderer.domElement);
        this.defaultCalibration = defaultCalibration;
    }
    init() {
        return new Promise((res) => {
            try {
                let x = this.defaultCalibration.target.x || 0;
                let y = this.defaultCalibration.target.y || 0;
                let z = this.defaultCalibration.target.z || 0;
                this.target = new Vector3(x, y, z);
                this.update();
                this.minPolarAngle = 0.0;
                this.maxPolarAngle = 1.5;
                this.saveState();
                this.update();
                res('done');
            }
            catch (err) {
                console.error('Controller Init Error');
                console.log(err);
            }
        });
    }
    getCurrentTarget() {
        return this.target;
    }
}
