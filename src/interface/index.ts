import { RecordEvents, RecordError, RecordErrorName, RcorderConfig } from "./RecorderInterface";
import { WaveAnimationConfig } from "./WaveAnimationInterface";

export interface  AnimationRecordEvents extends RecordEvents{
    
   
}


export class AnimationRecordError extends RecordError{

}

export interface AnimationRecordConfig extends RcorderConfig {

    waveAnimationConfig?: WaveAnimationConfig;

}

export interface AnimationRecordInterface{

    init(  config?: AnimationRecordConfig, containerElement?: HTMLElement): void;

    start(): Promise<void>;

    stop(): Blob;

    destroy(): void;

    addEventListener<K extends keyof AnimationRecordEvents>( animationRecordEventName: K, callback: (event: AnimationRecordEvents[K])=> void ): void;

    removeEventListener<K extends keyof AnimationRecordEvents>(animationRecordEventName: K, callback: (event: AnimationRecordEvents[K]) => void ): void;

    throwRecordError(animationRecordError: AnimationRecordError): void;
    

}