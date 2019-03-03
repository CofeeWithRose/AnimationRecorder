import { RecordEvents, RecordError, RecordErrorName } from "./RecorderInterface";

export interface  AnimationRecordEvents extends RecordEvents{
    
   
}


export class AnimationRecordError extends RecordError{

}


export interface AnimationRecordInterface{
    
    init(  config?: {bufferSize: number, numChannels: number, mimeType: string},
    containerElement?: HTMLElement): void;

    start(): Promise<void>;

    stop(): Blob;

    destroy(): void;

    addEventListener<K extends keyof AnimationRecordEvents>( animationRecordEventName: K, callback: (event: AnimationRecordEvents[K])=> void ): void;

    removeEventListener<K extends keyof AnimationRecordEvents>(animationRecordEventName: K, callback: (event: AnimationRecordEvents[K]) => void ): void;

    throwRecordError(animationRecordError: AnimationRecordError): void;
    

}