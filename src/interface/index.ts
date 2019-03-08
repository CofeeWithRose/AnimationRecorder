import { RecordEvents, RecordError, RecordErrorName, RcorderConfig, RecorderInterface } from "./RecorderInterface";
import { WaveAnimationConfig } from "./WaveAnimationInterface";

export interface  AnimationRecordEvents extends RecordEvents{
    
   
}


export class AnimationRecordError extends RecordError{

}

export interface AnimationRecordConfig extends RcorderConfig {

    waveAnimationConfig?: WaveAnimationConfig;

}

export interface AnimationRecordInterface extends RecorderInterface{

    init(  config?: AnimationRecordConfig, containerElement?: HTMLElement): void;



    throwRecordError(animationRecordError: AnimationRecordError): void;
    

}