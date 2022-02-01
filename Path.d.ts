import { SphereBufferGeometry, MeshBasicMaterial, Mesh } from 'three';
import { gadeData, Pos3, RenderedPathEdge } from './Types';
import { GadeSceneType } from './Scene';
import GadeObject from './Object';
import { AnimationType } from './Animation';
export default class GadePath {
    private data;
    private gap;
    private scene;
    private objects;
    private animation;
    private pathColor;
    private pinLevel;
    private pinPosition;
    private pinVertice;
    private pinEdge;
    private pathEdges;
    calculatedPath: Array<any>;
    private drawedPath;
    visiblePath: Array<any>;
    constructor(data: gadeData, scene: GadeSceneType, objects: GadeObject, animation: AnimationType);
    init(): Promise<unknown>;
    drawingEdgeSpheres: () => void;
    drawSpheres: (spheres: Array<Pos3>) => Mesh<SphereBufferGeometry, MeshBasicMaterial>[];
    findPath: (to: string, from?: string) => {
        from: any;
        to: any;
        steps: any[];
    };
    generateSteps: (paths: Array<RenderedPathEdge>) => {
        from: any;
        to: any;
        steps: any[];
    };
}
