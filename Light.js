import { Vector3, AmbientLight, PointLight } from 'three';
import { Sky } from "three/examples/jsm/objects/Sky";
import { findGroundLocation, newColor } from './Helper';
var Light = /** @class */ (function () {
    function Light(grounds, scene) {
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
    Light.prototype.init = function () {
        var _this = this;
        return new Promise(function (res) {
            try {
                var baseGround = _this.findLightPosition(_this.grounds || []);
                _this.defaultPosition = { x: baseGround.x, y: baseGround.y, z: baseGround.z };
                // ambient
                _this.scene.add(_this.ambientLight);
                // sky
                _this.sky.scale.setScalar(450000);
                _this.scene.add(_this.sky);
                _this.sky.material.uniforms['turbidity'].value = 2;
                _this.sky.material.uniforms["rayleigh"].value = 1;
                _this.sky.material.uniforms["mieCoefficient"].value = 0.005;
                _this.sky.material.uniforms["mieDirectionalG"].value = 0.8;
                var theta = Math.PI * (0 - 0.5);
                var phi = 2 * Math.PI * (0.25 - 0.5);
                _this.sun.x = Math.cos(phi);
                _this.sun.y = Math.sin(phi) * Math.sin(theta);
                _this.sun.z = Math.sin(phi) * Math.cos(theta);
                _this.sky.material.uniforms["sunPosition"].value.copy(_this.sun);
                // bayangan
                _this.pointLight1.position.set(0, 200, 0);
                _this.pointLight1.castShadow = true;
                _this.pointLight1.shadow.mapSize.width = 4096; // default
                _this.pointLight1.shadow.mapSize.height = 4096; // default
                _this.scene.add(_this.pointLight1);
                // depan
                _this.pointLight2.position.set(baseGround.x + 50, baseGround.y + 100, baseGround.z + 100);
                _this.scene.add(_this.pointLight2);
                // belakang
                _this.pointLight3.position.set(0, baseGround.y + 100, -baseGround.z - 100);
                _this.scene.add(_this.pointLight3);
                _this.ambientLight.layers.enableAll();
                _this.sky.layers.enableAll();
                _this.pointLight1.layers.enableAll();
                _this.pointLight2.layers.enableAll();
                _this.pointLight3.layers.enableAll();
                res('done');
            }
            catch (err) {
                console.error('Lightning Init Error');
                console.log(err);
            }
        });
    };
    Light.prototype.findLightPosition = function (grounds) {
        if (grounds.length === 0) {
            return {
                x: 10,
                y: 10,
                z: 10
            };
        }
        else {
            var groundPos = findGroundLocation(grounds);
            return {
                x: groundPos.mostRight + 10,
                y: groundPos.highest + 10,
                z: groundPos.mostBack + 10
            };
        }
    };
    return Light;
}());
export default Light;
