import React, { ReactElement } from "react";
import { InteractivityProps } from "../types";
export declare function getContainerVisibility(container: Element): number;
export declare function getContainerCursorPosition(container: Element, cursorX: number, cursorY: number): {
    x: number;
    y: number;
};
export type InitInteractivity = {
    wrapperRef: React.RefObject<HTMLDivElement>;
    animationItem: InteractivityProps["lottieObj"]["animationItem"];
    actions: InteractivityProps["actions"];
    mode: InteractivityProps["mode"];
};
export declare const useInitInteractivity: ({ wrapperRef, animationItem, mode, actions, }: InitInteractivity) => void;
declare const useLottieInteractivity: ({ actions, mode, lottieObj, }: InteractivityProps) => ReactElement;
export default useLottieInteractivity;
