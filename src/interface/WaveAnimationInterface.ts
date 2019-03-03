export interface WaveAnimationConfig{

    colors: Array<string>;

    waveCount: number;

    lineWidth: number;
    
}
export interface WaveAnimationInterface {


    start():void;

    stop():void;

    Volum:number;

    destroy(): void;

}