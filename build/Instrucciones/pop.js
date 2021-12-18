"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Pop extends Nodo_1.Nodo {
    constructor(id, line, column) {
        super(null, line, column);
        this.id = id;
    }
    execute(table, tree) {
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `El arreglo {${this.id}} no ha sido encontrado`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        var arreglo = variable.valor.valor;
        if (variable.tipo2.tipo == tipo_1.tipos.ARREGLO) {
            // variable.valor = arreglo;
            return arreglo.pop();
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `No se puede eliminar un valor a {${this.id}}`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("POP");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(".pop");
        nodo.agregarHijo("(");
        nodo.agregarHijo(")");
        return nodo;
    }
}
exports.Pop = Pop;
