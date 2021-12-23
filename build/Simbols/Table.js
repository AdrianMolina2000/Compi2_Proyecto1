"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Table {
    constructor(Anterior) {
        this.Anterior = Anterior;
        this.Variables = new Map();
        this.variablesNum = 0;
        this.temporal = 0;
        this.etiqueta = 0;
        this.heap = 0;
        this.stack = 0;
        this.tempStorage = [];
        this.ambito = false; // false = global, true = local
        this.listaReturn = [];
        this.sizeActual = [];
        this.bandera = 0;
        this.banderastr = 0;
        this.banderapow = 0;
    }
    setVariable(simbol) {
        let ambito;
        for (ambito = this; ambito != null; ambito = ambito.Anterior) {
            for (let key of Array.from(ambito.Variables.keys())) {
                if (key.toLowerCase() === simbol.id.toLowerCase()) {
                    // return `La variable ${key} ya ha sido declarada.`;
                    simbol.stack = this.getStack();
                    this.variablesNum++;
                    return this.Variables.set(simbol.id.toLowerCase(), simbol);
                }
            }
        }
        simbol.stack = this.getStack();
        this.variablesNum++;
        this.Variables.set(simbol.id.toLowerCase(), simbol);
        return null;
    }
    getVariable(id) {
        let ambito;
        for (ambito = this; ambito != null; ambito = ambito.Anterior) {
            for (let key of Array.from(ambito.Variables.keys())) {
                if (key.toLowerCase() === id.toLowerCase()) {
                    return ambito.Variables.get(key.toLocaleLowerCase());
                }
            }
        }
        return null;
    }
    getTemporal() {
        return "t" + ++this.temporal;
    }
    getTemporalActual() {
        return "t" + this.temporal;
    }
    getHeap() {
        return this.heap++;
    }
    getStack() {
        return this.stack++;
    }
    setStack(value) {
        this.stack = value;
    }
    getEtiqueta() {
        return "L" + ++this.etiqueta;
    }
    getEtiquetaActual() {
        return "L" + this.etiqueta;
    }
    setTrue(etiqueta) {
        this.trueL = etiqueta;
    }
    getTrue() {
        return "L" + this.trueL;
    }
    setFalse(etiqueta) {
        this.falseL = etiqueta;
    }
    getFalse() {
        return "L" + this.falseL;
    }
    AgregarTemporal(temp) {
        this.tempStorage.push(temp);
    }
    QuitarTemporal(temp) {
        let index = this.tempStorage.indexOf(temp);
        this.tempStorage.splice(index, 1);
    }
}
exports.Table = Table;
