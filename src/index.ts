import { AnimationRecordInterface, AnimationRecordError, AnimationRecordErrorName, AnimationRecordEvent, AnimationRecordEvents } from "./interface/index";
import { EventEmitter } from "./util/events/index";

export class AnimationRecorder implements AnimationRecordInterface{

    private audioContext = new AudioContext();

    private config: {bufferSize: number, numChannels: number, mimeType:string} = null;

    private mediaStreamAudioSourceNode: MediaStreamAudioSourceNode;

    private scriptProcessorNode: ScriptProcessorNode;

    private eventEmit = new  EventEmitter();


    init( 
        config?: {bufferSize: number, numChannels: number, mimeType:string},
        containerElement?: HTMLElement
    ){
        this.config = config||{bufferSize: 4096, numChannels: 2, mimeType: 'audio/wav'};
    }

    async start(){

        const { bufferSize, numChannels } = this.config;
        this.scriptProcessorNode = this.audioContext.createScriptProcessor( bufferSize, numChannels, numChannels );
        this.scriptProcessorNode.addEventListener('audioprocess', (audioProcessingEvent: AudioProcessingEvent) => {
            console.log( audioProcessingEvent );
            const data = audioProcessingEvent.inputBuffer.getChannelData(0);
            this.eventEmit.emit('audioprocess', new AnimationRecordEvent<Float32Array>('audioprocess', data));
        });

        const mediaStream  = await this.getUserMedia({ audio: true});
        this.mediaStreamAudioSourceNode =  this.audioContext.createMediaStreamSource(mediaStream);
        this.mediaStreamAudioSourceNode.connect(this.scriptProcessorNode);
        this.scriptProcessorNode.connect(this.audioContext.destination);
       
    }

    stop(){
        this.scriptProcessorNode.disconnect();
        this.mediaStreamAudioSourceNode.disconnect();
        console.log('stop.')
        return new Promise<Blob>( (resolve, reject) => {
            resolve(new Blob());
        })
    }

    addEventListener<K extends keyof AnimationRecordEvents>( animationRecordEventName: K, callback: (event: AnimationRecordEvents[K]) => void ): void {
        this.eventEmit.addListener( animationRecordEventName, callback);
    };

    removeEventListener<K extends keyof AnimationRecordEvents>(animationRecordEventName: K, callback: (event: AnimationRecordEvents[K]) => void ) {
        this.eventEmit.removeListener( animationRecordEventName, callback);
    };


    throwRecordError(error:AnimationRecordError){
        console.error(error);
    }

    
    private getUserMedia(constrians: MediaStreamConstraints){
        
        if(navigator.mediaDevices.getUserMedia){
            return navigator.mediaDevices.getUserMedia(constrians );
        }else if(navigator.getUserMedia){
            return new Promise<MediaStream>( (resolve: NavigatorUserMediaSuccessCallback, reject: NavigatorUserMediaErrorCallback) => {
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