import {Simbolo} from "./Simbolo";

export class Table{
    Anterior: Table;
    Variables: Map<String, Simbolo>;

    temporal: number;
    etiqueta: number;
    trueL: number;
    falseL: number;
    heap: number;
    stack: number;
    tempStorage: Array<String>;
    ambito: Boolean;
    listaReturn: Array<String>;
    sizeActual: Array<number>;

    constructor(Anterior: Table){
        this.Anterior = Anterior;
        this.Variables = new Map<String, Simbolo>();

        this.temporal = 0;
        this.etiqueta = 0;
        this.heap = 0;
        this.stack = 0;
        this.tempStorage = [];
        this.ambito = false; // false = global, true = local
        this.listaReturn = [];
        this.sizeActual = [];
    }

    setVariable(simbol: Simbolo){
        let ambito: Table;
        for(ambito = this; ambito!= null; ambito = ambito.Anterior){
            for(let key of Array.from(ambito.Variables.keys())) {
                if(key.toLowerCase() === simbol.id.toLowerCase()){
                    // return `La variable ${key} ya ha sido declarada.`;
                    return this.Variables.set(simbol.id.toLowerCase(), simbol);
                }
            }
        }

        this.Variables.set(simbol.id.toLowerCase(), simbol);
        return null;
    }
    
    getVariable(id: String): Simbolo{
        let ambito: Table;
        for(ambito = this; ambito != null; ambito = ambito.Anterior){
            for(let key of Array.from( ambito.Variables.keys()) ) {

                if(key.toLowerCase() === id.toLowerCase()){
                    return ambito.Variables.get(key.toLocaleLowerCase());
                }
            }
        }
        return null;
    }

    getTemporal(): String {
        return "t" + ++this.temporal;
    }

    getTemporalActual(): String {
        return "t" + this.temporal;
    }

    getHeap(): number {
        return this.heap++;
    }

    getStack(): number {
        return this.stack++;
    }

    setStack(value: number): void {
        this.stack = value;
    }

    getEtiqueta(): String {
        return "L" + ++this.etiqueta;
    }
    
    getEtiquetaActual(): String {
        return "L" + this.etiqueta;
    }
    
    setTrue(etiqueta: number){
        this.trueL = etiqueta;
    }

    getTrue(){
        return "L"+this.trueL;
    }
    
    setFalse(etiqueta: number){
        this.falseL = etiqueta;
    }
    
    getFalse(){
        return "L"+this.falseL;
    }

    AgregarTemporal(temp: String){
        this.tempStorage.push(temp);
    }

    QuitarTemporal(temp: String): void {
        let index = this.tempStorage.indexOf(temp);
        this.tempStorage.splice(index, 1);
        
    }

}