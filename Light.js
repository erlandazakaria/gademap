import { Vector3, AmbientLight, PointLight } from 'three';
import { Sky } from "three/examples/jsm/objects/Sky";
import { findGroundLocation, newColor } from './Helper';
export default class Light {
    constructor(grounds, scene) {
        this.grounds = grounds;
        this.scene = scene;
        this.defaultPosition = {};
        this.ambientLight = new AmbientLight();
        this.pointLight1 = new PointLight(newColor('white'), 0.5);
        this.pointLight2 = new PointLight(newColor('white'), 0.4);
        this.pointLight3 = new PointLight(newColor('white'), 0.2);
        this.sky = new Sky();
        this.sun = new Vector3();
    }
    init() {
        return new Promise((res) => {
            try {
                let baseGround = this.findLightPosition(this.grounds || []);
                this.defaultPosition = { x: baseGround.x, y: baseGround.y, z: baseGround.z };
                // ambient
                this.scene.add(this.ambientLight);
                // sky
                this.sky.scale.setScalar(450000);
                this.scene.add(this.sky);
                this.sky.material.uniforms['turbidity'].value = 2;
                this.sky.material.uniforms["rayleigh"].value = 1;
                this.sky.material.uniforms["mieCoefficient"].value = 0.005;
                this.sky.material.uniforms["mieDirectionalG"].value = 0.8;
                const theta = Math.PI * (0 - 0.5);
                const phi = 2 * Math.PI * (0.25 - 0.5);
                this.sun.x = Math.cos(phi);
                this.sun.y = Math.sin(phi) * Math.sin(theta);
                this.sun.z = Math.sin(phi) * Math.cos(theta);
                this.sky.material.uniforms["sunPosition"].value.copy(this.sun);
                // bayangan
                this.pointLight1.position.set(0, 200, 0);
                this.pointLight1.castShadow = true;
                this.pointLight1.shadow.mapSize.width = 4096; // default
                this.pointLight1.shadow.mapSize.height = 4096; // default
                this.scene.add(this.pointLight1);
                // depan
                this.pointLight2.position.set(baseGround.x + 50, baseGround.y + 100, baseGround.z + 100);
                this.scene.add(this.pointLight2);
                // belakang
                this.pointLight3.position.set(0, baseGround.y + 100, -baseGround.z - 100);
                this.scene.add(this.pointLight3);
                this.ambientLight.layers.enableAll();
                this.sky.layers.enableAll();
                this.pointLight1.layers.enableAll();
                this.pointLight2.layers.enableAll();
                this.pointLight3.layers.enableAll();
                res('done');
            }
            catch (err) {
                console.error('Lightning Init Error');
                console.log(err);
            }
        });
    }
    findLightPosition(grounds) {
        if (grounds.length === 0) {
            return {
                x: 10,
                y: 10,
                z: 10
            };
        }
        else {
            let groundPos = findGroundLocation(grounds);
            return {
                x: groundPos.mostRight + 10,
                y: groundPos.highest + 10,
                z: groundPos.mostBack + 10
            };
        }
    }
}
