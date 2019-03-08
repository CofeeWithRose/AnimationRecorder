import { AnimationRecordInterface, AnimationRecordError, AnimationRecordEvents, AnimationRecordConfig } from "./interface/index";
import { WaveAnimationInterface } from "./interface/WaveAnimationInterface";
import { WaveAnimation } from "./WaveAnimation";
import { Recorder } from "./Recorder";
import { RecordEvent, RecorderInterface } from "./interface/RecorderInterface";

export class AnimationRecorder extends Recorder implements AnimationRecordInterface  {


    private recorder:RecorderInterface = new Recorder();

    private animation: WaveAnimationInterface;

    protected config: AnimationRecordConfig;
    
    init(config?: AnimationRecordConfig, containerElement?: HTMLElement){

        this.config = config || {};
        this.recorder.init(config);
  
        if( containerElement){
            this.animation = new WaveAnimation(containerElement, this.config.waveAnimationConfig);
            this.recorder.addEventListener('audioprocess',( event:RecordEvent<Float32Array> ) => {
                let sum = 0;
                const data = event.data;
                const step = Math.floor( data.length * 0.01 );
                for(let i = 0; i < data.length; i+= step){
                    sum += Math.abs(data[i]);
                }
                this.animation.Volum = sum * 0.01;
            });
        }
    }

    async start(): Promise<void> {
        
        if(!this.config){

            throw 'Please execute init method before start';
        }else if(this.animation){

            this.start = async () => {
                this.animation.start();
                return  await  this.recorder.start();
            }
            
        }else{

            this.start = async () => {
                return  await  this.recorder.start();
            }
        }

        return this.start();
    }

    stop(): void{

        if(!this.config){

            throw 'Please execute init method before stop';
        }else if(this.animation){

            this.stop =  () => {
                this.animation.stop();
                return   this.recorder.stop();
            }
        }else{

            this.stop = () => {
                return   this.recorder.stop();
            }
        }

        return this.stop();
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

    destroy(){

        if(!this.config){

            throw 'Please execute init method before destroy';
        }else if(this.animation){

            this.destroy =  () => {
                this.animation.destroy();
                return this.recorder.destroy();
            }
            
        }else{

            this.destroy = () => {
                return this.recorder.destroy();
            }
        }
        this.destroy();
    }

}
