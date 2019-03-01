import { WaveAnimationInterface, WaveAnimationConfig } from "./interface/WaveAnimationInterface";

export class WaveAnimInfo {

    constructor(offsetX: number, color:string){

        this.offesetX = offsetX || 0;
        this.color = color || 'black';
    }
   
    offesetX: number;
    
    readonly color: string;
}

export class WaveAnimation implements WaveAnimationInterface{

    constructor(container: HTMLElement, config?: WaveAnimationConfig){
        
        this.config = { 
            waveCount: 3, 
            colors:['rgba(255,152,152, 0.2)', 'rgba(255,152,152, 0.5)','rgba(255,152,152, 1)'],
            ...config
        };
        this.initCanvas(container);
        this.initWaveInfo(this.config);
        this.start();
        this.stop()
    }


    private config: WaveAnimationConfig;

    private canvas: HTMLCanvasElement;

    private context: CanvasRenderingContext2D;

    private width: number;

    private height : number;

    private container: HTMLElement;

    private waveInfoArray = new Array<WaveAnimInfo>();

    private volum = 0.1;

    private isRunning = false;

    get Volum() {
        return this.volum
    }

    set Volum(volum: number){
        this.volum = Math.max(0.1,Math.min(volum * 2, 1));
    }

    private initCanvas( container: HTMLElement ){
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.setCanvasSize();
        container.appendChild(this.canvas);
        
    }

    private initWaveInfo(config?: WaveAnimationConfig){
        for(let i = 0; i < config.waveCount; i++){
            this.waveInfoArray.push(new WaveAnimInfo(
                 i * Math.PI * 0.5, 
                this.config.colors[i % this.config.colors.length]
            ))
        }
    }

    private setCanvasSize = () => {
        const containerStyleInfo = getComputedStyle(this.container);
        this.width = this.canvas.width = parseFloat(containerStyleInfo.width);
        this.height = this.canvas.height = parseFloat(containerStyleInfo.height);
    }

    
    start(){
        window.addEventListener('resize', this.setCanvasSize );
        if(! this.isRunning){
            this.run = this._tempRun;
            this.run();
            this.isRunning = true;
        }
    }

    stop(){
        window.removeEventListener('resize', this.setCanvasSize );
        if( this.isRunning){
            this.run =() => {};
            this.isRunning = false;
        }
    };

    private _tempRun = () => {
        this.context.clearRect(0,0, this.width, this.height);
        for(let i = 0; i < this.waveInfoArray.length; i++){
            const waveInfo = this.waveInfoArray[i];
            this.paintWave( waveInfo.offesetX, waveInfo.color, (i+1)/this.waveInfoArray.length );
            waveInfo.offesetX += Math.PI * 0.05 * this.volum;
        }
        requestAnimationFrame(this.run)
    }

    private paintWave( offsetX: number, color: string, amplitudeScale: number ){
        
        this.context.strokeStyle = color || 'black';
        const halfHeight = this.height * 0.5;
        this.context.beginPath();
        this.context.moveTo(0, halfHeight);
        for( let x = 0; x < this.width; x+=2 ){
            const proportionX = x/this.width;
            const theta = 2 * Math.PI * proportionX * 3 * this.volum;
            const scaleY = 0.5 * Math.sin(Math.PI * proportionX);
            this.context.lineTo( x, halfHeight * amplitudeScale * this.volum * scaleY * Math.sin( theta + offsetX ) + halfHeight );
        }
        this.context.stroke();
    }

    private run = () => {

    }
}