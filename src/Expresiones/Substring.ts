import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

export class Substring extends Nodo {
    expresion: Nodo;
    inicio: Nodo;
    final: Nodo;

    constructor(expresion: Nodo, inicio: Nodo, final: Nodo, line: Number, column: Number) {
        super(new Tipo(tipos.STRING), line, column);
        this.expresion = expresion;
        this.inicio = inicio;
        this.final = final;
    }

    execute(table: Table, tree: Tree) {

        // try {
        const ini = this.inicio.execute(table, tree)
        const fin = this.final.execute(table, tree)
        const resultado = this.expresion.execute(table, tree);

        if (resultado instanceof Excepcion) {
            return resultado;
        }

        if (this.inicio.tipo.tipo == 0 && this.final.tipo.tipo == 0) {
            return resultado.substring(ini, fin+1);
        } else {
                const error = new Excepcion('Semantico',
                    `Ambas posiciones deben ser un numero entero `,
                    this.line, this.column);

                return error;
        }
    }

    getNodo() {
        try {
            var nodo: NodoAST = new NodoAST("Substring");
            nodo.agregarHijo("Substring");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        } catch (err) {
            var nodo: NodoAST = new NodoAST("Substring");
            return nodo;
        }
    }

}

/*
String animal = "Tigre";
println(animal.subString(0,-1)); //gre

*/