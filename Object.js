import { TextureLoader, RepeatWrapping, Vector2, Shape, ExtrudeBufferGeometry, MeshStandardMaterial, Mesh, Group, sRGBEncoding, Box3, Vector3, } from 'three';
import _ from 'lodash';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { generateCurves, newColor } from "./Helper";
export default class GadeObject {
    constructor(data, scene, level, label, animation, dispatch) {
        this.showAllLevels = async () => {
            const allLevel = [...this.rendered.grounds, this.rendered.buildings];
            allLevel.forEach(object => {
                this.animation.showHideObject3D(object, true);
            });
            return null;
        };
        this.hideLevels = async (level) => {
            const renderedLevel = level.type === "building" ? this.rendered.buildings.find((b) => b.userData._id === level._id)
                : this.rendered.grounds.find((g) => g.userData._id === level._id);
            if (renderedLevel) {
                const exceptions = [];
                exceptions.push(renderedLevel.userData._id);
                if (level.type === "building") {
                    this.animation.addTransparentBuilding(renderedLevel);
                    const child = this.rendered.grounds.find((g) => g.userData.parent === level._id);
                    if (child) {
                        this.animation.showHideObject3D(child, true);
                        exceptions.push(child.userData._id);
                    }
                }
                else if (level.parent_type === "buildings") {
                    const parent = this.rendered.buildings.find((b) => b.userData._id === level.parent);
                    this.animation.showHideObject3D(renderedLevel, true);
                    if (parent) {
                        this.animation.addTransparentParentBuilding(parent);
                        exceptions.push(parent.userData._id);
                    }
                }
                else {
                    this.animation.showHideObject3D(renderedLevel, true);
                }
                const allLevel = [...this.rendered.buildings, ...this.rendered.grounds];
                const willBeHide = allLevel.filter(lvl => !exceptions.includes(lvl.userData._id));
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
            return null;
            // // get level itself
            // let renderedLevel = 
            //   level.type === "ground" ?
            //     this.data.grounds.filter(o => o._id === level._id)
            //     .map(obj => { return {_id: obj._id, type: obj.type, hierarchy: 'level'}})
            //   : this.data.buildings.filter(o => o._id === level._id)
            //   .map(obj => { return {_id: obj._id, type: obj.type, hierarchy: 'level'}});
            // // get level hierarchy of the level
            // let levelHierarchy = this.hierarchy.find(h => h._id === level._id && h.type === level.type);
            // let excepts = [...renderedLevel, ...levelHierarchy?.children, ...levelHierarchy?.hierarchies!];
            // // Show only necessary level
            // let allLevel: Array<LevelWithoutScene> = [...this.rendered.grounds, ...this.rendered.buildings];
            // allLevel.forEach((l: LevelWithoutScene) => {
            //   let find = excepts.find(e => e._id === l.userData._id && e.type === l.userData.type);
            //   // if includes in hierarchy show the level
            //   if(find) {
            //     // if the level itself is building make it transparent
            //     if(l.userData.type ==='building' && find.hierarchy === 'level') {
            //       this.animation.addTransparentBuilding(l);
            //     // if the parent is building make it transparent
            //     } 
            //     else if(l.userData.type ==='building' && find.hierarchy === 'parent') {
            //       this.animation.addTransparentParentBuilding(l);
            //     // otherwise just show it
            //     } 
            //     else {
            //       this.animation.showHideObject3D(l, true);
            //     }
            //   // else hide the level
            //   } else {
            //     this.animation.showHideObject3D(l, false);
            //   }
            // })
            // return null;
        };
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
    init() {
        return new Promise((res, rej) => {
            try {
                // load level
                this.hierarchy.forEach(lvl => {
                    this.add3DObj(lvl);
                });
                // load shapes
                this.data.shapes.forEach(shape => {
                    if (shape.file_name) {
                        this.modelLoader.load(shape.file_name, (gltf) => this.loadModel(shape, gltf), undefined, function (error) {
                            console.error(error);
                        });
                    }
                    else {
                        this.add3DObj(shape);
                    }
                });
                // add layers to buildings
                this.rendered.buildings.forEach((building, index) => {
                    building.layers.set(index + 1);
                    building.traverse(child => {
                        child.layers.set(index + 1);
                    });
                    this.layers.push({ number: index + 1, building });
                });
                // load free label
                this.data.labels.forEach(l => {
                    this.label.createFreeLabel(l);
                });
                // load user
                if (this.user) {
                    this.modelLoader.load(this.userURL, (gltf) => this.addUserObject(gltf), undefined, (error) => {
                        console.error(error);
                    });
                }
                this.updateHierarchy();
                res("done");
            }
            catch (err) {
                rej();
            }
        });
    }
    add3DObj(object) {
        // IF ADD MODEL
        if ("file_name" in object && object.file_name !== null) {
            this.modelLoader.load(object.file_name, (gltf) => this.loadModel(object, gltf), undefined, function (error) {
                console.error(error);
            });
            return;
        }
        // make a mesh
        let shapePoints = object.shape_points.map((dot) => {
            return new Vector2(dot.x, dot.y);
        });
        let shape;
        if (object.bezier_points.length > 0) {
            shape = generateCurves(object.bezier_points);
        }
        else {
            shape = new Shape(shapePoints);
        }
        let extrudeSettings = {
            steps: 1,
            depth: object.height,
            bevelEnabled: false
        };
        let extrudeGeom = new ExtrudeBufferGeometry(shape, extrudeSettings);
        extrudeGeom.rotateX(-Math.PI * 0.5);
        let extrudeMat = new MeshStandardMaterial({
            color: newColor(object.color),
            roughness: 0.5,
            roughnessMap: this.roughness
        });
        let extrudeMesh = new Mesh(extrudeGeom, extrudeMat);
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
            let cLabel = this.data.places.find(o => o.shape === object._id);
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
                let find = object.parent_type === "buildings" ? this.rendered.buildings.find(o => o.userData._id === object.parent) :
                    object.parent_type === "grounds" ? this.rendered.grounds.find(o => o.userData._id === object.parent) : null;
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
    }
    generateHierarchy({ grounds, buildings }) {
        let finalHierarchy = [];
        const getHierarchy = (hierarchies) => {
            const currentLvl = hierarchies[hierarchies.length - 1];
            const searchingLvl = hierarchies[0];
            if (currentLvl.parent_type === 'scene') {
                const saveHierarchy = [...hierarchies];
                saveHierarchy.shift();
                finalHierarchy.push(Object.assign(Object.assign({}, searchingLvl), { hierarchies: saveHierarchy }));
            }
            else {
                let parent = undefined;
                if (currentLvl.parent_type === "grounds") {
                    parent = this.data.grounds.find((o) => o._id === currentLvl.parent);
                }
                else if (currentLvl.parent_type === "buildings") {
                    parent = this.data.buildings.find((o) => o._id === currentLvl.parent);
                }
                parent && getHierarchy([...hierarchies, parent]);
            }
        };
        grounds.forEach(ground => {
            getHierarchy([ground]);
        });
        buildings.forEach(building => {
            getHierarchy([building]);
        });
        finalHierarchy = _.orderBy(finalHierarchy, ['hierarchies'], ['asc']);
        return finalHierarchy;
    }
    addUserObject(gltf) {
        if (!this.user)
            return;
        let mesh = gltf.scene.children[0];
        let ground = this.rendered.grounds.find(o => this.user && o.userData._id === this.user.level);
        if (!ground)
            return;
        let material = new MeshStandardMaterial({
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
    }
    updateHierarchy() {
        let savedHierarchy = [...this.hierarchy];
        this.hierarchy = [];
        this.scene.traverse(c => {
            if (c.userData && (c.userData.type === 'ground' || c.userData.type === 'building')) {
                const temp = savedHierarchy.find(s => s._id === c.userData._id && s.type === c.userData.type);
                if (temp && temp.hierarchies) {
                    let cUser = c.userData;
                    cUser.hierarchies = temp.hierarchies.map(h => (Object.assign(Object.assign({}, h), { hierarchy: 'parent' })));
                    cUser.children = c.children.map(child => (Object.assign(Object.assign({}, child.userData), { hierarchy: 'children' })));
                    this.hierarchy.push(cUser);
                }
            }
        });
        this.dispatch ? this.dispatch('updateHierarchy', this.hierarchy.map(lvl => ({ _id: lvl._id, type: lvl.type, name: lvl.name, parent: lvl.parent, parent_type: lvl.parent_type }))) : console.error('Error on Dispatching UpdateHierarchy');
    }
    loadModel(model, gltf) {
        let group = new Group();
        gltf.scene.children.forEach(c => {
            let mesh = c.clone(false);
            let name = c.name.split('-');
            if (name[0] === 'colorable') {
                let material = new MeshStandardMaterial({
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
        let ground = this.rendered.grounds.find(o => o.userData._id === model.parent);
        if (ground)
            ground.attach(group);
        let size = new Vector3();
        let box = new Box3().setFromObject(group);
        box.getSize(size);
        // add label
        if (model.type === 'shape' && this.data.places && this.data.places.length > 0) {
            let cLabel = this.data.places.find(o => o.shape === model._id);
            if (cLabel && cLabel && cLabel.is_show) {
                this.label.createLabel(group, cLabel, size.y, true);
            }
        }
        this.rendered.shapes.push(group);
    }
}
