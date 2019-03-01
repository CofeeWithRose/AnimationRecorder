import { AnimationRecordInterface, AnimationRecordError, AnimationRecordErrorName, AnimationRecordEvent, AnimationRecordEvents } from "./interface/index";
import { EventEmitter } from "./util/events/index";
import { WaveAnimationInterface } from "./interface/WaveAnimationInterface";
import { WaveAnimation } from "./WaveAnimation";

export class AnimationRecorder implements AnimationRecordInterface{

    private audioContext = new AudioContext();

    private config: {bufferSize: number, numChannels: number, mimeType:string} = null;

    private mediaStreamAudioSourceNode: MediaStreamAudioSourceNode;

    private scriptProcessorNode: ScriptProcessorNode;

    private eventEmit = new  EventEmitter();

    private recordData = new Array<Float32Array>();

    private waveAnimation: WaveAnimationInterface;

    init( 
        config?: {bufferSize: number, numChannels: number, mimeType:string},
        containerElement?: HTMLElement
    ){
        this.config = config||{bufferSize: 4096, numChannels: 2, mimeType: 'audio/wav'};
        if(containerElement ){
            this.waveAnimation = new WaveAnimation(containerElement);
            this.startAnim = () => this.waveAnimation.start();
            this.stopAnim = () => this.waveAnimation.stop();
        }
        this.start = this._start;
    }
    
    async start(){
        throw 'Please execute init method before start.';
    }

    private async _start(){

        try{
            const { bufferSize, numChannels } = this.config;
            this.scriptProcessorNode = this.audioContext.createScriptProcessor( bufferSize, numChannels, numChannels );
            this.scriptProcessorNode.addEventListener( 'audioprocess', this.audioprocess );
            const mediaStream: MediaStream  = await this.getUserMedia({ audio: true});
            this.mediaStreamAudioSourceNode =  this.audioContext.createMediaStreamSource(mediaStream);
            this.mediaStreamAudioSourceNode.connect(this.scriptProcessorNode);
            this.scriptProcessorNode.connect(this.audioContext.destination);
            this.startAnim();
            this.eventEmit.emit('start', new AnimationRecordEvent<null>('start', null));
        }catch(error){
            this.throwRecordError(error);
        }
    }

    private startAnim(){
    }
    private stopAnim(){

    }
    stop(){

        if( !this.scriptProcessorNode ){
            return;
        }

        this.scriptProcessorNode.disconnect();
        this.mediaStreamAudioSourceNode.disconnect();

        this.eventEmit.emit('stop', new AnimationRecordEvent<null>('stop', null));
        const waveBlob = this.encodeWave();

        this.scriptProcessorNode = null;
        this.mediaStreamAudioSourceNode = null;
        this.recordData = new Array<Float32Array>();
        this.stopAnim();
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


    throwRecordError(error:AnimationRecordError){
        this.eventEmit.emit('error', AnimationRecordError);
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
        this.eventEmit.emit('audioprocess', new AnimationRecordEvent<Float32Array>('audioprocess', data));
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
                AnimationRecordErrorName.NOT_SUPPORT_ERROR,
                'your browser is not support record.'
            ));
        }
        
    }

}
