import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Tipo, tipos } from "../other/tipo";
import { Simbolo } from "../Simbols/Simbolo";
import { Primitivo } from "../Expresiones/Primitivo";
import { NodoAST } from "../Abstract/NodoAST";

export function defal(tipo: Tipo, line: Number, column: Number) {
    if (tipo.tipo == tipos.ENTERO) {
        return new Primitivo(tipo, 0, line, column);
    } else if (tipo.tipo == tipos.DECIMAL) {
        return new Primitivo(tipo, 0.0, line, column);
    } else if (tipo.tipo == tipos.BOOLEANO) {
        return new Primitivo(tipo, true, line, column);
    } else if (tipo.tipo == tipos.CARACTER) {
        return new Primitivo(tipo, '', line, column);
    } else if (tipo.tipo == tipos.STRING) {
        return new Primitivo(tipo, "", line, column);
    }
}

function revisar(tipo1: Tipo, lista: Nodo, table: Table, tree: Tree) {

    for (let key in lista.valor) {
        lista.valor[key].execute(table, tree);
        if (lista.valor[key].tipo.tipo == 6) {
            return revisar(tipo1, lista.valor[key])
        }
        if (tipo1.tipo != lista.valor[key].tipo.tipo) {
            return false;
        }
    }
    return true;
}

export class DeclaracionArray extends Nodo {
    tipo: Tipo;
    id: String;
    listaValores: Array<Nodo>;

    constructor(tipo: Tipo, id: String, listaValores: Array<Nodo>, line: Number, column: Number) {
        super(tipo, line, column);
        this.id = id;
        this.listaValores = listaValores;
    }
    //int[] a = [1];
    execute(table: Table, tree: Tree) {
        if ((this.listaValores != null)) {
            
            //Declaracion Tipo 2

            if (revisar(this.tipo, this.listaValores, table, tree)) {
                let simbolo: Simbolo;
                simbolo = new Simbolo(this.tipo, this.id, this.listaValores, new Tipo(tipos.ARREGLO), this.line, this.column);

                if (table.getVariable(this.id) == null) {
                    table.setVariable(simbolo);
                    tree.Variables.push(simbolo)
                } else {
                    const error = new Excepcion('Semantico',
                        `El array ${this.id} no puede ser declarado debido a que ya ha sido declarado anteriormente`,
                        this.line, this.column);
                    return error;
                }
            } else {
                const error = new Excepcion('Semantico',
                    `El Array no puede ser declarado debido a que son de diferentes tipos \n`,
                    this.line, this.column);
                return error;
            }
        }


        return null;
    }






    getNodo() {

        var nodo: NodoAST = new NodoAST("DECLARACION ARRAY");
        // if ((this.tipo2 != null) && (this.num != null) && (this.listaValores == null)) {
        //     nodo.agregarHijo(`${this.tipo}[]`);
        //     nodo.agregarHijo(this.id + "");
        //     nodo.agregarHijo("=");
        //     nodo.agregarHijo("new");
        //     var nodo2: NodoAST = new NodoAST("Tamaño del Array");
        //     nodo2.agregarHijo("int");
        //     nodo2.agregarHijo("[");
        //     nodo2.agregarHijo(this.num.getNodo());
        //     nodo2.agregarHijo("]");
        //     nodo.agregarHijo(nodo2);

        // } else if ((this.tipo2 == null) && (this.num == null) && (this.listaValores != null)) {
        //     nodo.agregarHijo(`${this.tipo}[]`);
        //     nodo.agregarHijo(this.id + "");
        //     nodo.agregarHijo("=");
        //     nodo.agregarHijo("{");
        //     var nodo2: NodoAST = new NodoAST("Lista Valores");
        //     for (let i = 0; i < this.listaValores.length; i++) {
        //         nodo2.agregarHijo(this.listaValores[i].getNodo());
        //     }
        //     nodo.agregarHijo(nodo2);
        //     nodo.agregarHijo("}");
        // }
        return nodo;
    }
}