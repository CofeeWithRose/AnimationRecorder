import { AnimationRecordInterface, AnimationRecordError, AnimationRecordErrorName } from "./interface";

export class AnimationRecorder implements AnimationRecordInterface{

    init( containerElement: HTMLElement){

    }

    async start(){
        await const mediaStream: MediaStream =  this.getUserMedia({ audio: true});

    }

    stop(){

    }

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

    private 
}