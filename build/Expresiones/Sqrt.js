"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Sqrt extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.STRING), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                console.log(resultado);
                return resultado;
            }
            else {
                console.log(Math.sqrt(resultado));
                return Math.sqrt(resultado);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al ejecutar el comando sqrt`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("TOLOWER");
            nodo.agregarHijo("ToLower");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("ToLower");
            return nodo;
        }
    }
}
exports.Sqrt = Sqrt;
