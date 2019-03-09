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
            lineWidth: 2,
            waveCount: 3, 
            colors:[
                'rgba(255,152,152, 0.2)',
                'rgba(255,152,152, 0.5)',
                'rgba(255,152,152, 1)',
            ],
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

    private isRunning = false;

    private MIN_VOLUM = 0.08;

    private volum = this.MIN_VOLUM;


    private lastVolum = this.MIN_VOLUM;

    private volumAutoScale = 1;

    private maxInputVolum = 0;




    get Volum() {
        return this.volum
    }

    set Volum(volum: number){
        this.volum = Math.max(this.MIN_VOLUM,Math.min( this.volumAutoScale * volum + this.MIN_VOLUM, 1));
        if(volum > this.maxInputVolum){
            this.maxInputVolum = volum;
            this.volumAutoScale = 1/this.maxInputVolum;
        }
    }

    private initCanvas( container: HTMLElement ){

        this.container = container;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.setCanvasSize();
        container.appendChild(this.canvas);
        window.addEventListener('resize', this.setCanvasSize );
        
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

        if( !this.isRunning){
            this.run = this._tempRun;
            this.run();
            this.isRunning = true;
        }
    }

    stop(){

        if( this.isRunning){
            this.run =() => {};
            this.isRunning = false;
        }
    };

    destroy(){

        window.removeEventListener( 'resize', this.setCanvasSize );
    }

    private _tempRun = () => {
        this.beforeRender();
        this.context.clearRect(0,0, this.width, this.height);
        const fixedVolum = this.lastVolum + (this.volum - this.lastVolum) * 0.1;
        for(let i = 0; i < this.waveInfoArray.length; i++){
            const waveInfo = this.waveInfoArray[i];
            this.paintWave( waveInfo.offesetX, waveInfo.color, (i+1)/this.waveInfoArray.length, fixedVolum  );
            waveInfo.offesetX += Math.PI * ( 0.05 + 0.05 * fixedVolum );
        }
        this.lastVolum = fixedVolum;
        requestAnimationFrame(this.run)
    }

    private paintWave( offsetX: number, color: string, amplitudeScale: number, volum: number ){
        
        this.context.strokeStyle = color || 'black';
        this.context.lineWidth = this.config.lineWidth;
        const halfHeight = this.height * 0.5;
        this.context.beginPath();
        this.context.moveTo(0, halfHeight);
        for( let x = 0; x < this.width; x+=2 ){
            const proportionX = x/this.width;
            const theta = 2 * Math.PI * proportionX * 3;
            const scaleY = 0.5 * Math.sin(Math.PI * proportionX);
            this.context.lineTo( x, halfHeight * amplitudeScale * volum * scaleY * Math.sin( theta + offsetX ) + halfHeight );
        }
        this.context.stroke();
    }

    private run = () => {

    }

    beforeRender = () =>{

    }
}