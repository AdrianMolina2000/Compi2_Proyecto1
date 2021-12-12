"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
function esEntero(numero) {
    if (numero % 1 == 0) {
        return true;
    }
    else {
        return false;
    }
}
class Aritmetica extends Nodo_1.Nodo {
    constructor(operadorIzq, operadorDer, operador, line, column) {
        super(null, line, column);
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
            const resultadoDerecho = this.operadorDer.execute(table, tree);
            if (resultadoDerecho instanceof Excepcion_1.Excepcion) {
                return resultadoDerecho;
            }
            if (this.operador === '+') {
                //ENTERO + 
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    //ENTERO + ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq + resultadoDerecho;
                        //ENTERO + DECIMAL = DECIMAL
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho;
                        //ENTERO + CHAR = ENTERO
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq + resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        // tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE + 
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    //DOUBLE + ENTERO = DOUBLE
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho;
                        //DOUBLE + DOUBLE = DOUBLE
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho;
                        //DOUBLE + CARACTER = DOUBLE
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //BOOLEAN +
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    //CHAR + ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) + resultadoDerecho;
                        //CHAR + DOUBLE = DOUBLE
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) + resultadoDerecho;
                        //CHAR + CHAR = STRING
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        return resultadoIzq + resultadoDerecho;
                        //CHAR + STRING = STRING
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //STRING
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '&') {
                //ENTERO &
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO ||
                    this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL ||
                    this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO ||
                    this.operadorIzq.tipo.tipo === tipo_1.tipos.STRING ||
                    this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.STRING ||
                        this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO ||
                        this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL ||
                        this.operadorDer.tipo.tipo === tipo_1.tipos.BOOLEANO ||
                        this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        return resultadoIzq + "" + resultadoDerecho;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden concatenar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Concatenar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '-') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq - resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq - resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE -
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //BOOLEAN -
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    //BOOL - ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        if (resultadoIzq === true) {
                            this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                            return 1 - resultadoDerecho;
                        }
                        else {
                            this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                            return 0 - resultadoDerecho;
                        }
                        //BOOL - DOUBLE = DOUBLE
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        if (resultadoIzq === true) {
                            this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                            return 1 - resultadoDerecho;
                        }
                        else {
                            this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                            return 0 - resultadoDerecho;
                        }
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //CHAR -
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    //CHAR - ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) - resultadoDerecho;
                        //CHAR - DOUBLE = DOUBLE
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) - resultadoDerecho;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '*') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq * resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE *
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //CHAR *
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) * resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) * resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '/') {
                if (resultadoDerecho === 0) {
                    const error = new Excepcion_1.Excepcion('Semantico', `Error aritmetico, La division con cero no esta permitida`, this.line, this.column);
                    tree.excepciones.push(error);
                    return error;
                }
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return parseInt((resultadoIzq / resultadoDerecho).toString());
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE / 
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return parseInt((resultadoIzq / resultadoDerecho).toString());
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //CHAR /
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) / resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) / resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) / resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '^') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        var cadena = "";
                        for (let k = 0; k < resultadoDerecho; k++) {
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        var cadena = "";
                        for (let k = 0; k < resultadoDerecho; k++) {
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.BOOLEANO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        var cadena = "";
                        for (let k = 0; k < resultadoDerecho; k++) {
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        var cadena = "";
                        for (let k = 0; k < resultadoDerecho; k++) {
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.STRING) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRING);
                        var cadena = "";
                        for (let k = 0; k < resultadoDerecho; k++) {
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            }
            else if (this.operador === '%') {
                if (this.operadorIzq.tipo.tipo === tipo_1.tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se puede aplicar modulo con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE ^
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se puede aplicar modulo los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else if (this.operadorIzq.tipo.tipo === tipo_1.tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) % resultadoDerecho;
                    }
                    else if (this.operadorDer.tipo.tipo === tipo_1.tipos.CARACTER) {
                        this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) % resultadoDerecho.charCodeAt(0);
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se puede aplicar modulo los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede aplicar modulo los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`, this.line, this.column);
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
            const resultadoDerecho = this.operadorDer.execute(table, tree);
            if (resultadoDerecho instanceof Excepcion_1.Excepcion) {
                return resultadoDerecho;
            }
            if (this.operador === '-') {
                if (this.operadorDer.tipo.tipo === tipo_1.tipos.ENTERO) {
                    this.tipo = new tipo_1.Tipo(tipo_1.tipos.ENTERO);
                    return -1 * resultadoDerecho;
                }
                else if (this.operadorDer.tipo.tipo === tipo_1.tipos.DECIMAL) {
                    this.tipo = new tipo_1.Tipo(tipo_1.tipos.DECIMAL);
                    return -1 * resultadoDerecho;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `No se puede aplicar negativo al tipo ${this.operadorDer.tipo}`, this.line, this.column);
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
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ARITMETICA");
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
}
exports.Aritmetica = Aritmetica;
