import { LottiePlayer } from "lottie-web";
import React, { forwardRef, ForwardRefRenderFunction, useImperativeHandle } from "react";
import { useLottieFactory } from "../hooks/useLottieFactory";
import { LottieProps, LottieRef, LottieState, LottieVersion } from "../types";
import { PlayerContainer, PlayerControls, PlayerDisplay } from "./player";
import { PlayerFailure } from "./player/PlayerFailure";
import { PlayerLoading } from "./player/PlayerLoading/PlayerLoading";

/**
 * High Order Component to build Lottie's animation component
 * with different versions of the animations
 *
 * @param lottie
 */
export const lottieHoc = <Version extends LottieVersion>(lottie: LottiePlayer) => {
  const Lottie: ForwardRefRenderFunction<LottieRef, LottieProps<Version>> = (props, ref) => {
    const {
      controls,
      LoadingOverlay,
      FailureOverlay,
      LoadingOverlayContent,
      FailureOverlayContent,
      ...hookOptions
    } = props;

    const { setContainerRef, ...lottieFactoryResult } = useLottieFactory<Version>(lottie, {
      ...hookOptions,
    });

    /**
     * Make the hook variables/methods available through the provided 'lottieRef'
     */
    useImperativeHandle(ref, () => lottieFactoryResult);

    const { state, totalFrames, loop, play, pause, stop, toggleLoop, seek, subscribe } =
      lottieFactoryResult;

    return (
      <PlayerContainer>
        <PlayerLoading
          show={state === LottieState.Loading}
          Component={LoadingOverlay}
          Content={LoadingOverlayContent}
        />

        <PlayerFailure
          show={state === LottieState.Failure}
          Component={FailureOverlay}
          Content={FailureOverlayContent}
        />

        <PlayerDisplay ref={setContainerRef} />

        <PlayerControls
          show={state !== LottieState.Loading && state !== LottieState.Failure && !!controls}
          elements={Array.isArray(controls) ? controls : undefined}
          state={state}
          totalFrames={totalFrames}
          loop={loop}
          play={play}
          pause={pause}
          stop={stop}
          seek={seek}
          toggleLoop={toggleLoop}
          subscribe={subscribe}
        />
      </PlayerContainer>
    );
  };

  return forwardRef(Lottie);
};