export interface RecordEvents{

    "destroy": RecordEvent<null>;

    "statechange": RecordEvent<AudioContextState>;
    
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

    init(config?: RcorderConfig):void;

    start():Promise<void>;

    stop(): void;

    exportAudio(): Blob;

    destroy(): void;

    addEventListener<K extends keyof RecordEvents>( animationRecordEventName: K, listener: (event: RecordEvents[K])=> void ): void;

    removeEventListener<K extends keyof RecordEvents>(animationRecordEventName: K, listener: (event: RecordEvents[K]) => void ): void;

    throwRecordError(recordError: RecordError): void;

    getFloatTimeDomainData(array: Uint8Array):boolean;
}