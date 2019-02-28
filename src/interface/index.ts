export interface  AnimationRecordEventName{
    
    onRecoding:  'onRecoding',

}

export class AnimationRecordEvent{

    eventName: string;

    data: any;
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

    stop(): Promise<Blob>;

    addEventListener( animationRecordEventName:AnimationRecordEventName, callback: (animationRecordEvent: AnimationRecordEvent) => void ): void;

    removeEventListener(animationRecordEventName: AnimationRecordEventName, callback: (animationRecordEvent: AnimationRecordEvent) => void ): void;

    throwRecordError(animationRecordError: AnimationRecordError): void;
    

}