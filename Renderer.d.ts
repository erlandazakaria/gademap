import { WebGLRenderer } from 'three';
export interface RendererType extends WebGLRenderer {
    canvas: HTMLCanvasElement;
    init: () => Promise<string>;
}
export default class Renderer extends WebGLRenderer {
    private ref;
    canvas: HTMLCanvasElement;
    constructor(ref: any);
    init(): Promise<string>;
}
