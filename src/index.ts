import { AnimationRecordInterface, AnimationRecordError, AnimationRecordEvents, AnimationRecordConfig } from "./interface/index";
import { WaveAnimationInterface } from "./interface/WaveAnimationInterface";
import { WaveAnimation } from "./WaveAnimation";
import { Recorder } from "./Recorder";
import { RecordEvent, RecorderInterface } from "./interface/RecorderInterface";

export class AnimationRecorder extends Recorder implements AnimationRecordInterface  {


    private recorder:RecorderInterface = new Recorder();

    private animation: WaveAnimationInterface;

    protected config: AnimationRecordConfig;

    private volumArray = new Uint8Array(1024);
    
    init(config?: AnimationRecordConfig, containerElement?: HTMLElement){

        this.config = config || {};
        this.recorder.init(config);
  
        if( containerElement){
            this.animation = new WaveAnimation(containerElement, this.config.waveAnimationConfig);
            // this.recorder.addEventListener('audioprocess', this.setAnimationVolum);
            this.recorder.addEventListener('statechange', this.setAnimationController);
            this.animation.beforeRender = () => {
                    if(this.recorder.getFloatTimeDomainData(this.volumArray)){
                        let sum = 0;
                        this.volumArray.forEach( val => {
                            sum+= val;
                        })
                        this.animation.Volum = sum/(1024 * 255);
                    }
            }
        }
    }

    private setAnimationController =  (event:RecordEvent<AudioContextState>) => {
        const type: AudioContextState = event.data;
        console.log('type')
        if('running' === type){
            this.animation.start();
        }else{
            this.animation.stop();
        }
    }
    
    async start(): Promise<void> {
        
        if(!this.config){

            throw 'Please execute init method before start';
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
        }else{

            this.destroy = () => {
                this.recorder.removeEventListener('statechange', this.setAnimationController);
                return this.recorder.destroy();
            }
        }
        this.destroy();
    }

}
