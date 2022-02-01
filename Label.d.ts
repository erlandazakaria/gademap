import { Mesh } from 'three';
import { LabelType, PlaceType } from './Types';
export interface GadeLabelType extends Label {
}
export default class Label {
    private ref;
    private objects;
    private imgLoader;
    constructor(ref: any);
    init(objects: any): Promise<string>;
    private loadImage;
    createLabel(mesh: Mesh, place: PlaceType, height: number, center: boolean): Promise<void>;
    createFreeLabel(label: LabelType): Promise<void>;
    private createRetinaCanvas;
    defaultFreeLabel: {
        id: number;
        is_show: boolean;
        rotation: number;
        type: string;
        content: string;
        text: string;
        image: any;
        image_scale: {
            x: number;
            y: number;
            z: number;
        };
        billboard_spacing: number;
        font_size: number;
        padding_left: number;
        padding_top: number;
        letter_spacing: number;
        font_weight: string;
        font_family: string;
        font_color: string;
        font_border_width: number;
        font_border_color: any;
        background_color: any;
        border_width: number;
        border_color: any;
        position: {
            x: number;
            y: number;
            z: number;
        };
        shape: {
            id: number;
            type: string;
        };
    };
}
