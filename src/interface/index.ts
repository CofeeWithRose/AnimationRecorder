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
    
    init(containerElement: HTMLElement): void;

    start(): Promise<void>;

    stop(): Promise<File>;

    addEventListener( AnimationRecordEventName, callback: (AnimationRecordEvent) => void ): void;

    removeEventListener(AnimationRecordEventName, callback: (AnimationRecordEvent) => void ): void;

    onRecoding(Float32Array): void;

    throwRecordError(AnimationRecordError): void;
    

}