import {  AnimationRecordError, AnimationRecordEvents } from "./interface/index";
import { EventEmitter } from "./util/events/index";
import { RecordEvent, RecordErrorName, RecorderInterface, RcorderConfig, RecordError, RecordErrorMessage } from "./interface/RecorderInterface";


export class Recorder implements RecorderInterface {

    private audioContext: AudioContext;

    private config:RcorderConfig;

    private mediaStreamAudioSourceNode: MediaStreamAudioSourceNode;

    private scriptProcessorNode: ScriptProcessorNode;

    private eventEmit = new  EventEmitter();

    private recordData = new Array<Float32Array>();


    init( config?: RcorderConfig ){
        this.config = {bufferSize: 4096, numChannels: 2, mimeType: 'audio/wav', ...config};
     
        this.start = this._start;
    }
    
    async start(){
        throw 'Please execute init method before start.';
    }

    private async _start(){

        try{
            this.audioContext = this.audioContext ||this.createAudioContext();
            const { bufferSize, numChannels } = this.config;
            this.scriptProcessorNode = this.audioContext.createScriptProcessor( bufferSize, numChannels, numChannels );
            this.scriptProcessorNode.addEventListener( 'audioprocess', this.audioprocess );
            const mediaStream: MediaStream  = await this.getUserMedia({ audio: true});
            this.mediaStreamAudioSourceNode =  this.audioContext.createMediaStreamSource(mediaStream);
            this.mediaStreamAudioSourceNode.connect(this.scriptProcessorNode);
            this.scriptProcessorNode.connect(this.audioContext.destination);
            this.eventEmit.emit('start', new RecordEvent<null>('start', null));
        }catch(error){
            this.throwRecordError(error);
        }
    }

    private createAudioContext(){
        if((<any>window).AudioContext){
            return new AudioContext();
        }else if ((<any>window).webkitAudioContext){
            return new webkitAudioContext();
        }else{
            throw new RecordError(RecordErrorName.NOT_SUPPORT_ERROR, RecordErrorMessage.NOT_SUPPORT_ERROR);
        }
    }
    stop(){

        if( !this.scriptProcessorNode ){
            return;
        }

        this.scriptProcessorNode.disconnect();
        this.mediaStreamAudioSourceNode.disconnect();

        this.eventEmit.emit('stop', new RecordEvent<null>('stop', null));
        const waveBlob = this.encodeWave();

        this.scriptProcessorNode = null;
        this.mediaStreamAudioSourceNode = null;
        this.recordData = new Array<Float32Array>();
        return waveBlob;
    }

    addEventListener<K extends keyof AnimationRecordEvents>( 
        animationRecordEventName: K, callback: (event: AnimationRecordEvents[K]) => void 
    ): void {
        this.eventEmit.addListener( animationRecordEventName, callback);
    };

    removeEventListener<K extends keyof AnimationRecordEvents>(
        animationRecordEventName: K, callback: (event: AnimationRecordEvents[K]) => void 
    ): void {
        this.eventEmit.removeListener( animationRecordEventName, callback);
    };


    throwRecordError(error: RecordError){
        this.eventEmit.emit('error', error);
        console.error(error);
    }

    private encodeWave(): Blob {
        // 一般录音设备采样位数为 16 位.
        const dataByteLength = this.recordData.length * 16/8;
        const arrayBuffer = new ArrayBuffer( 44 + dataByteLength );
        const dataView = new DataView(arrayBuffer);
        let offset = 0;
        offset = this.writeString( dataView, offset, 'RIFF');
        return new Blob([arrayBuffer], {type: this.config.mimeType})
    }

    private writeString(dataView: DataView, offset: number, content: string): number{
        content = content || '';
        for(let i = 0; i< content.length; i++ ){
            dataView.setUint8(offset, content.charCodeAt(i));
            offset++;
        }
        return offset;
    }

    private audioprocess = (audioProcessingEvent: AudioProcessingEvent) => {
        const data = audioProcessingEvent.inputBuffer.getChannelData(0);
        this.recordData.push(data);
        this.eventEmit.emit('audioprocess', new RecordEvent<Float32Array>('audioprocess', data));
    }

    
    private getUserMedia(constrians: MediaStreamConstraints){
        
        if(navigator.mediaDevices.getUserMedia){
            return navigator.mediaDevices.getUserMedia(constrians );
        }else if(navigator.getUserMedia){
            return new Promise<MediaStream>( (
                resolve: NavigatorUserMediaSuccessCallback, reject: NavigatorUserMediaErrorCallback
            ) => {
                navigator.getUserMedia(constrians, resolve, reject);
            })
        }else{
            this.throwRecordError(new AnimationRecordError(
                RecordErrorName.NOT_SUPPORT_ERROR,
                RecordErrorMessage.NOT_SUPPORT_ERROR,
            ));
        }
        
    }

    destroy(){
        this.eventEmit.emit('destroy', new RecordEvent<null>('destroy', null));
    }
}