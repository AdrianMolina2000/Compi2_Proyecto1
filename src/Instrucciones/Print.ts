import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Tipo } from "../other/tipo";
import { tipos } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

function imprimir(lista: Nodo, table: Table, tree: Tree) {

    var salida = "[";
    for (let key in lista.valor) {
        if (lista.valor[key].tipo.tipo == 6) {
            return salida + imprimir(lista.valor[key], table, tree) + "]";
        }
        salida += lista.valor[key].execute(table, tree) + ", ";
    }
    salida = salida.substring(0, salida.length - 2);
    return salida + "]";
}
/*

           var metodo = new Simbolo(this.tipo, nombre, [this.listaParams, this.instrucciones], tipo2, this.line, this.column);
*/

export class Print extends Nodo {
    expresion: Array<Nodo>;
    tipo_print: Number;
   
    constructor(expresion: Array<Nodo>, line: Number, column: Number, tipo_print: Number) {
        super(new Tipo(tipos.VOID), line, column);
        this.expresion = expresion;
        this.tipo_print = tipo_print;

    }

    execute(table: Table, tree: Tree): any {
        console.log(this.expresion);
        for (let key in this.expresion) {
            const valor = this.expresion[key].execute(table, tree);

            if (valor.tipo == null) {
                tree.consola.push(valor);
            } else {
                if(this.expresion[key].execute(table, tree).tipo.tipo == 6){
                    tree.consola.push(imprimir(this.expresion[key].execute(table, tree), table, tree));
                }else{
                    tree.consola.push(valor);
                }
            }
        }


        /*agregando el tipo para el pritnln lo  maneje asi  fuera del for para evitar clavos papa ctm*/
        if (this.tipo_print == 1) {

        }
        else if (this.tipo_print == 2) {
            tree.consola.push("\n");
        }

        return null;
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("PRINT");
        nodo.agregarHijo("print");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.expresion[0].getNodo());
        nodo.agregarHijo(")");
        return nodo;
    }
}