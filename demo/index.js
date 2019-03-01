import { AnimationRecorder } from "../dist/index"
const recorder = new AnimationRecorder()
recorder.init();
let isStart = false;
window.addEventListener('click', async ()=> {
    if(isStart){
        recorder.stop();
        isStart = false;
    }else{
        recorder.start();
        isStart = true;
    }
});
recorder.addEventListener('start', event =>{
    console.log(event);
})
recorder.addEventListener('stop', event => {
    console.log(event);
})
recorder.addEventListener('audioprocess', event => {
    console.log(event);
})
