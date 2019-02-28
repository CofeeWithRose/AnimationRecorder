import { AnimationRecordInterface, AnimationRecordError, AnimationRecordErrorName, AnimationRecordEventName, AnimationRecordEvent } from "./interface/index";

export class AnimationRecorder implements AnimationRecordInterface{

    private audioContext = new AudioContext();

    private config: {bufferSize: number, numChannels: number, mimeType:string} = null;

    init( 
        config = {bufferSize: 4096, numChannels: 2, mimeType: 'audio/wav'},
        containerElement?: HTMLElement
    ){
        this.config = config;
    }

    async start(){

        const { bufferSize, numChannels } = this.config;
        const scriptProcessorNode = this.audioContext.createScriptProcessor( bufferSize, numChannels, numChannels );
        scriptProcessorNode.addEventListener('audioprocess', (audioProcessingEvent: AudioProcessingEvent) => {
            console.log( audioProcessingEvent );
        });

        const  mediaStream  = await this.getUserMedia({ audio: true});
        const mediaStreamAudioSourceNode =  this.audioContext.createMediaStreamSource(mediaStream);
       
        scriptProcessorNode.connect(mediaStreamAudioSourceNode);
       
    }

    stop(){

        return new Promise<Blob>( (resolve, reject) => {
            resolve(new Blob());
        })
    }

    addEventListener( animationRecordEventName:AnimationRecordEventName, callback: (animationRecordEvent: AnimationRecordEvent) => void ){

    };

    removeEventListener(animationRecordEventName: AnimationRecordEventName, callback: (animationRecordEvent: AnimationRecordEvent) => void ) {

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