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
import { TextureLoader, RepeatWrapping, Vector2, Shape, ExtrudeBufferGeometry, MeshStandardMaterial, Mesh, Group, sRGBEncoding, Box3, Vector3 } from 'three';
import _ from 'lodash';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { generateCurves, newColor } from "./Helper";
var GadeObject = /** @class */ (function () {
    function GadeObject(data, scene, level, label, animation, dispatch) {
        var _this = this;
        this.showAllLevels = function () { return __awaiter(_this, void 0, void 0, function () {
            var allLevel;
            var _this = this;
            return __generator(this, function (_a) {
                allLevel = __spreadArray(__spreadArray([], this.rendered.grounds, true), [this.rendered.buildings], false);
                allLevel.forEach(function (object) {
                    _this.animation.showHideObject3D(object, true);
                });
                return [2 /*return*/, null];
            });
        }); };
        this.hideLevels = function (level) { return __awaiter(_this, void 0, void 0, function () {
            var renderedLevel, exceptions_1, child, parent_1, allLevel, willBeHide;
            return __generator(this, function (_a) {
                renderedLevel = level.type === "building" ? this.rendered.buildings.find(function (b) { return b.userData._id === level._id; })
                    : this.rendered.grounds.find(function (g) { return g.userData._id === level._id; });
                if (renderedLevel) {
                    exceptions_1 = [];
                    exceptions_1.push(renderedLevel.userData._id);
                    if (level.type === "building") {
                        this.animation.addTransparentBuilding(renderedLevel);
                        child = this.rendered.grounds.find(function (g) { return g.userData.parent === level._id; });
                        if (child) {
                            this.animation.showHideObject3D(child, true);
                            exceptions_1.push(child.userData._id);
                        }
                    }
                    else if (level.parent_type === "buildings") {
                        parent_1 = this.rendered.buildings.find(function (b) { return b.userData._id === level.parent; });
                        this.animation.showHideObject3D(renderedLevel, true);
                        if (parent_1) {
                            this.animation.addTransparentParentBuilding(parent_1);
                            exceptions_1.push(parent_1.userData._id);
                        }
                    }
                    else {
                        this.animation.showHideObject3D(renderedLevel, true);
                    }
                    allLevel = __spreadArray(__spreadArray([], this.rendered.buildings, true), this.rendered.grounds, true);
                    willBeHide = allLevel.filter(function (lvl) { return !exceptions_1.includes(lvl.userData._id); });
                    this.animation.hideLevels(willBeHide);
                }
                // // get level hierarchy
                // let levelHierarchy = this.hierarchy.find(hierarchy => hierarchy._id === level._id);
                // let exceptions: Array<HierarchyType> = [];
                // if(levelHierarchy) {
                //   let theLevel: HierarchyType = {...levelHierarchy};
                //     delete theLevel.children;
                //     delete theLevel.hierarchies;
                //   let parent: Array<HierarchyType> = levelHierarchy.hierarchies ? levelHierarchy.hierarchies : [];
                //   let children: Array<HierarchyType> = levelHierarchy.children ? levelHierarchy.children : [];
                //   exceptions = [theLevel, ...parent, ...children] 
                // }
                // let allLevel: Array<LevelWithoutScene> = [...this.rendered.grounds, ...this.rendered.buildings];
                // allLevel.forEach((l: LevelWithoutScene) => {
                //   let find = exceptions.find((e: HierarchyType) => e._id === l.userData._id);
                //   if(find) {
                //     if(level.type === "building") {
                //       levelHierarchy!.hierarchies && levelHierarchy!.hierarchies.length > 0 && levelHierarchy!.hierarchies[levelHierarchy!.hierarchies.length-1]
                //         && levelHierarchy!.hierarchies[levelHierarchy!.hierarchies.length-1].type === "building"
                //         ? this.animation.addTransparentBuilding(l) 
                //         : this.animation.addTransparentParentBuilding(l);
                //     } else {
                //       this.animation.showHideObject3D(l, true);
                //     }
                //     exceptions = exceptions.filter((e: HierarchyType) => e._id !== l.userData._id);
                //   } else {
                //     this.animation.showHideObject3D(l, false);
                //   }
                // });
                return [2 /*return*/, null];
            });
        }); };
        this.scene = scene;
        this.level = level;
        this.label = label;
        this.animation = animation;
        this.dispatch = dispatch;
        this.data = {
            scene: data.scene,
            shapes: data.shapes,
            places: data.places,
            grounds: data.grounds,
            buildings: data.buildings,
            pathVertices: data.path_vertices,
            pathEdges: data.path_edges,
            labels: data.labels,
        };
        this.rendered = {
            shapes: [],
            labels: [],
            grounds: [],
            buildings: [],
            user: null
        };
        this.roughnessURL = 'https://is3.cloudhost.id/gademap/grunge.jpg';
        this.userURL = 'https://is3.cloudhost.id/gademap/map-pointer.gltf';
        this.layers = [];
        this.hierarchy = this.generateHierarchy({ grounds: data.grounds, buildings: data.buildings });
        this.user = data.pin || null;
        this.modelLoader = new GLTFLoader();
        this.imageLoader = new TextureLoader();
        this.imageLoader.setRequestHeader({ "Origin": "*" });
        this.roughness = this.imageLoader.load(this.roughnessURL);
        this.roughness.encoding = sRGBEncoding;
        this.roughness.wrapS = RepeatWrapping;
        this.roughness.wrapT = RepeatWrapping;
        this.roughness.repeat.set(0.05, 0.05);
    }
    GadeObject.prototype.init = function () {
        var _this = this;
        return new Promise(function (res, rej) {
            try {
                // load level
                _this.hierarchy.forEach(function (lvl) {
                    _this.add3DObj(lvl);
                });
                // load shapes
                _this.data.shapes.forEach(function (shape) {
                    if (shape.file_name) {
                        _this.modelLoader.load(shape.file_name, function (gltf) { return _this.loadModel(shape, gltf); }, undefined, function (error) {
                            console.error(error);
                        });
                    }
                    else {
                        _this.add3DObj(shape);
                    }
                });
                // add layers to buildings
                _this.rendered.buildings.forEach(function (building, index) {
                    building.layers.set(index + 1);
                    building.traverse(function (child) {
                        child.layers.set(index + 1);
                    });
                    _this.layers.push({ number: index + 1, building: building });
                });
                // load free label
                _this.data.labels.forEach(function (l) {
                    _this.label.createFreeLabel(l);
                });
                // load user
                if (_this.user) {
                    _this.modelLoader.load(_this.userURL, function (gltf) { return _this.addUserObject(gltf); }, undefined, function (error) {
                        console.error(error);
                    });
                }
                _this.updateHierarchy();
                res("done");
            }
            catch (err) {
                rej();
            }
        });
    };
    GadeObject.prototype.add3DObj = function (object) {
        var _this = this;
        // IF ADD MODEL
        if ("file_name" in object && object.file_name !== null) {
            this.modelLoader.load(object.file_name, function (gltf) { return _this.loadModel(object, gltf); }, undefined, function (error) {
                console.error(error);
            });
            return;
        }
        // make a mesh
        var shapePoints = object.shape_points.map(function (dot) {
            return new Vector2(dot.x, dot.y);
        });
        var shape;
        if (object.bezier_points.length > 0) {
            shape = generateCurves(object.bezier_points);
        }
        else {
            shape = new Shape(shapePoints);
        }
        var extrudeSettings = {
            steps: 1,
            depth: object.height,
            bevelEnabled: false
        };
        var extrudeGeom = new ExtrudeBufferGeometry(shape, extrudeSettings);
        extrudeGeom.rotateX(-Math.PI * 0.5);
        var extrudeMat = new MeshStandardMaterial({
            color: newColor(object.color),
            roughness: 0.5,
            roughnessMap: this.roughness
        });
        var extrudeMesh = new Mesh(extrudeGeom, extrudeMat);
        // mesh border
        // if(object.border) {
        //   let edges = new EdgesGeometry( extrudeGeom );
        //   let line = new LineSegments( edges, new LineBasicMaterial( { color: newColor(object.border)} ) );
        //   extrudeMesh.attach(line)
        // }
        // shadow
        if (object.type !== 'ground') {
            extrudeMesh.castShadow = true;
            extrudeMesh.receiveShadow = true;
        }
        else {
            extrudeMesh.receiveShadow = true;
        }
        // mesh properties
        extrudeMesh.position.setY(object.position.y);
        extrudeMesh.name = object.name;
        extrudeMesh.userData = object;
        extrudeMesh.layers.set(0);
        extrudeGeom.computeBoundingSphere();
        this.scene.add(extrudeMesh);
        // add label
        if (object.type === "shape" && this.data.places && this.data.places.length > 0) {
            var cLabel = this.data.places.find(function (o) { return o.shape === object._id; });
            if (cLabel && cLabel.is_show) {
                this.label.createLabel(extrudeMesh, cLabel, object.height, true);
            }
        }
        // add parent
        if (object.parent_type === "scene") {
            this.scene.attach(extrudeMesh);
        }
        else {
            try {
                var find = object.parent_type === "buildings" ? this.rendered.buildings.find(function (o) { return o.userData._id === object.parent; }) :
                    object.parent_type === "grounds" ? this.rendered.grounds.find(function (o) { return o.userData._id === object.parent; }) : null;
                if (find) {
                    find.attach(extrudeMesh);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        // save data rendered
        object.type === "shape" && this.rendered.shapes.push(extrudeMesh);
        object.type === "building" && this.rendered.buildings.push(extrudeMesh);
        object.type === "ground" && this.rendered.grounds.push(extrudeMesh);
    };
    GadeObject.prototype.generateHierarchy = function (_a) {
        var _this = this;
        var grounds = _a.grounds, buildings = _a.buildings;
        var finalHierarchy = [];
        var getHierarchy = function (hierarchies) {
            var currentLvl = hierarchies[hierarchies.length - 1];
            var searchingLvl = hierarchies[0];
            if (currentLvl.parent_type === 'scene') {
                var saveHierarchy = __spreadArray([], hierarchies, true);
                saveHierarchy.shift();
                finalHierarchy.push(__assign(__assign({}, searchingLvl), { hierarchies: saveHierarchy }));
            }
            else {
                var parent_2 = undefined;
                if (currentLvl.parent_type === "grounds") {
                    parent_2 = _this.data.grounds.find(function (o) { return o._id === currentLvl.parent; });
                }
                else if (currentLvl.parent_type === "buildings") {
                    parent_2 = _this.data.buildings.find(function (o) { return o._id === currentLvl.parent; });
                }
                parent_2 && getHierarchy(__spreadArray(__spreadArray([], hierarchies, true), [parent_2], false));
            }
        };
        grounds.forEach(function (ground) {
            getHierarchy([ground]);
        });
        buildings.forEach(function (building) {
            getHierarchy([building]);
        });
        finalHierarchy = _.orderBy(finalHierarchy, ['hierarchies'], ['asc']);
        return finalHierarchy;
    };
    GadeObject.prototype.addUserObject = function (gltf) {
        var _this = this;
        if (!this.user)
            return;
        var mesh = gltf.scene.children[0];
        var ground = this.rendered.grounds.find(function (o) { return _this.user && o.userData._id === _this.user.level; });
        if (!ground)
            return;
        var material = new MeshStandardMaterial({
            color: newColor('#2AA5A5'),
        });
        mesh.name = "userpoint";
        mesh.userData = {
            name: "User Point"
        };
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(this.user.position.x, this.user.position.y, this.user.position.z);
        mesh.scale.set(3, -0.5, 3);
        this.scene.add(mesh);
        ground.attach(mesh);
        this.rendered.user = mesh;
    };
    GadeObject.prototype.updateHierarchy = function () {
        var _this = this;
        var savedHierarchy = __spreadArray([], this.hierarchy, true);
        this.hierarchy = [];
        this.scene.traverse(function (c) {
            if (c.userData && (c.userData.type === 'ground' || c.userData.type === 'building')) {
                var temp = savedHierarchy.find(function (s) { return s._id === c.userData._id && s.type === c.userData.type; });
                if (temp && temp.hierarchies) {
                    var cUser = c.userData;
                    cUser.hierarchies = temp.hierarchies.map(function (h) { return (__assign(__assign({}, h), { hierarchy: 'parent' })); });
                    cUser.children = c.children.map(function (child) { return (__assign(__assign({}, child.userData), { hierarchy: 'children' })); });
                    _this.hierarchy.push(cUser);
                }
            }
        });
        this.dispatch ? this.dispatch('updateHierarchy', this.hierarchy.map(function (lvl) { return ({ _id: lvl._id, type: lvl.type, name: lvl.name, parent: lvl.parent, parent_type: lvl.parent_type }); })) : console.error('Error on Dispatching UpdateHierarchy');
    };
    GadeObject.prototype.loadModel = function (model, gltf) {
        var group = new Group();
        gltf.scene.children.forEach(function (c) {
            var mesh = c.clone(false);
            var name = c.name.split('-');
            if (name[0] === 'colorable') {
                var material = new MeshStandardMaterial({
                    color: newColor(model.color),
                });
                mesh.material = material;
            }
            group.add(mesh);
        });
        group.name = model.name;
        group.userData = model;
        group.castShadow = true;
        group.receiveShadow = true;
        group.rotateY(model.rotation);
        group.position.set(model.position.x, model.position.y + 0.1, model.position.z);
        group.scale.set(model.scale.x, model.scale.y, model.scale.z);
        this.scene.add(group);
        var ground = this.rendered.grounds.find(function (o) { return o.userData._id === model.parent; });
        if (ground)
            ground.attach(group);
        var size = new Vector3();
        var box = new Box3().setFromObject(group);
        box.getSize(size);
        // add label
        if (model.type === 'shape' && this.data.places && this.data.places.length > 0) {
            var cLabel = this.data.places.find(function (o) { return o.shape === model._id; });
            if (cLabel && cLabel && cLabel.is_show) {
                this.label.createLabel(group, cLabel, size.y, true);
            }
        }
        this.rendered.shapes.push(group);
    };
    return GadeObject;
}());
export default GadeObject;
//# sourceMappingURL=Object.js.map