import { ExtrudeBufferGeometry, Mesh } from "three";
export interface Pos2 {
    x: number;
    y: number;
    z: number;
}
export interface Pos3 {
    x: number;
    y: number;
    z: number;
}
export interface CurveType {
    type: string;
    quad?: Pos2;
    bezi1?: Pos2;
    bezi2?: Pos2;
    endPoint: Pos2;
}
interface PureLabel {
    is_show: Boolean;
    rotation: number;
    type: string;
    content: string;
    text: string;
    image: string;
    image_scale: Pos3;
    billboard_spacing: number;
    font_size: number;
    padding_left: number;
    padding_top: number;
    letter_spacing: number;
    font_weight: string;
    font_family: string;
    font_color: string;
    font_border_width: number;
    font_border_color: string;
    background_color: string;
    border_width: number;
    border_color: string;
}
export interface GadeObjectType {
    _id: string;
    map: string;
    type: string;
    name: string;
    height: number;
    color: string;
    position: Pos3;
    shape_points: Array<Pos2>;
    bezier_points: Array<CurveType>;
    parent: string;
    parent_type: string;
}
export interface SceneType {
    _id: string;
    type: "Scene";
}
export interface BuildingType extends GadeObjectType {
    type: "building";
    parent_type: "grounds";
}
export interface GroundType extends GadeObjectType {
    type: "ground";
    parent_type: "buildings" | "scene";
}
export interface ShapeType extends GadeObjectType {
    file_name: string;
    type: "shape";
    parent: string;
    parent_type: "grounds";
    rotation: number;
    scale: Pos3;
}
export declare type LevelType = SceneType | GroundType | BuildingType;
export interface PathEdgeType {
    _id: string;
    map: string;
    from: string | null;
    to: string;
    length: number;
}
export interface PathVerticeType {
    _id: string;
    map?: string;
    position: Pos3 | null;
    place: string | null;
    shape: string | null;
    type: string;
    gateway: string | null;
    gateway_type: string | null;
}
export interface CalibrationType {
    _id: string;
    map: string;
    view: string;
    level: LevelType;
    level_type: "grounds" | "scene" | "Scene" | "buildings";
    position: Pos3;
    target: Pos3;
}
export interface LabelType extends PureLabel {
    _id: string;
    map: string;
    position: Pos3;
    ground: string;
}
export interface PlaceType extends PureLabel {
    _id: string;
    map: string;
    shape: string;
    name: string;
    headlines: Array<string>;
    additionals: Array<string>;
    description: string;
    picture: string;
}
export interface MapType {
    _id: string;
    name?: string;
    highlight_color?: string;
    path_gap?: number;
    grid_size?: number;
    grid_division?: number;
    dot_color?: string;
    dot_size?: number;
    default_calibration: CalibrationType;
    status?: number;
}
export interface PinType {
    _id: string;
    map: string;
    level: string;
    position: Pos3;
    type: string;
}
export interface ScreenSaverType {
    _id: string;
    map?: string;
    name?: string;
    src?: string;
    type?: string;
    duration?: number;
    order?: number;
    expired?: Date;
}
export interface gadeData extends MapType {
    screensavers: ScreenSaverType;
    pin: PinType;
    scene: SceneType;
    shapes: Array<ShapeType>;
    grounds: Array<GroundType>;
    buildings: Array<BuildingType>;
    path_vertices: Array<PathVerticeType>;
    path_edges: Array<PathEdgeType>;
    calibrations: Array<CalibrationType>;
    places: Array<PlaceType>;
    labels: Array<LabelType>;
    models: Array<string>;
}
export declare type gadeDispatchType = (func: string, payload?: any) => void;
export interface RenderedBuildingType extends Mesh {
    userData: BuildingType;
}
export interface RenderedGroundType extends Mesh {
    userData: GroundType;
}
export interface RenderedShapeType extends Mesh<ExtrudeBufferGeometry> {
    userData: ShapeType;
}
export declare type RenderedLevelType = RenderedGroundType | RenderedBuildingType;
export interface RenderedLabelType extends Mesh {
    userData: LabelType;
}
export interface RenderedPinType extends Mesh {
    userData: PinType;
}
export interface RenderedPathEdge {
    _id?: string;
    map?: string;
    from?: null | PathVerticeType | string;
    to?: null | PathVerticeType | string;
    length: number;
    spheres?: Array<Mesh>;
}
export {};
