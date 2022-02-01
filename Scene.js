import { Scene } from 'three';
export default class GadeScene extends Scene {
    constructor() {
        super(...arguments);
        this.removeObject = (name) => {
            let selectedObject = this.getObjectByName(name);
            if (selectedObject && selectedObject.parent) {
                selectedObject.parent.remove(selectedObject);
            }
        };
        this.removeObjectById = (id) => {
            const obj = this.getObjectById(id);
            if (obj) {
                const parent = obj.parent;
                if (parent) {
                    parent.remove(obj);
                }
            }
        };
    }
}
