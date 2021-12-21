import { Nodo } from "../Abstract/Nodo";
import { NodoAST } from "../Abstract/NodoAST";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";

export class Grafica extends Nodo {
    expresion: Nodo;
    exp: Nodo;
    constructor( line: Number, column: Number) {
        super(null, line, column);
     
    }

    execute(table: Table, tree: Tree) {
       tree.consola.push("graficando....")
        return "graficando...";
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("Grafica_ts");
       nodo.agregarHijo("-")

        return nodo;
    }
}