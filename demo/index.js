import { AnimationRecorder } from "../dist/index"
const recorder = new AnimationRecorder()
recorder.init({
    waveConfig:{
        // colors:['rgba(255,152,152, 0.2)', 'rgba(255,152,152, 0.5)','rgba(255,152,152, 1)']
    }
},document.body);
let isStart = false;
let lastTouchMiles = 0;
window.addEventListener('touchend', async ()=> {

    const now = Date.now();
    // if( now - lastTouchMiles < 500){
    //     recorder.destroy();
    //     return;
    // }
    if(isStart){
        recorder.stop();
        isStart = false;
    }else{
        recorder.start();
        isStart = true;
    }
    lastTouchMiles = Date.now();
});

recorder.addEventListener('error', event => {
    alert(event);
})

recorder.addEventListener('statechange', event =>{
    console.log(event);
})
recorder.addEventListener('stop', event => {
    console.log(event);
})


