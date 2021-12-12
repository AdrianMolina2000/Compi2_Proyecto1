import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Simbolo } from "../Simbols/Simbolo";
import { Tipo, tipos } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";


export class Pop extends Nodo {
    id: String;

    constructor(id: String, line: Number, column: Number) {
        super(null, line, column);
        this.id = id;
    }

    execute(table: Table, tree: Tree) {

        let variable: Simbolo;
        variable = table.getVariable(this.id);

        if (variable == null) {
            const error = new Excepcion('Semantico',
                `El arreglo {${this.id}} no ha sido encontrado`,
                this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }

        var arreglo: Array<Nodo> = <Array<Nodo>>variable.valor.valor;

        if (variable.tipo2.tipo == tipos.ARREGLO) {
            
            // variable.valor = arreglo;
            return arreglo.pop();
        } else {
            const error = new Excepcion('Semantico',
                `No se puede eliminar un valor a {${this.id}}`,
                this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }

    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("ADD");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(".add");
        nodo.agregarHijo("(");
        nodo.agregarHijo(")");
        return nodo;
    }
}