import { AnimationRecorder } from "../dist/index"
const recorder = new AnimationRecorder()
recorder.init();
recorder.start();
let isStart = true;
window.addEventListener('click', ()=> {
    if(isStart){
        recorder.stop();
        isStart = false;
    }else{
        recorder.start();
        isStart = true;
    }
})
