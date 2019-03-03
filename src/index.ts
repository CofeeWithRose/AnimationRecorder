import { AnimationRecordInterface, AnimationRecordError, AnimationRecordEvents, AnimationRecordConfig } from "./interface/index";
import { WaveAnimationInterface } from "./interface/WaveAnimationInterface";
import { WaveAnimation } from "./WaveAnimation";
import { Recorder } from "./Recorder";

export class AnimationRecorder implements AnimationRecordInterface{


    private recorder = new Recorder();

    private animation: WaveAnimationInterface;

    private config: AnimationRecordConfig;
    
    init(config?: AnimationRecordConfig, containerElement?: HTMLElement){

        this.config = config || {};
        this.recorder.init(config);
        if( containerElement){
            this.animation = new WaveAnimation(containerElement, this.config.waveAnimationConfig);
            this.start = async ()=> {
                const promise = await this.tempStart();
                this.animation.start();
                return promise;
            };
            this.stop = () => {
                this.animation.stop();
                return this.recorder.stop();
            };
            this.destroy = () => {
                this.animation.destroy();
                this.recorder.destroy();
            }
        }else{
            this.start = this.tempStart;
            this.stop = this.tempStop;
            this.destroy = this.tempDestroy;
        }
    }

    private async tempStart(){
        return await  this.recorder.start();
    }


    start(): Promise<void> {
        throw 'Please execute init method before start';
    }

    private tempStop(): Blob{
        return this.recorder.stop();
    }

    stop(): Blob{
        throw 'Please execute init method before stop';
    }

    addEventListener<K extends keyof AnimationRecordEvents>( animationRecordEventName: K, listener: (event: AnimationRecordEvents[K])=> void ){
        this.recorder.addEventListener(animationRecordEventName, listener);
    };

    removeEventListener<K extends keyof AnimationRecordEvents>(animationRecordEventName: K, listener: (event: AnimationRecordEvents[K]) => void ){
        this.recorder.removeEventListener(animationRecordEventName, listener);
    };

    throwRecordError(animationRecordError: AnimationRecordError){
        this.recorder.throwRecordError( animationRecordError );
    };
   
    private tempDestroy(){
        this.recorder.destroy();
    }

    destroy(){

    }

}
