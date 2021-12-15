"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Simbolo_1 = require("../Simbols/Simbolo");
const NodoAST_1 = require("../Abstract/NodoAST");
class DeclaracionVarStruct extends Nodo_1.Nodo {
    constructor(tipo, nombre_struct, id, valor, line, column) {
        super(tipo, line, column);
        this.id = id;
        this.nombre_struct = nombre_struct;
        this.valor = valor;
    }
    execute(table, tree) {
        if (this.valor instanceof Excepcion_1.Excepcion) {
            return this.valor;
        }
        let simbolo;
        simbolo = new Simbolo_1.Simbolo(this.tipo, this.id[0], this.valor, new tipo_1.Tipo(tipo_1.tipos.STRUCTS), this.line, this.column);
        const res = table.setVariable(simbolo);
        tree.Variables.push(simbolo);
        if (this.valor != null) {
            console.log(this.id[0]);
            let struct_padre;
            struct_padre = table.getVariable(this.id[0]);
            //   console.log(table);
            for (let index = 0; index < struct_padre.valor.length; index++) {
                console.log(struct_padre.valor[index]);
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("DECLARACION");
        nodo.agregarHijo(this.tipo + "");
        nodo.agregarHijo(this.id);
        if (this.valor != null) {
            nodo.agregarHijo("=");
            nodo.agregarHijo(this.valor.getNodo());
        }
        return nodo;
    }
}
exports.DeclaracionVarStruct = DeclaracionVarStruct;
