import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";


// Esta clase crea un nodo del tipo primitivo, ya sea int, double, string, char, boolean

export class Primitivo extends Nodo {
    valor: Object;

    constructor(tipo: Tipo, valor: Object, line: Number, column: Number) {
        super(tipo, line, column);
        this.valor = valor;
    }

    execute(table: Table, tree: Tree) {
        try {
            if (Array.isArray(this.valor)) {
                var contenido: Array<Object> = new Array<Object>();
                for (let key in this.valor) {
                    contenido.push(this.valor[key].execute(table, tree));
                }
                return contenido;
            }
        } catch (error) {
            console.log(error)
        }
        return this.valor;
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("PRIMITIVO");
        nodo.agregarHijo(this.valor + '');
        return nodo;
    }
}