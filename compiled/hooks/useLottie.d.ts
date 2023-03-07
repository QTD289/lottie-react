import { RendererType } from "lottie-web";
import { CSSProperties, ReactElement } from "react";
import { LottieOptions, LottieRefCurrentProps } from "../types";
declare const useLottie: <T extends RendererType = "svg" | "canvas">(props: LottieOptions<T>, style?: CSSProperties) => {
    View: ReactElement;
} & LottieRefCurrentProps;
export default useLottie;
