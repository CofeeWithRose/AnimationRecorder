import { AnimationRecorder } from "../dist/index"
const recorder = new AnimationRecorder()
recorder.init(null,document.body);
let isStart = false;
window.addEventListener('touchend', async ()=> {
    if(isStart){
        recorder.stop();
        isStart = false;
    }else{
        recorder.start();
        isStart = true;
    }
});

recorder.addEventListener('error', event => {
    console.log(event);
})

recorder.addEventListener('start', event =>{
    console.log(event);
})
recorder.addEventListener('stop', event => {
    console.log(event);
})
recorder.addEventListener('audioprocess', event => {
    // document.body.innerHTML = event.data;
    console.log(event);
})
