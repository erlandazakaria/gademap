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
import { Scene } from 'three';
var GadeScene = /** @class */ (function (_super) {
    __extends(GadeScene, _super);
    function GadeScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.removeObject = function (name) {
            var selectedObject = _this.getObjectByName(name);
            if (selectedObject && selectedObject.parent) {
                selectedObject.parent.remove(selectedObject);
            }
        };
        _this.removeObjectById = function (id) {
            var obj = _this.getObjectById(id);
            if (obj) {
                var parent_1 = obj.parent;
                if (parent_1) {
                    parent_1.remove(obj);
                }
            }
        };
        return _this;
    }
    return GadeScene;
}(Scene));
export default GadeScene;
//# sourceMappingURL=Scene.js.map