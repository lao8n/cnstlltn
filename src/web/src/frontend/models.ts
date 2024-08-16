import { Pt } from "pts";

export type DisplayPoint = {
    name: string;
    description: string;
    coord: [number, number];
    position: Pt;
    selected: boolean;
};