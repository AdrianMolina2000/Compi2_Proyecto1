"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Grafica extends Nodo_1.Nodo {
    constructor(line, column) {
        super(null, line, column);
    }
    execute(table, tree) {
        tree.consola.push("graficando....");
        return "graficando...";
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("Grafica_ts");
        nodo.agregarHijo("-");
        return nodo;
    }
}
exports.Grafica = Grafica;
