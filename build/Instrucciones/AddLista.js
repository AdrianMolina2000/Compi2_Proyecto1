"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class AddLista extends Nodo_1.Nodo {
    constructor(id, expresion, line, column) {
        super(null, line, column);
        this.id = id;
        this.expresion = expresion;
    }
    execute(table, tree) {
        const result = this.expresion.execute(table, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        this.dar = result;
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `El Arreglo {${this.id}} no ha sido encontrada`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        var arreglo = variable.valor.valor;
        if (variable.tipo.tipo != this.expresion.tipo.tipo) {
            if ((variable.tipo.tipo == tipo_1.tipos.DECIMAL) && (this.expresion.tipo.tipo == tipo_1.tipos.ENTERO)) {
                this.expresion.tipo.tipo = tipo_1.tipos.DECIMAL;
                arreglo.push(this.expresion);
                variable.valor = arreglo;
                return null;
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `No se puede ingresar un valor de diferente tipo al de la lista {${this.id}}`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        else {
            if (variable.tipo2.tipo == tipo_1.tipos.ARREGLO) {
                arreglo.push(this.expresion);
                // variable.valor = arreglo;
                return null;
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `No se puede agregar un valor a {${this.id}}`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ADD");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(".add");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.expresion.getNodo());
        nodo.agregarHijo(")");
        return nodo;
    }
}
exports.AddLista = AddLista;
