"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const tipo_1 = require("../other/tipo");
const tipo_2 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
function imprimir(lista, table, tree) {
    var salida = "[";
    for (let key in lista.valor) {
        if (lista.valor[key].tipo.tipo == 6) {
            return salida + imprimir(lista.valor[key], table, tree) + "]";
        }
        salida += lista.valor[key].execute(table, tree) + ", ";
    }
    salida = salida.substring(0, salida.length - 2);
    return salida + "]";
}
/*

           var metodo = new Simbolo(this.tipo, nombre, [this.listaParams, this.instrucciones], tipo2, this.line, this.column);
*/
class Print extends Nodo_1.Nodo {
    constructor(expresion, line, column, tipo_print) {
        super(new tipo_1.Tipo(tipo_2.tipos.VOID), line, column);
        this.expresion = expresion;
        this.tipo_print = tipo_print;
    }
    execute(table, tree) {
        for (let key in this.expresion) {
            const valor = this.expresion[key].execute(table, tree);
            if (valor.tipo == null) {
                tree.consola.push(valor);
            }
            else {
                if (this.expresion[key].execute(table, tree).tipo.tipo == 6) {
                    tree.consola.push(imprimir(this.expresion[key].execute(table, tree), table, tree));
                }
                else {
                    tree.consola.push(valor);
                }
            }
        }
        /*agregando el tipo para el pritnln lo  maneje asi  fuera del for para evitar clavos papa ctm*/
        if (this.tipo_print == 1) {
        }
        else if (this.tipo_print == 2) {
            tree.consola.push("\n");
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("PRINT");
        nodo.agregarHijo("print");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.expresion[0].getNodo());
        nodo.agregarHijo(")");
        return nodo;
    }
}
exports.Print = Print;
