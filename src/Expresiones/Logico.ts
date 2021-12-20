import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

export class Logico extends Nodo {
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
        if (this.operadorIzq !== null) {
            const resultadoIzq = this.operadorIzq.execute(table, tree);
            if (resultadoIzq instanceof Excepcion) {
                return resultadoIzq;
            }
            const resultadoDer = this.operadorDer.execute(table, tree);
            if (resultadoDer instanceof Excepcion) {
                return resultadoDer;
            }

            if (this.operador === '||') {
                if (this.operadorIzq.tipo.tipo === tipos.BOOLEANO && this.operadorDer.tipo.tipo === tipos.BOOLEANO) {
                    return resultadoIzq || resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `No se puede operar OR con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
                        this.line, this.column);
                    tree.excepciones.push(error);
                    // tree.consola.push(error.toString());
                    return error;
                }
            } else if (this.operador === '&&') {
                if (this.operadorIzq.tipo.tipo === tipos.BOOLEANO && this.operadorDer.tipo.tipo === tipos.BOOLEANO) {
                    return resultadoIzq && resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `No se puede operar AND con los tipos ${this.operadorIzq.tipo} y ${this.operadorDer.tipo}`,
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
            const resultadoDer = this.operadorDer.execute(table, tree);
            if (resultadoDer instanceof Excepcion) {
                return resultadoDer;
            }
            if (this.operador === '!') {
                if (this.operadorDer.tipo.tipo === tipos.BOOLEANO) {
                    return !resultadoDer;
                } else {
                    const error = new Excepcion('Semantico',
                        `No se puede operar Not con el tipo ${this.operadorDer.tipo}`,
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
                // tree.consola.push(error.toString());
                return error;
            }
        }
    }

    getNodo() {
        var nodo: NodoAST  = new NodoAST("LOGICO");
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

        if (this.operadorDer instanceof Relacional && this.operadorIzq instanceof Relacional) {
            
        } else if (this.operadorIzq instanceof Relacional) {
        } else if (this.operadorDer instanceof Relacional) {
        } else {
            izq = this.operadorIzq.get3D(table, tree);
            der = this.operadorDer.get3D(table, tree);

            if (table.bandera == 0) {
                c3d += `    if(${izq} ${op} ${der}) goto ${table.getTrue()};\n`;
                c3d += `    goto ${table.getFalse()};\n`;
            }else{
                c3d += `    if(${izq} ${op} ${der}) `;
            }
        }

        return c3d;
    }


}