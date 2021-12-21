"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Continue_1 = require("../Expresiones/Continue");
const Break_1 = require("../Expresiones/Break");
class Main extends Nodo_1.Nodo {
    constructor(tipo, instrucciones, line, column) {
        super(tipo, line, column);
        this.instrucciones = instrucciones;
    }
    execute(table, tree) {
        //com oasi ?
        // var nombre = this.id + "$";
        console.log("aqui");
        var result = this.instrucciones;
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const res = result[i].execute(table, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break) {
                    return res;
                }
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("MAIN");
        if (this.tipo.tipo == tipo_1.tipos.VOID) {
            nodo.agregarHijo("Void");
        }
        nodo.agregarHijo("main");
        nodo.agregarHijo("(");
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        var nodo3 = new NodoAST_1.NodoAST("INSTRUCCIONES");
        for (let i = 0; i < this.instrucciones.length; i++) {
            nodo3.agregarHijo(this.instrucciones[i].getNodo());
        }
        nodo.agregarHijo(nodo3);
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.Main = Main;
