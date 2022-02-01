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
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
var Composer = /** @class */ (function (_super) {
    __extends(Composer, _super);
    function Composer(renderer, scene, camera) {
        var _this = _super.call(this, renderer) || this;
        _this.scene = scene;
        _this.camera = camera;
        return _this;
    }
    Composer.prototype.init = function () {
        var _this = this;
        return new Promise(function (res) {
            try {
                _this.addPass(new RenderPass(_this.scene, _this.camera));
                res('done');
            }
            catch (err) {
                console.warn('Composer Init Error');
                console.log(err);
            }
        });
    };
    return Composer;
}(EffectComposer));
export default Composer;
