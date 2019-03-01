export class MutiMap<K, V> {

    private innerMap = new Map<K, Set<V>>();

    add(key:K, val: V){

        let valSet = this.innerMap.get(key);
        if(!valSet){
            valSet = new Set<V>();
            this.innerMap.set(key, valSet);
        }
        valSet.add(val);
    }

    set(key:K, valArray: Array<V>){
        const valSet = new Set(valArray);
        this.innerMap.set(key, valSet);
    }

    get(key:K): Array<V>{
        const valSet = this.innerMap.get(key);
        return valSet? Array.from(valSet) : [];
    }

    getAll(): Array<V>{
        const allValArray = new Array<V>();
        const vals = this.innerMap.values();
        let iterator: IteratorResult<Set<V>>;
        do{
            iterator = vals.next();
            const valSet = iterator.value;
            valSet.forEach( val => {
                allValArray.push(val);
            })
        }while(!iterator.done);
        return allValArray;
    }

    delete(key: K){
        this.innerMap.delete(key);
    }

    deleteItem(key:K, val:V){
        const valSet = this.innerMap.get(key);
        if(valSet){
            valSet.delete(val);
        }
    }

    clear(){
        this.innerMap = new Map<K, Set<V>>();
    }

    rowSize(key: K){
        const array = this.innerMap.get( key); 
        return  array && array.size || 0;
    }

    size(){
        let size = 0;
        const vals = this.innerMap.values();
        let iterator: IteratorResult<Set<V>>;
        do{
            iterator = vals.next();
            const valSet = iterator.value;
            size +=  valSet && valSet.size || 0;
        }while(!iterator.done);
        return size;
    }

    
}