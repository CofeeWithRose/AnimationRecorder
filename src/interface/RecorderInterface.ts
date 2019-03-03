export interface RecordEvents{

    "audioprocess":  RecordEvent<Float32Array>;

    "start": RecordEvent<null>;

    "stop": RecordEvent<null>;

    "destroy": RecordEvent<null>;
    
    "error": RecordError;
}


export class RecordError{

    constructor(name: RecordErrorName, message: RecordErrorMessage ){
        this.name = name;
        this.message = message;
    }

    name: RecordErrorName;
    
    message: RecordErrorMessage;
}

export enum RecordErrorName{

    NOT_SUPPORT_ERROR = 'NOT_SUPPORT_ERROR',

}
export enum RecordErrorMessage{

    NOT_SUPPORT_ERROR = 'your browser is not support record.',
}

export class RecordEvent<Data>{

    constructor(eventName: string, data: Data){
        this.eventName = eventName;
        this.data = data;
    }
    
    eventName: string;

    data: Data;
}

export interface RcorderConfig {
    
    bufferSize?: number;
    numChannels?: number;
    mimeType?:string;
}

export interface RecorderInterface {

    init():void;

    start(): void;

    stop(): Blob;

    destroy(): void;

    addEventListener<K extends keyof RecordEvents>( animationRecordEventName: K, listener: (event: RecordEvents[K])=> void ): void;

    removeEventListener<K extends keyof RecordEvents>(animationRecordEventName: K, listener: (event: RecordEvents[K]) => void ): void;

}