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
export default class Gademap {
    constructor(options) {
        this.changeLevel = (level, deletePath = true) => {
            return new Promise(async (res) => {
                // if(this.level && level._id === this.level._id && level.type === this.level.type) return;
                if (this.level && level._id === this.level._id && level.type === this.level.type) {
                    res("");
                    return null;
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
                    let levelParent = level.parent_type === "buildings"
                        ? this.objects.data.buildings.find(o => o._id === level.parent)
                        : this.objects.data.grounds.find(o => o._id === level.parent);
                    // layer selection
                    let findLayer = this.objects.layers.find(l => (l.building.userData._id === level._id && l.building.userData.type === level.type)
                        || (levelParent.type === 'building' && l.building.userData._id === levelParent._id));
                    if (findLayer) {
                        this.camera.layers.set(findLayer.number);
                        this.raycaster.layers.set(findLayer.number);
                    }
                    else {
                        this.camera.layers.enableAll();
                        this.raycaster.layers.enableAll();
                    }
                }
                await this.calibration.calibrate(level);
                res("");
            });
        };
        this._changeLevelData = (level) => {
            this.level = level;
            this.objects.level = level;
        };
        this.checkHierarchy = (checkLevel) => {
            let level = Object.assign({}, this.level);
            if (level.type === 'Scene') {
                level = this.data.scene;
            }
            let currentlevelHierarchy = this.objects.hierarchy.findIndex(hie => hie._id === level._id && hie.type === level.type);
            let checkLevelHierarchy = this.objects.hierarchy.findIndex(hie => hie._id === checkLevel._id && hie.type === checkLevel.type);
            return currentlevelHierarchy >= checkLevelHierarchy ? false : true;
        };
        this.onMouseClick = (event) => {
            if (this.animation.isAnimating)
                return null;
            let canvasBounds = this.renderer.canvas.getBoundingClientRect();
            this.mouse.x = (((event.clientX || event.touches[0].clientX) - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
            this.mouse.y = -(((event.clientY || event.touches[0].clientY) - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 + 1;
            // setting raycaster
            this.raycaster.setFromCamera(this.mouse, this.camera);
            // const currentLevel = this.objects.rendered[pluralIt(this.level.type)].find(lvl => lvl.userData._id === this.level._id);
            const currentLevel = [...this.objects.rendered.buildings, ...this.objects.rendered.grounds].find(lvl => { var _a; return lvl.userData._id === ((_a = this.level) === null || _a === void 0 ? void 0 : _a._id); });
            if (!currentLevel)
                return null;
            let raycasterObject = addToRaycaster(currentLevel);
            let intersects = _.uniqBy(this.raycaster.intersectObjects(raycasterObject), "distance");
            if (intersects.length > 0) {
                this._previewClick(intersects);
            }
        };
        this._previewClick = (intersects) => {
            if (intersects[0].object.parent.type === 'Group') {
                let findPlace = this.objects.data.places.find(p => p.shape === intersects[0].object.parent.userData._id);
                if (findPlace) {
                    this.selectPlace(findPlace, intersects[0].object.parent);
                }
                ;
            }
            // CLICK BUILDING WILL GO INSIDE BUILDING IN FIRST FLOOR
            else if (intersects[0].object.userData.type === 'building') {
                if (this.checkHierarchy(intersects[0].object.userData)) {
                    this.changeLevelParent(intersects[0].object);
                }
                else {
                    // IF ALREADY INSIDE BUILDING THEN SELECT PLACE INSIDE
                    if (intersects[1]) {
                        let findPlace = this.objects.data.places.find(p => p.shape === intersects[1].object.userData._id);
                        if (findPlace) {
                            this.selectPlace(findPlace, intersects[1].object);
                        }
                    }
                }
                // ONLY CLICK SHAPE THAT HAVE PLACE
            }
            else {
                let findPlace = this.objects.data.places.find(p => p.shape === intersects[0].object.userData._id);
                if (findPlace) {
                    this.selectPlace(findPlace, intersects[0].object);
                }
            }
        };
        this.changeLevelParent = (object) => {
            let lvl = object;
            if (object.userData.type === 'building') {
                let findGround = this.objects.rendered.grounds.find(g => g.userData.parent === lvl.userData._id && g.userData.parent_type === 'buildings');
                if (findGround) {
                    lvl = findGround;
                }
            }
            this.dispatch ? this.dispatch('changeLevel', lvl.userData) : console.error('Error on Dispatching');
            this.changeLevel(lvl.userData);
        };
        this.selectPlace = (place, shape) => {
            this.unselectAll(true);
            let placeShape = shape !== null && shape !== void 0 ? shape : this.objects.rendered.shapes.find(s => s.userData._id === place.shape);
            if (placeShape) {
                // IF DESTINATION LEVEL NOT SAME WITH CURRENT LEVEL 
                if (this.level._id !== placeShape.parent.userData._id) {
                    this.changeLevelParent(placeShape.parent);
                }
                // ANIMATION
                this.animation.selectShape(placeShape, 2);
                if (placeShape.type === 'Group') {
                    this.animation.scale(placeShape, 1, [placeShape.userData.scale.x * 1, placeShape.userData.scale.y * 1.5, placeShape.userData.scale.z * 1]);
                }
                else {
                    this.animation.scale(placeShape, 1, [1, 1.5, 1]);
                }
                this.animation.changeColor(placeShape, 1, this.data.highlight_color || '#2AA5A5');
                // SAVE SELECTED
                this.selected = [placeShape];
                this.dispatch ? this.dispatch('select', [place]) : console.error('Error on Dispatching');
            }
        };
        this.unselectAll = (deletePath = true) => {
            if (this.selected.length > 0) {
                this.selected.forEach(selected => {
                    if (selected.type === 'Group') {
                        this.animation.unscale(selected, 1, [selected.userData.scale.x * 1, selected.userData.scale.y, selected.userData.scale.z * 1]);
                    }
                    else {
                        this.animation.unscale(selected, 1, [1, selected.userData.scale ? selected.userData.scale.y : 1, 1]);
                    }
                    this.animation.changeColor(selected, 1, selected.userData.color);
                });
                this.selected = [];
                this.dispatch ? this.dispatch('unselect') : console.error('Error on Dispatching');
            }
            if (deletePath) {
                if (this.path.visiblePath.length > 0) {
                    this.path.visiblePath.forEach(vp => {
                        vp.visible = false;
                    });
                    this.path.visiblePath = [];
                }
            }
        };
        this.findAway = async (to, from) => {
            // FROM CHANGE LEVEL
            const availablePath = from ? this.checkPathByPlace(to, from) : this.checkPathByPlace(to);
            if (availablePath) {
                let toShape = this.objects.rendered.shapes.find(s => s.userData._id === to.shape);
                this.unselectAll(true);
                this.path.visiblePath = await this.animation.showPath(availablePath);
                this._selectAfterPath(toShape);
                this.dispatch ? this.dispatch('select', [to]) : console.error('Error on Dispatching');
                return;
            }
            else {
                // throw 'Path is Not Found'
                console.error("Path is Not Found");
                return;
            }
        };
        this._selectAfterPath = (obj) => {
            this.unselectAll(false);
            if (obj.type === 'Group') {
                this.animation.scale(obj, 1, [obj.userData.scale.x * 1, obj.userData.scale.y * 1.5, obj.userData.scale.z * 1]);
            }
            else {
                this.animation.scale(obj, 1, [1, 1.5, 1]);
            }
            this.animation.changeColor(obj, 1, this.data.highlight_color || '#2AA5A5');
            this.selected = [obj];
        };
        this.checkPathByPlace = (to, from) => {
            let availablePath;
            if (from) {
                availablePath = this.path.calculatedPath.find(cp => cp.to === to._id && cp.from._id === from._id);
            }
            else {
                availablePath = this.path.calculatedPath.find(cp => cp.to === to._id);
            }
            return availablePath;
        };
        this.getHierarchy = () => {
            return this.objects.hierarchy.map(lvl => ({ _id: lvl._id, type: lvl.type, name: lvl.name, parent: lvl.parent, parent_type: lvl.parent_type }));
        };
        this.resetPosition = async () => {
            await this.calibration.goDefault();
            this.unselectAll();
        };
        this.onWindowResize = () => {
            if (!this.ref)
                return null;
            this.camera.aspect = this.ref.current.clientWidth / this.ref.current.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.ref.current.clientWidth, this.ref.current.clientHeight);
        };
        this.isAnimating = () => {
            return this.animation.isAnimating;
        };
        this.animate = () => {
            this.renderScene();
            this.frameId = requestAnimationFrame(this.animate);
            if (this.objects.rendered.user && this.objects.rendered.user.name) {
                this.objects.rendered.user.rotateOnAxis(new Vector3(1, 0, 0).normalize(), Math.PI * 0.01);
            }
        };
        this.renderScene = () => {
            this.renderer.render(this.scene, this.camera);
            this.composer.render();
        };
        this.deleteAll = () => {
            this.renderer.dispose();
            const cleanMaterial = (material) => {
                material.dispose();
                // dispose textures
                for (const key of Object.keys(material)) {
                    const value = material[key];
                    if (value && typeof value === 'object' && 'minFilter' in value) {
                        value.dispose();
                    }
                }
            };
            this.scene.traverse((object) => {
                if (!object.isMesh)
                    return;
                object.geometry.dispose();
                if (object.material.isMaterial) {
                    cleanMaterial(object.material);
                }
                else {
                    for (const material of object.material)
                        cleanMaterial(material);
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
        this.defaultLevel = this.data.grounds.find(ground => ground._id === this.data.default_calibration.level._id);
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
    async init(progress = null, text = null) {
        // Renderer and Composer
        this.renderer.init()
            .then(() => {
            progress && text && progressAndText(progress, text, 30, 'Creating Environment');
            this.composer.init();
        })
            // LABEL
            .then(() => {
            progress && text && progressAndText(progress, text, 40, 'Make the Label Good');
            this.label.init(this.objects);
        })
            // Loading Objects
            .then(() => {
            progress && text && progressAndText(progress, text, 50, 'Loading Objects');
            this.objects.init();
        })
            // Calculating Path
            .then(() => {
            progress && text && progressAndText(progress, text, 60, 'Calculating Path');
            this.path.init();
        })
            // Setting Lightning
            .then(() => {
            progress && text && progressAndText(progress, text, 70, 'Setting Lightning');
            this.light.init();
        })
            // Setting Controller
            .then(() => {
            progress && text && progressAndText(progress, text, 80, 'Setting Controller');
            this.control.init();
        })
            // Calibrating Objects
            .then(async () => {
            progress && text && progressAndText(progress, text, 90, 'Calibrating Objects');
            if (this.defaultLevel) {
                await this.changeLevel(this.defaultLevel);
            }
        })
            // Finishing Scene
            .then(() => {
            if (this.ref) {
                this.renderer.canvas.onclick = (e) => this.onMouseClick(e);
                this.renderer.canvas.ontouchstart = (e) => this.onMouseClick(e);
            }
            window.addEventListener('resize', () => this.onWindowResize(), false);
            setGadeThree(this);
        })
            // Starting Scene
            .then(() => {
            this.start();
            progress && text && progressAndText(progress, text, 100, 'Finished');
            this.dispatch ? this.dispatch('loaded') : console.error('Error on Dispatching');
        });
    }
    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }
}
