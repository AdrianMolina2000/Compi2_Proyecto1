"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Primitivo_1 = require("./Primitivo");
class Seno extends Nodo_1.Nodo {
    constructor(expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.DECIMAL), line, column);
        this.expresion = expresion;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return Math.sin(resultado);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al ejecutar el comando seno`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("Seno");
            nodo.agregarHijo("sin");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("Seno");
            return nodo;
        }
    }
    get3D(table, tree) {
        let c3d = "";
        let temporal1;
        let temporal2;
        if (this.expresion instanceof Primitivo_1.Primitivo) {
            temporal1 = this.expresion.get3D(table, tree);
        }
        else {
            c3d += this.expresion.get3D(table, tree);
            temporal1 = table.getTemporalActual();
        }
        temporal2 = table.getTemporal();
        table.AgregarTemporal(temporal2);
        c3d += `    ${temporal2} = sin(${temporal1});\n`;
        return c3d;
    }
}
exports.Seno = Seno;
