"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Break_1 = require("../Expresiones/Break");
const NodoAST_1 = require("../Abstract/NodoAST");
const Relacional_1 = require("../Expresiones/Relacional");
class Switch extends Nodo_1.Nodo {
    constructor(expresion, listaCasos, defal, line, column) {
        super(null, line, column);
        this.expresion = expresion;
        this.listaCasos = listaCasos;
        this.defal = defal;
    }
    execute(table, tree) {
        const newtable = new Table_1.Table(table);
        var ejecutado = false;
        var ejecutado2 = false;
        if (this.listaCasos != null) {
            for (let caso of this.listaCasos) {
                const caso2 = caso.execute(newtable, tree);
                var condicion = new Relacional_1.Relacional(this.expresion, caso2.expresion, '==', this.line, this.column);
                if (condicion.execute(newtable, tree) || ejecutado) {
                    ejecutado2 = true;
                    for (let i = 0; i < caso2.instrucciones.length; i++) {
                        const res = caso2.instrucciones[i].execute(newtable, tree);
                        if (res instanceof Break_1.Break) {
                            ejecutado = false;
                            break;
                        }
                        ejecutado = true;
                    }
                }
            }
        }
        if ((this.defal && !ejecutado2) || this.listaCasos == null || ejecutado) {
            for (let def of this.defal) {
                const res = def.execute(newtable, tree);
            }
        }
        /*
            int a=1;
switch(a){
  case 1 : print("efe");
  case 2: print("efe2"); break;
  default: print("d");
};


}*/
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("SWITCH");
        nodo.agregarHijo("switch");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.expresion.getNodo());
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        if (this.listaCasos != null) {
            var nodo2 = new NodoAST_1.NodoAST("Casos");
            for (let i = 0; i < this.listaCasos.length; i++) {
                nodo2.agregarHijo(this.listaCasos[i].getNodo());
            }
            nodo.agregarHijo(nodo2);
        }
        if (this.defal != null) {
            var nodo3 = new NodoAST_1.NodoAST("Default");
            for (let i = 0; i < this.defal.length; i++) {
                nodo3.agregarHijo(this.defal[i].getNodo());
            }
            nodo.agregarHijo(nodo3);
        }
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.Switch = Switch;
