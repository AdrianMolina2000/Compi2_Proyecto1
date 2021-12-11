"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Pow extends Nodo_1.Nodo {
    constructor(base, exponente, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.STRING), line, column);
        this.base = base;
        this.exponente = exponente;
    }
    execute(table, tree) {
        try {
            const resultado = this.base.execute(table, tree);
            const resultado2 = this.exponente.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                console.log(resultado);
                return resultado;
            }
            else {
                console.log(Math.pow(resultado, resultado2));
                return Math.pow(resultado, resultado2);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al ejecutar el comando pow`, this.line, this.column);
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
            nodo.agregarHijo(this.base.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("ToLower");
            return nodo;
        }
    }
}
exports.Pow = Pow;
