import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

export class Relacional extends Nodo {
    operadorIzq: Nodo;
    operadorDer: Nodo;
    operador: String;

    constructor(operadorIzq: Nodo, operadorDer: Nodo, operador: String, line: Number, column: Number) {
        super(new Tipo(tipos.BOOLEANO), line, column);
        this.operadorIzq = operadorIzq;
        this.operadorDer = operadorDer;
        this.operador = operador;
    }

    execute(table: Table, tree: Tree) {
        const resultadoIzq = this.operadorIzq.execute(table, tree);
        if (resultadoIzq instanceof Excepcion) {
            return resultadoIzq;
        }
        const resultadoDer = this.operadorDer.execute(table, tree);
        if (resultadoDer instanceof Excepcion) {
            return resultadoDer;
        }

        if (this.operador === '<') {
            if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq < resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq < resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq < resultadoDer.charCodeAt(0);
                } else {
                    console.log(this.operadorIzq)
                    console.log(this.operadorDer)
                    const error = new Excepcion('Semantico',
                        `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq < resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq < resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq < resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) < resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) < resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) < resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipos.BOOLEANO) {
                    return resultadoIzq < resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MENOR QUE se esta tratando de operar con los tipos${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipos.STRING) {
                    return resultadoIzq < resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else {
                const error = new Excepcion('Semantico',
                    `El operador relacional MENOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                    this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        } else if (this.operador === '<=') {
            if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq <= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq <= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq <= resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq <= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq <= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq <= resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) <= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) <= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) <= resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipos.BOOLEANO) {
                    return resultadoIzq <= resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipos.STRING) {
                    return resultadoIzq <= resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else {
                const error = new Excepcion('Semantico',
                    `El operador relacional MENOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                    this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        } else if (this.operador === '>') {
            if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq > resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq > resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq > resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq > resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq > resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq > resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) > resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) > resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) > resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipos.BOOLEANO) {
                    return resultadoIzq > resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipos.STRING) {
                    return resultadoIzq > resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else {
                const error = new Excepcion('Semantico',
                    `El operador relacional MAYOR QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                    this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        } else if (this.operador === '>=') {
            if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq >= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq >= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq >= resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq >= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq >= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq >= resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) >= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) >= resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) >= resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipos.BOOLEANO) {
                    return resultadoIzq >= resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipos.STRING) {
                    return resultadoIzq >= resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else {
                const error = new Excepcion('Semantico',
                    `El operador relacional MAYOR IGUAL QUE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                    this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        } else if (this.operador === '!=') {
            if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq != resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq != resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq != resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq != resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq != resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq != resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) != resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) != resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) != resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipos.BOOLEANO) {
                    return resultadoIzq != resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipos.STRING) {
                    return resultadoIzq != resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else {
                const error = new Excepcion('Semantico',
                    `El operador relacional DIFERENTE DE se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                    this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        } else if (this.operador === '==') {
            if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq == resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq == resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq == resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq == resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq == resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq == resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    return resultadoIzq.charCodeAt(0) == resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    return resultadoIzq.charCodeAt(0) == resultadoDer;
                } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                    return resultadoIzq.charCodeAt(0) == resultadoDer.charCodeAt(0);
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.BOOLEANO) {
                if (this.operadorDer.tipo.tipo === tipos.BOOLEANO) {
                    return resultadoIzq == resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operadorIzq.tipo.tipo === tipos.STRING) {
                if (this.operadorDer.tipo.tipo === tipos.STRING) {
                    return resultadoIzq == resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else {
                const error = new Excepcion('Semantico',
                    `El operador relacional IGUAL A se esta tratando de operar con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                    this.line, this.column);
                tree.excepciones.push(error);
                // tree.consola.push(error.toString());
                return error;
            }
        } else {
            const error = new Excepcion('Semantico',
                `Operador desconocido`,
                this.line, this.column);
            tree.excepciones.push(error);
            // tree.consola.push(error.toString());
            return error;
        }
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("RELACIONAL");
        nodo.agregarHijo(this.operadorIzq.getNodo());
        nodo.agregarHijo(this.operador + "");
        nodo.agregarHijo(this.operadorDer.getNodo());
        return nodo;
    }

    get3D(table: Table, tree: Tree): String {
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

        console.log("OP DER");
        console.log(this.operadorDer);
        console.log("OP DER");
        console.log("OP IZQ");//vos xd
        console.log(this.operadorIzq);
        console.log("OP IZQ");


        if (this.operadorDer instanceof Relacional && this.operadorIzq instanceof Relacional) {

            table.bandera = 1;
            etiq = table.getEtiqueta();
            etiq2 = table.getEtiqueta();

            c3d += this.operadorIzq.get3D(table, tree);
            c3d += `goto ${etiq};\n`;
            c3d += `    goto ${etiq2};\n`;
            c3d += `    ${etiq}:\n`;

            temp = table.getTemporal();
            table.AgregarTemporal(temp);
            etiq = table.getEtiqueta();

            c3d += `    ${temp} = 1;\n`;
            c3d += `    goto ${etiq};\n`;
            c3d += `    ${etiq2}:\n`;

            c3d += `    ${temp} = 0;\n`;
            c3d += `    ${etiq}:\n`;

            etiq = table.getEtiqueta();
            etiq2 = table.getEtiqueta();

            c3d += this.operadorDer.get3D(table, tree);
            c3d += `goto ${etiq};\n`;
            c3d += `    goto ${etiq2};\n`;
            c3d += `    ${etiq}:\n`;

            temp2 = table.getTemporal();
            table.AgregarTemporal(temp2);
            etiq = table.getEtiqueta();

            c3d += `    ${temp2} = 1;\n`;
            c3d += `    goto ${etiq};\n`;
            c3d += `    ${etiq2}:\n`;

            c3d += `    ${temp2} = 0;\n`;
            c3d += `    ${etiq}:\n`;

            c3d += `    if(${temp} ${op} ${temp2}) goto ${table.getTrue()};\n`;
            c3d += `    goto ${table.getFalse()};\n`;

        } else if (this.operadorIzq instanceof Relacional) {
        } else if (this.operadorDer instanceof Relacional) {
        } else {
            izq = this.operadorIzq.get3D(table, tree);
            der = this.operadorDer.get3D(table, tree);

            if (table.bandera == 0) {
                c3d += `    if(${izq} ${op} ${der}) goto ${table.getTrue()};\n`;
                c3d += `    goto ${table.getFalse()};\n`;
            } else {
                c3d += `    if(${izq} ${op} ${der}) `;
            }
        }

        return c3d;
    }
}