import {  AnimationRecordError, AnimationRecordEvents } from "./interface/index";
import { EventEmitter } from "./util/events/index";
import { RecordEvent, RecordErrorName, RecorderInterface, RcorderConfig, RecordError, RecordErrorMessage } from "./interface/RecorderInterface";


export class Recorder implements RecorderInterface {

    private audioContext: AudioContext;

    protected config:RcorderConfig;

    private mediaStreamAudioSourceNode: MediaStreamAudioSourceNode;

    private analyserNode: AnalyserNode;

    private scriptProcessorNode: ScriptProcessorNode;

    private eventEmit = new  EventEmitter();

    private recordData = [new Array<Float32Array>()];

    private state: AudioContextState = 'suspended'; 

    private mediaStream: MediaStream;

    init( config?: RcorderConfig ){
        this.config = {bufferSize: 4096, numChannels: 2, mimeType: 'audio/wav', ...config};
        
    }
    
    async start():Promise<void>{
        
        if(! this.config){
            throw 'Please execute init method before start.';
        }else{
            this.start = async () => {
                if( 'suspended' === this.state ){

                    try{
                        this.audioContext = this.audioContext ||this.createAudioContext();
                        this.audioContext.onstatechange = (event: Event) => {
                            this.state = <AudioContextState>(<any>event.target).state;
                            this.eventEmit.emit('statechange', new RecordEvent<AudioContextState>('statechange', this.state))
                        };
                        const { bufferSize, numChannels } = this.config;
                        this.analyserNode = this.audioContext.createAnalyser();
                        this.scriptProcessorNode = this.audioContext.createScriptProcessor( bufferSize, numChannels, numChannels );
                        this.scriptProcessorNode.addEventListener( 'audioprocess', this.audioprocess );
                        this.mediaStream  = await this.getUserMedia({ audio: true});
                        this.mediaStreamAudioSourceNode =  this.audioContext.createMediaStreamSource(this.mediaStream);
                        this.mediaStreamAudioSourceNode.connect(this.analyserNode);
                        this.analyserNode.connect(this.scriptProcessorNode);
                        this.scriptProcessorNode.connect(this.audioContext.destination);
                        this.audioContext.resume();
                        // this.eventEmit.emit('start', new RecordEvent<null>('start', null));
                    }catch(error){
                        this.throwRecordError(error);
                    }
                }
            }
             
            return this.start();
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

        if( 'running' === this.state ){
            this.mediaStream.getAudioTracks().forEach( track => track.stop());
            this.scriptProcessorNode.disconnect();
            this.mediaStreamAudioSourceNode.disconnect();
            this.audioContext.suspend();
            this.scriptProcessorNode = null;
            this.mediaStreamAudioSourceNode = null;
          
        }
        
    }

    exportAudio(){
        const waveBlob = this.encodeWave();
        this.recordData = [new Array<Float32Array>()];
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

    getFloatTimeDomainData(array: Uint8Array){
        try{
            if(this.analyserNode){
            
                this.analyserNode.getByteFrequencyData(array);
                return true;
            } 
        }catch(e){
            this.throwRecordError(e);
        }
       
    }

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
        const channelNumber = audioProcessingEvent.inputBuffer.numberOfChannels;
        let res = new Array<Float32Array>();
        for(let i =0 ;i< channelNumber; i++){
            const data = audioProcessingEvent.inputBuffer.getChannelData(i);
            res.push(data);
        }
        this.recordData.push(res);
        this.eventEmit.emit('audioprocess', new RecordEvent('audioprocess', res));
    }

    
    private getUserMedia(constrians: MediaStreamConstraints){
        
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
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
        this.audioContext.close();
        this.audioContext = null;
        this.eventEmit.emit('destroy', new RecordEvent<null>('destroy', null));
    }
}