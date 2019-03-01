export interface  AnimationRecordEvents{
    
    "audioprocess":  AnimationRecordEvent<Float32Array>;

    "start": AnimationRecordEvent<null>;

    "stop": AnimationRecordEvent<null>;
    "error": AnimationRecordError;
}

export class AnimationRecordEvent<Data>{

    constructor(eventName: string, data: Data){
        this.eventName = eventName;
        this.data = data;
    }
    
    eventName: string;

    data: Data;
}

export enum AnimationRecordErrorName{

    NOT_SUPPORT_ERROR = 'NOT_SUPPORT_ERROR',

}
export class AnimationRecordError{

    constructor(name: AnimationRecordErrorName, message: string ){
        this.name = name;
        this.message = message;
    }

    name: AnimationRecordErrorName;
    
    message: string;
}

export interface AnimationRecordInterface{
    
    init(  config?: {bufferSize: number, numChannels: number, mimeType: string},
    containerElement?: HTMLElement): void;

    start(): Promise<void>;

    stop(): Blob;

    addEventListener<K extends keyof AnimationRecordEvents>( animationRecordEventName: K, callback: (event: AnimationRecordEvents[K])=> void ): void;

    removeEventListener<K extends keyof AnimationRecordEvents>(animationRecordEventName: K, callback: (event: AnimationRecordEvents[K]) => void ): void;

    throwRecordError(animationRecordError: AnimationRecordError): void;
    

}