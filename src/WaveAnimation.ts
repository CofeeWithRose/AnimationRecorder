import { WaveAnimationInterface, WaveAnimationConfig } from "./interface/WaveAnimationInterface";

export class WaveAnimation implements WaveAnimationInterface{

    constructor(container: HTMLElement, config?: WaveAnimationConfig){
        this.initCanvas(container);
    }

    private initCanvas( container: HTMLElement ){
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.setCanvasSize();
        
    }

    private setCanvasSize = () => {
        const containerStyleInfo = getComputedStyle(this.container);
        this.width = this.canvas.width = parseFloat(containerStyleInfo.width);
        this.height = this.canvas.height = parseFloat(containerStyleInfo.height);
    }

    private canvas: HTMLCanvasElement;

    private context: CanvasRenderingContext2D;

    private width: number;

    private height : number;

    private container: HTMLElement;

    start(){
        window.addEventListener('resize', this.setCanvasSize );
    }

    stop(){
        window.removeEventListener('resize', this.setCanvasSize );
    };

}