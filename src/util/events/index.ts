import { MutiMap } from "../Map/index";

export class EventEmitter{

    private eventMap = new MutiMap<string, (...params:Array<any>) => void>();

    addListener(eventName: string, listener: (...any:Array<any>)=> any){
        this.eventMap.add(eventName, listener);
    }

    removeListener(eventName: string, listener: (...any:Array<any>)=> any){
        this.eventMap.deleteItem(eventName, listener);
    }

    emit(eventName: string, ...params:Array<any>){
        const listeners = this.eventMap.get(eventName);
        for(let i = 0; i< listeners.length; i++ ){
            try{
                listeners[i](...params);
            }catch(error){
                console.error(error);
            }
        }
    }

}