import { PerspectiveCamera } from 'three';
export default class Camera extends PerspectiveCamera {
    constructor(ref) {
        super(75, ref.current.clientWidth / ref.current.clientHeight, 0.1, 10000);
        this.getCurrentPosition = () => {
            return this.position;
        };
    }
}
