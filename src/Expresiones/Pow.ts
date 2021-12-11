import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

export class Pow extends Nodo {
    base: Nodo;
    exponente:Nodo;
    constructor(base: Nodo,exponente:Nodo, line: Number, column: Number) {
        super(new Tipo(tipos.STRING), line, column);
        this.base = base;
        this.exponente=exponente
    }

    execute(table: Table, tree: Tree) {

        try {
            
            const resultado = this.base.execute(table, tree);
            const resultado2 = this.exponente.execute(table, tree);
           
            if (resultado instanceof Excepcion) {
                console.log(resultado);
                return resultado;
            } else {
                console.log(Math.pow(resultado,resultado2));
                return Math.pow(resultado,resultado2);
            }
        } catch (err) {
            const error = new Excepcion('Semantico',
                `Ha ocurrido un error al ejecutar el comando pow`,
                this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }

    getNodo() {
        try {
            var nodo: NodoAST = new NodoAST("TOLOWER");
            nodo.agregarHijo("ToLower");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.base.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        } catch (err) {
            var nodo: NodoAST = new NodoAST("ToLower");
            return nodo;
        }
    }

}