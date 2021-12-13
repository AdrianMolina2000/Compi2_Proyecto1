import { Nodo } from "../Abstract/Nodo";
import { NodoAST } from "../Abstract/NodoAST";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";


function esEntero(numero: number) {
    if (numero % 1 == 0) {
        return true;
    } else {
        return false;
    }
}

export class Aritmetica extends Nodo {
    operadorIzq: Nodo;
    operadorDer: Nodo;
    operador: String;

    constructor(operadorIzq: Nodo, operadorDer: Nodo, operador: String, line: Number, column: Number) {
        super(null, line, column);
        this.operadorIzq = operadorIzq;
        this.operadorDer = operadorDer;
        this.operador = operador;
    }

    execute(table: Table, tree: Tree) {
        if (this.operadorIzq !== null) {
            const resultadoIzq = this.operadorIzq.execute(table, tree);
            if (resultadoIzq instanceof Excepcion) {
                return resultadoIzq;
            }
            const resultadoDerecho = this.operadorDer.execute(table, tree);
            if (resultadoDerecho instanceof Excepcion) {
                return resultadoDerecho;
            }

            if (this.operador === '+') {
                //ENTERO + 
                if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                    //ENTERO + ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.ENTERO);
                        return resultadoIzq + resultadoDerecho;
                        //ENTERO + DECIMAL = DECIMAL
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho;
                        //ENTERO + CHAR = ENTERO
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.ENTERO);
                        return resultadoIzq + resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        // tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }

                    //DOUBLE + 
                } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                    //DOUBLE + ENTERO = DOUBLE
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho;
                        //DOUBLE + DOUBLE = DOUBLE
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho;
                        //DOUBLE + CARACTER = DOUBLE
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq + resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //BOOLEAN +
                } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                    //CHAR + ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) + resultadoDerecho;
                        //CHAR + DOUBLE = DOUBLE
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) + resultadoDerecho;
                        //CHAR + CHAR = STRING
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.STRING);
                        return resultadoIzq + resultadoDerecho;
                        //CHAR + STRING = STRING
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //STRING
                } else {
                    const error = new Excepcion('Semantico',
                        `No se pueden Sumar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operador === '&') {
                //ENTERO &
                if (this.operadorIzq.tipo.tipo === tipos.ENTERO || 
                    this.operadorIzq.tipo.tipo === tipos.DECIMAL ||
                    this.operadorIzq.tipo.tipo === tipos.BOOLEANO ||
                    this.operadorIzq.tipo.tipo === tipos.STRING ||
                    this.operadorIzq.tipo.tipo === tipos.CARACTER) {

                    if (this.operadorDer.tipo.tipo === tipos.STRING ||
                        this.operadorDer.tipo.tipo === tipos.ENTERO ||
                        this.operadorDer.tipo.tipo === tipos.DECIMAL || 
                        this.operadorDer.tipo.tipo === tipos.BOOLEANO ||
                        this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        
                        this.tipo = new Tipo(tipos.STRING);
                        return resultadoIzq + "" + resultadoDerecho;
                    }else {
                        const error = new Excepcion('Semantico',
                            `No se pueden concatenar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }

                } else {
                    const error = new Excepcion('Semantico',
                        `No se pueden Concatenar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
                
            } else if (this.operador === '-') {
                if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.ENTERO);
                        return resultadoIzq - resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.ENTERO);
                        return resultadoIzq - resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }

                    //DOUBLE -
                } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq - resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //BOOLEAN -
                } else if (this.operadorIzq.tipo.tipo === tipos.BOOLEANO) {
                    //BOOL - ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        if (resultadoIzq === true) {
                            this.tipo = new Tipo(tipos.ENTERO);
                            return 1 - resultadoDerecho;
                        } else {
                            this.tipo = new Tipo(tipos.ENTERO);
                            return 0 - resultadoDerecho;
                        }
                        //BOOL - DOUBLE = DOUBLE
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        if (resultadoIzq === true) {
                            this.tipo = new Tipo(tipos.DECIMAL);
                            return 1 - resultadoDerecho;
                        } else {
                            this.tipo = new Tipo(tipos.DECIMAL);
                            return 0 - resultadoDerecho;
                        }
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //CHAR -
                } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                    //CHAR - ENTERO = ENTERO
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) - resultadoDerecho;
                        //CHAR - DOUBLE = DOUBLE
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) - resultadoDerecho;
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                } else {
                    const error = new Excepcion('Semantico',
                        `No se pueden Restar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operador === '*') {
                if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.ENTERO);
                        return resultadoIzq * resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.ENTERO);
                        return resultadoIzq * resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE *
                } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq * resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //CHAR *
                } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) * resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) * resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.ENTERO);
                        return resultadoIzq.charCodeAt(0) * resultadoDerecho.charCodeAt(0);
                    }else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                } else {
                    const error = new Excepcion('Semantico',
                        `No se pueden Multiplicar los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operador === '/') {
                if (resultadoDerecho === 0) {
                    const error = new Excepcion('Semantico',
                        `Error aritmetico, La division con cero no esta permitida`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    return error;
                }
                if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        var x = resultadoIzq / resultadoDerecho;
                        if(esEntero(x)){
                            this.tipo = new Tipo(tipos.ENTERO);
                            return parseInt(x.toString());
                        }else{
                            this.tipo = new Tipo(tipos.DECIMAL);
                            return x
                        }
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE / 
                } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return parseInt((resultadoIzq / resultadoDerecho).toString());
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq / resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //CHAR /
                } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) / resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) / resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) / resultadoDerecho.charCodeAt(0);
                    }else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                } else {
                    const error = new Excepcion('Semantico',
                        `No se pueden Dividir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operador === '^') {
                if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.STRING);
                        var cadena = "";
                        for(let k = 0; k < resultadoDerecho; k++){
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.STRING);
                        var cadena = "";
                        for(let k = 0; k < resultadoDerecho; k++){
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }else if (this.operadorIzq.tipo.tipo === tipos.BOOLEANO) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.STRING);
                        var cadena = "";
                        for(let k = 0; k < resultadoDerecho; k++){
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.STRING);
                        var cadena = "";
                        for(let k = 0; k < resultadoDerecho; k++){
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }else if (this.operadorIzq.tipo.tipo === tipos.STRING) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.STRING);
                        var cadena = "";
                        for(let k = 0; k < resultadoDerecho; k++){
                            cadena += resultadoIzq;
                        }
                        return cadena;
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                } else {
                    const error = new Excepcion('Semantico',
                        `No se pueden Repetir los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operador === '%') {
                if (this.operadorIzq.tipo.tipo === tipos.ENTERO) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se puede aplicar modulo con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                    //DOUBLE ^
                } else if (this.operadorIzq.tipo.tipo === tipos.DECIMAL) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq % resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se puede aplicar modulo los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                } else if (this.operadorIzq.tipo.tipo === tipos.CARACTER) {
                    if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) % resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) % resultadoDerecho;
                    } else if (this.operadorDer.tipo.tipo === tipos.CARACTER) {
                        this.tipo = new Tipo(tipos.DECIMAL);
                        return resultadoIzq.charCodeAt(0) % resultadoDerecho.charCodeAt(0);
                    } else {
                        const error = new Excepcion('Semantico',
                            `No se puede aplicar modulo los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                            this.line, this.column);
                        tree.excepciones.push(error);
                        // tree.consola.push(error.toString());
                        return error;
                    }
                }else {
                    const error = new Excepcion('Semantico',
                        `No se puede aplicar modulo los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else {
                const error = new Excepcion('Semantico',
                    `Error, Operador desconocido`,
                    this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        } else {
            const resultadoDerecho = this.operadorDer.execute(table, tree);
            if (resultadoDerecho instanceof Excepcion) {
                return resultadoDerecho;
            }
            if (this.operador === '-') {
                if (this.operadorDer.tipo.tipo === tipos.ENTERO) {
                    this.tipo = new Tipo(tipos.ENTERO);
                    return -1 * resultadoDerecho;
                } else if (this.operadorDer.tipo.tipo === tipos.DECIMAL) {
                    this.tipo = new Tipo(tipos.DECIMAL);
                    return -1 * resultadoDerecho;
                } else {
                    const error = new Excepcion('Semantico',
                        `No se puede aplicar negativo al tipo ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else {
                const error = new Excepcion('Semantico',
                    `Error, Operador desconocido`,
                    this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
    }

    getNodo(){
        var nodo:NodoAST = new NodoAST("ARITMETICA");
        if(this.operadorIzq != null){
            nodo.agregarHijo(this.operadorIzq.getNodo());
            nodo.agregarHijo(this.operador + "");
            nodo.agregarHijo(this.operadorDer.getNodo());
            
        }else{
            nodo.agregarHijo(this.operador + "");
            nodo.agregarHijo(this.operadorDer.getNodo());
        } 
        return nodo;
    }
}