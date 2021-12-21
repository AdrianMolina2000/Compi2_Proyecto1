"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Relacional_1 = require("./Relacional");
class Logico extends Nodo_1.Nodo {
    constructor(operadorIzq, operadorDer, operador, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.BOOLEANO), line, column);
        this.operadorIzq = operadorIzq;
        this.operadorDer = operadorDer;
        this.operador = operador;
    }
    execute(table, tree) {
        if (this.operadorIzq !== null) {
            const resultadoIzq = this.operadorIzq.execute(table, tree);
            if (resultadoIzq instanceof Excepcion_1.Excepcion) {
                return resultadoIzq;
            }
            const resultadoDer = this.operadorDer.execute(table, tree);
            if (resultadoDer instanceof Excepcion_1.Excepcion) {
                return resultadoDer;
            }
            if (this.operador === '||') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO && this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return resultadoIzq || resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede operar OR con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '&&') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO && this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return resultadoIzq && resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede operar AND con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `Error, Operador desconocido`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        else {
            const resultadoDer = this.operadorDer.execute(table, tree);
            if (resultadoDer instanceof Excepcion_1.Excepcion) {
                return resultadoDer;
            }
            if (this.operador === '!') {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    return !resultadoDer;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede operar Not con el tipo ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `Error, Operador desconocido`, this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("LOGICO");
        if (this.operadorIzq != null) {
            nodo.agregarHijo(this.operadorIzq.getNodo());
            nodo.agregarHijo(this.operador + "");
            nodo.agregarHijo(this.operadorDer.getNodo());
        }
        else {
            nodo.agregarHijo(this.operador + "");
            nodo.agregarHijo(this.operadorDer.getNodo());
        }
        return nodo;
    }
    get3D(table, tree) {
        let c3d = ``;
        let izq;
        let der;
        let op = this.operador;
        let temp;
        let temp2;
        let temp3;
        let etiq;
        let etiq2;
        let etiq3;
        table.bandera = 1;
        if (this.operadorDer instanceof Relacional_1.Relacional && this.operadorIzq instanceof Relacional_1.Relacional) {
            izq = this.operadorIzq.get3D(table, tree);
            der = this.operadorDer.get3D(table, tree);
            etiq = table.getEtiqueta();
            if (op == "||") {
                c3d += izq;
                c3d += `goto ${table.getTrue()};\n`;
                c3d += `    goto ${etiq};\n`;
                c3d += `    ${etiq}:\n`;
                c3d += der;
                c3d += `goto ${table.getTrue()};\n`;
                c3d += `    goto ${table.getFalse()};\n`;
            }
            else if (op == "&&") {
                c3d += izq;
                c3d += `goto ${etiq};\n`;
                c3d += `    goto ${table.getFalse()};\n`;
                c3d += `    ${etiq}:\n`;
                c3d += der;
                c3d += `goto ${table.getTrue()};\n`;
                c3d += `    goto ${table.getFalse()};\n`;
            }
        }
        else if (this.operadorIzq instanceof Relacional_1.Relacional) {
        }
        else if (this.operadorDer instanceof Relacional_1.Relacional) {
        }
        else {
        }
        return c3d;
    }
}
exports.Logico = Logico;
