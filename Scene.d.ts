import { Scene } from 'three';
export interface GadeSceneType extends Scene {
    removeObject: (name: string) => void;
    removeObjectById: (id: number) => void;
}
export default class GadeScene extends Scene {
    removeObject: (name: string) => void;
    removeObjectById: (id: number) => void;
}
