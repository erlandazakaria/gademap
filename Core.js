var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { Raycaster, Vector2, Vector3 } from 'three';
import _ from "lodash";
import Scene from './Scene';
import Camera from "./Camera";
import Renderer from './Renderer';
import Composer from './Composer';
import Control from './Control';
import Light from './Light';
import Animation from './Animation';
import GadeObject from './Object';
import Label from './Label';
import Path from './Path';
import Calibration from './Calibration';
import { setGadeThree } from './Context';
import { addToRaycaster, progressAndText } from './Helper';
var Gademap = /** @class */ (function () {
    function Gademap(options) {
        var _this = this;
        this.changeLevel = function (level, deletePath) {
            if (deletePath === void 0) { deletePath = true; }
            return new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
                var levelParent_1, findLayer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // if(this.level && level._id === this.level._id && level.type === this.level.type) return;
                            if (this.level && level._id === this.level._id && level.type === this.level.type) {
                                res("");
                                return [2 /*return*/, null];
                            }
                            ;
                            this.dispatch ? this.dispatch('changeLevel', level) : console.error('Error on Dispatching');
                            //delete highlight
                            this.unselectAll(deletePath);
                            if (level.type === 'Scene') {
                                // update current level
                                this._changeLevelData(this.data.scene);
                                // layer selection
                                this.camera.layers.enableAll();
                                this.raycaster.layers.enableAll();
                            }
                            else if (level.parent_type === 'scene') {
                                // update current level
                                this._changeLevelData(level);
                                // layer selection
                                this.camera.layers.enableAll();
                                this.raycaster.layers.enableAll();
                            }
                            else {
                                // update current level
                                this._changeLevelData(level);
                                levelParent_1 = level.parent_type === "buildings"
                                    ? this.objects.data.buildings.find(function (o) { return o._id === level.parent; })
                                    : this.objects.data.grounds.find(function (o) { return o._id === level.parent; });
                                findLayer = this.objects.layers.find(function (l) {
                                    return (l.building.userData._id === level._id && l.building.userData.type === level.type)
                                        || (levelParent_1.type === 'building' && l.building.userData._id === levelParent_1._id);
                                });
                                if (findLayer) {
                                    this.camera.layers.set(findLayer.number);
                                    this.raycaster.layers.set(findLayer.number);
                                }
                                else {
                                    this.camera.layers.enableAll();
                                    this.raycaster.layers.enableAll();
                                }
                            }
                            return [4 /*yield*/, this.calibration.calibrate(level)];
                        case 1:
                            _a.sent();
                            res("");
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        this._changeLevelData = function (level) {
            _this.level = level;
            _this.objects.level = level;
        };
        this.checkHierarchy = function (checkLevel) {
            var level = __assign({}, _this.level);
            if (level.type === 'Scene') {
                level = _this.data.scene;
            }
            var currentlevelHierarchy = _this.objects.hierarchy.findIndex(function (hie) { return hie._id === level._id && hie.type === level.type; });
            var checkLevelHierarchy = _this.objects.hierarchy.findIndex(function (hie) { return hie._id === checkLevel._id && hie.type === checkLevel.type; });
            return currentlevelHierarchy >= checkLevelHierarchy ? false : true;
        };
        this.onMouseClick = function (event) {
            if (_this.animation.isAnimating)
                return null;
            var canvasBounds = _this.renderer.canvas.getBoundingClientRect();
            _this.mouse.x = (((event.clientX || event.touches[0].clientX) - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
            _this.mouse.y = -(((event.clientY || event.touches[0].clientY) - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;
            // setting raycaster
            _this.raycaster.setFromCamera(_this.mouse, _this.camera);
            // const currentLevel = this.objects.rendered[pluralIt(this.level.type)].find(lvl => lvl.userData._id === this.level._id);
            var currentLevel = __spreadArray(__spreadArray([], _this.objects.rendered.buildings, true), _this.objects.rendered.grounds, true).find(function (lvl) { var _a; return lvl.userData._id === ((_a = _this.level) === null || _a === void 0 ? void 0 : _a._id); });
            if (!currentLevel)
                return null;
            var raycasterObject = addToRaycaster(currentLevel);
            var intersects = _.uniqBy(_this.raycaster.intersectObjects(raycasterObject), "distance");
            if (intersects.length > 0) {
                _this._previewClick(intersects);
            }
        };
        this._previewClick = function (intersects) {
            if (intersects[0].object.parent.type === 'Group') {
                var findPlace = _this.objects.data.places.find(function (p) { return p.shape === intersects[0].object.parent.userData._id; });
                if (findPlace) {
                    _this.selectPlace(findPlace, intersects[0].object.parent);
                }
                ;
            }
            // CLICK BUILDING WILL GO INSIDE BUILDING IN FIRST FLOOR
            else if (intersects[0].object.userData.type === 'building') {
                if (_this.checkHierarchy(intersects[0].object.userData)) {
                    _this.changeLevelParent(intersects[0].object);
                }
                else {
                    // IF ALREADY INSIDE BUILDING THEN SELECT PLACE INSIDE
                    if (intersects[1]) {
                        var findPlace = _this.objects.data.places.find(function (p) { return p.shape === intersects[1].object.userData._id; });
                        if (findPlace) {
                            _this.selectPlace(findPlace, intersects[1].object);
                        }
                    }
                }
                // ONLY CLICK SHAPE THAT HAVE PLACE
            }
            else {
                var findPlace = _this.objects.data.places.find(function (p) { return p.shape === intersects[0].object.userData._id; });
                if (findPlace) {
                    _this.selectPlace(findPlace, intersects[0].object);
                }
            }
        };
        this.changeLevelParent = function (object) {
            var lvl = object;
            if (object.userData.type === 'building') {
                var findGround = _this.objects.rendered.grounds.find(function (g) { return g.userData.parent === lvl.userData._id && g.userData.parent_type === 'buildings'; });
                if (findGround) {
                    lvl = findGround;
                }
            }
            _this.dispatch ? _this.dispatch('changeLevel', lvl.userData) : console.error('Error on Dispatching');
            _this.changeLevel(lvl.userData);
        };
        this.selectPlace = function (place, shape) {
            _this.unselectAll(true);
            var placeShape = shape !== null && shape !== void 0 ? shape : _this.objects.rendered.shapes.find(function (s) { return s.userData._id === place.shape; });
            if (placeShape) {
                // IF DESTINATION LEVEL NOT SAME WITH CURRENT LEVEL 
                if (_this.level._id !== placeShape.parent.userData._id) {
                    _this.changeLevelParent(placeShape.parent);
                }
                // ANIMATION
                _this.animation.selectShape(placeShape, 2);
                if (placeShape.type === 'Group') {
                    _this.animation.scale(placeShape, 1, [placeShape.userData.scale.x * 1, placeShape.userData.scale.y * 1.5, placeShape.userData.scale.z * 1]);
                }
                else {
                    _this.animation.scale(placeShape, 1, [1, 1.5, 1]);
                }
                _this.animation.changeColor(placeShape, 1, _this.data.highlight_color || '#2AA5A5');
                // SAVE SELECTED
                _this.selected = [placeShape];
            }
        };
        this.unselectAll = function (deletePath) {
            if (deletePath === void 0) { deletePath = true; }
            if (_this.selected.length > 0) {
                _this.selected.forEach(function (selected) {
                    if (selected.type === 'Group') {
                        _this.animation.unscale(selected, 1, [selected.userData.scale.x * 1, selected.userData.scale.y, selected.userData.scale.z * 1]);
                    }
                    else {
                        _this.animation.unscale(selected, 1, [1, selected.userData.scale ? selected.userData.scale.y : 1, 1]);
                    }
                    _this.animation.changeColor(selected, 1, selected.userData.color);
                });
                _this.selected = [];
                _this.dispatch ? _this.dispatch('unselect') : console.error('Error on Dispatching');
            }
            if (deletePath) {
                if (_this.path.visiblePath.length > 0) {
                    _this.path.visiblePath.forEach(function (vp) {
                        vp.visible = false;
                    });
                    _this.path.visiblePath = [];
                }
            }
        };
        this.findAway = function (to, from) { return __awaiter(_this, void 0, void 0, function () {
            var availablePath, toShape, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        availablePath = from ? this.checkPathByPlace(to, from) : this.checkPathByPlace(to);
                        if (!availablePath) return [3 /*break*/, 2];
                        toShape = this.objects.rendered.shapes.find(function (s) { return s.userData._id === to.shape; });
                        this.unselectAll(true);
                        _a = this.path;
                        return [4 /*yield*/, this.animation.showPath(availablePath)];
                    case 1:
                        _a.visiblePath = _b.sent();
                        this._selectAfterPath(toShape);
                        this.dispatch ? this.dispatch('select', [to]) : console.error('Error on Dispatching');
                        return [2 /*return*/];
                    case 2:
                        // throw 'Path is Not Found'
                        console.error("Path is Not Found");
                        return [2 /*return*/];
                }
            });
        }); };
        this._selectAfterPath = function (obj) {
            _this.unselectAll(false);
            if (obj.type === 'Group') {
                _this.animation.scale(obj, 1, [obj.userData.scale.x * 1, obj.userData.scale.y * 1.5, obj.userData.scale.z * 1]);
            }
            else {
                _this.animation.scale(obj, 1, [1, 1.5, 1]);
            }
            _this.animation.changeColor(obj, 1, _this.data.highlight_color || '#2AA5A5');
            _this.selected = [obj];
        };
        this.checkPathByPlace = function (to, from) {
            var availablePath;
            if (from) {
                availablePath = _this.path.calculatedPath.find(function (cp) { return cp.to === to._id && cp.from._id === from._id; });
            }
            else {
                availablePath = _this.path.calculatedPath.find(function (cp) { return cp.to === to._id; });
            }
            return availablePath;
        };
        this.getHierarchy = function () {
            return _this.objects.hierarchy.map(function (lvl) { return ({ _id: lvl._id, type: lvl.type, name: lvl.name, parent: lvl.parent, parent_type: lvl.parent_type }); });
        };
        this.onWindowResize = function () {
            if (!_this.ref)
                return null;
            _this.camera.aspect = _this.ref.current.clientWidth / _this.ref.current.clientHeight;
            _this.camera.updateProjectionMatrix();
            _this.renderer.setSize(_this.ref.current.clientWidth, _this.ref.current.clientHeight);
        };
        this.isAnimating = function () {
            return _this.animation.isAnimating;
        };
        this.animate = function () {
            _this.renderScene();
            _this.frameId = requestAnimationFrame(_this.animate);
            if (_this.objects.rendered.user && _this.objects.rendered.user.name) {
                _this.objects.rendered.user.rotateOnAxis(new Vector3(1, 0, 0).normalize(), Math.PI * 0.01);
            }
        };
        this.renderScene = function () {
            _this.renderer.render(_this.scene, _this.camera);
            _this.composer.render();
        };
        this.deleteAll = function () {
            _this.renderer.dispose();
            var cleanMaterial = function (material) {
                material.dispose();
                // dispose textures
                for (var _i = 0, _a = Object.keys(material); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var value = material[key];
                    if (value && typeof value === 'object' && 'minFilter' in value) {
                        value.dispose();
                    }
                }
            };
            _this.scene.traverse(function (object) {
                if (!object.isMesh)
                    return;
                object.geometry.dispose();
                if (object.material.isMaterial) {
                    cleanMaterial(object.material);
                }
                else {
                    for (var _i = 0, _a = object.material; _i < _a.length; _i++) {
                        var material = _a[_i];
                        cleanMaterial(material);
                    }
                }
            });
        };
        this.data = options.data || null;
        this.ref = options.ref || null;
        this.dispatch = options.dispatch || null;
        this.selected = [];
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();
        this.level = null;
        this.scene = new Scene();
        this.defaultLevel = this.data.grounds.find(function (ground) { return ground._id === _this.data.default_calibration.level._id; });
        // ? this.data.grounds.find(ground => ground._id === this.data.default_calibration.level)
        this.camera = new Camera(this.ref);
        this.renderer = new Renderer(this.ref);
        this.composer = new Composer(this.renderer, this.scene, this.camera);
        this.control = new Control(this.data.default_calibration, this.camera, this.renderer);
        this.light = new Light(options.data.grounds, this.scene);
        this.animation = new Animation(this.camera, this.control, this.changeLevel);
        this.label = new Label(this.ref);
        this.objects = new GadeObject(this.data, this.scene, this.level, this.label, this.animation, this.dispatch);
        this.path = new Path(this.data, this.scene, this.objects, this.animation);
        this.calibration = new Calibration(this.data.default_calibration, this.data.calibrations, this.animation, this.objects);
    }
    Gademap.prototype.init = function (progress, text) {
        if (progress === void 0) { progress = null; }
        if (text === void 0) { text = null; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // Renderer and Composer
                this.renderer.init()
                    .then(function () {
                    progress && text && progressAndText(progress, text, 30, 'Creating Environment');
                    _this.composer.init();
                })
                    // LABEL
                    .then(function () {
                    progress && text && progressAndText(progress, text, 40, 'Make the Label Good');
                    _this.label.init(_this.objects);
                })
                    // Loading Objects
                    .then(function () {
                    progress && text && progressAndText(progress, text, 50, 'Loading Objects');
                    _this.objects.init();
                })
                    // Calculating Path
                    .then(function () {
                    progress && text && progressAndText(progress, text, 60, 'Calculating Path');
                    _this.path.init();
                })
                    // Setting Lightning
                    .then(function () {
                    progress && text && progressAndText(progress, text, 70, 'Setting Lightning');
                    _this.light.init();
                })
                    // Setting Controller
                    .then(function () {
                    progress && text && progressAndText(progress, text, 80, 'Setting Controller');
                    _this.control.init();
                })
                    // Calibrating Objects
                    .then(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                progress && text && progressAndText(progress, text, 90, 'Calibrating Objects');
                                if (!this.defaultLevel) return [3 /*break*/, 2];
                                return [4 /*yield*/, this.changeLevel(this.defaultLevel)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); })
                    // Finishing Scene
                    .then(function () {
                    if (_this.ref) {
                        _this.renderer.canvas.onclick = function (e) { return _this.onMouseClick(e); };
                        _this.renderer.canvas.ontouchstart = function (e) { return _this.onMouseClick(e); };
                    }
                    window.addEventListener('resize', function () { return _this.onWindowResize(); }, false);
                    setGadeThree(_this);
                })
                    // Starting Scene
                    .then(function () {
                    _this.start();
                    progress && text && progressAndText(progress, text, 100, 'Finished');
                    _this.dispatch ? _this.dispatch('loaded') : console.error('Error on Dispatching');
                });
                return [2 /*return*/];
            });
        });
    };
    Gademap.prototype.start = function () {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    };
    return Gademap;
}());
export default Gademap;
//# sourceMappingURL=Core.js.map