"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Substring extends Nodo_1.Nodo {
    constructor(expresion, inicio, final, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.STRING), line, column);
        this.expresion = expresion;
        this.inicio = inicio;
        this.final = final;
    }
    execute(table, tree) {
        // try {
        const ini = this.inicio.execute(table, tree);
        const fin = this.final.execute(table, tree);
        const resultado = this.expresion.execute(table, tree);
        if (resultado instanceof Excepcion_1.Excepcion) {
            return resultado;
        }
        if (this.inicio.tipo.tipo == 0 && this.final.tipo.tipo == 0) {
            return resultado.substring(ini, fin + 1);
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `Ambas posiciones deben ser un numero entero `, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("Substring");
            nodo.agregarHijo("Substring");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("Substring");
            return nodo;
        }
    }
}
exports.Substring = Substring;
/*
String animal = "Tigre";
println(animal.subString(0,-1)); //gre

*/ 
