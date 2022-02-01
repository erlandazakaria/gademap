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
import { PerspectiveCamera } from 'three';
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera(ref) {
        var _this = _super.call(this, 75, ref.current.clientWidth / ref.current.clientHeight, 0.1, 10000) || this;
        _this.getCurrentPosition = function () {
            return _this.position;
        };
        return _this;
    }
    return Camera;
}(PerspectiveCamera));
export default Camera;
