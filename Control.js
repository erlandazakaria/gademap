var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Vector3 } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
var Control = /** @class */ (function (_super) {
    __extends(Control, _super);
    function Control(defaultCalibration, camera, renderer) {
        var _this = _super.call(this, camera, renderer.domElement) || this;
        _this.defaultCalibration = defaultCalibration;
        return _this;
    }
    Control.prototype.init = function () {
        var _this = this;
        return new Promise(function (res) {
            try {
                var x = _this.defaultCalibration.target.x || 0;
                var y = _this.defaultCalibration.target.y || 0;
                var z = _this.defaultCalibration.target.z || 0;
                _this.target = new Vector3(x, y, z);
                _this.update();
                _this.minPolarAngle = 0.0;
                _this.maxPolarAngle = 1.5;
                _this.saveState();
                _this.update();
                res('done');
            }
            catch (err) {
                console.error('Controller Init Error');
                console.log(err);
            }
        });
    };
    Control.prototype.getCurrentTarget = function () {
        return this.target;
    };
    return Control;
}(OrbitControls));
export default Control;
