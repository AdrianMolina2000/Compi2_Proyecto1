"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class InDecrement extends Nodo_1.Nodo {
    constructor(id, operador, line, column) {
        super(null, line, column);
        this.id = id;
        this.operador = operador;
    }
    execute(table, tree) {
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `La variable {${this.id}} no ha sido encontrada`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        this.tipo = variable.tipo;
        if (variable.tipo.tipo === tipo_1.tipos.ENTERO) {
            if (this.operador === "++") {
                variable.valor = variable.valor + 1;
                return table.getVariable(this.id).valor;
            }
            else if (this.operador === "--") {
                variable.valor = variable.valor - 1;
                return table.getVariable(this.id).valor;
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `No se puede Incrementar o Decrementar el tipo ${variable.tipo}`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        else if (variable.tipo.tipo === tipo_1.tipos.DECIMAL) {
            if (this.operador === "++") {
                variable.valor = variable.valor + 1;
                return table.getVariable(this.id).valor;
            }
            else if (this.operador === "--") {
                variable.valor = variable.valor - 1;
                return table.getVariable(this.id).valor;
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `No se puede Incrementar o Decrementar el tipo ${variable.tipo}`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `No se puede Incrementar o Decrementar el tipo ${variable.tipo}`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("Incremento/Decremento");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo(this.operador);
        return nodo;
    }
}
exports.InDecrement = InDecrement;
