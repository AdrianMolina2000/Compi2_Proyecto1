"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Length extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.ENTERO), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            if (this.expresion.tipo.tipo == 6) {
                return this.expresion.valor.length;
            }
            else if (resultado.tipo.tipo == 6) {
                return resultado.valor.length;
            }
            else {
                return resultado.length;
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error con la longitud buscada`, this.line, this.column);
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("LENGTH");
            nodo.agregarHijo("Length");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("LENGTH");
            return nodo;
        }
    }
}
exports.Length = Length;
