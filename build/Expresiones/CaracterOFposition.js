"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class CaracterOFposition extends Nodo_1.Nodo {
    constructor(expresion, posicion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.STRING), line, column);
        this.expresion = expresion;
        this.posicion = posicion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            const pos = this.posicion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                //const inicio_rec=this.inicio;
                return resultado.charAt(pos);
            }
        }
        catch (err) {
            console.log(err);
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error querer imprimir la posicion del string joven`, this.line, this.column);
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("CaracterOfPosition");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo("CaracterOfPosition");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.posicion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("CaracterOfPosition");
            return nodo;
        }
    }
}
exports.CaracterOFposition = CaracterOFposition;
