import { Pt } from "pts";
import { UserFramework } from "../state/userState";

export type DisplayPoint = {
    name: string;
    userFramework: UserFramework | null;
    coord: [number, number];
    position: Pt;
    selected: boolean;
};

export type TwinklePoint = {
    coord: [number, number];
    position: Pt;
    opacity: number;
    twinkleSpeed: number;
    maxOpacity: number;
}

