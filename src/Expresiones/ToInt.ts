import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

export class ToInt extends Nodo {
    expresion: Nodo;
    constructor(expresion: Nodo, line: Number, column: Number) {
        super(new Tipo(tipos.ENTERO), line, column);
        this.expresion = expresion;
    }

    execute(table: Table, tree: Tree) {

        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion) {
                return resultado;
            } else {
                return parseInt(resultado);
            }
        } catch (err) {
            const error = new Excepcion('Semantico',
                `Ha ocurrido un error al momento de querrer parsear el numero a entero`,
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
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        } catch (err) {
            var nodo: NodoAST = new NodoAST("ToLower");
            return nodo;
        }
    }

}