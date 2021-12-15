import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Tipo, tipos } from "../other/tipo";
import { Simbolo } from "../Simbols/Simbolo";
import { Primitivo } from "../Expresiones/Primitivo";
import { NodoAST } from "../Abstract/NodoAST";


export class Struct extends Nodo {

    id: String;
    lista_declaracion: Array<Nodo>;
    alv: Array<Nodo>
    newTable: Table
    constructor(id: String, lista_declaracion: Array<Nodo>, line: Number, column: Number) {
        super(null, line, column);
        this.id = id;
        this.lista_declaracion = lista_declaracion;

    }
    execute(table: Table, tree: Tree) {
        this.newTable = new Table(table);

        console.log(this.id)
        if ((this.lista_declaracion != null)) {
            let simbolo: Simbolo;

            for (let index = 0; index < this.lista_declaracion.length; index++) {

                const id_aux = this.lista_declaracion[index].id
                this.lista_declaracion[index].id = [this.id + "_" + id_aux]               
                this.lista_declaracion[index].execute(this.newTable, tree)
                
            }

           
            simbolo = new Simbolo(this.tipo, this.id, this.lista_declaracion, new Tipo(tipos.STRUCTS), this.line, this.column);
            simbolo.ambito = this.newTable;


            if (table.getVariable(this.id) == null) {
                table.setVariable(simbolo);
                tree.Variables.push(simbolo)
            } else {
                const error = new Excepcion('Semantico',
                    `El array ${this.id} no puede ser declarado debido a que ya ha sido declarado anteriormente`,
                    this.line, this.column);
                return error;
            }
        }


        return null;
    }






    getNodo() {

        var nodo: NodoAST = new NodoAST("DECLARACION ARRAY");
        // if ((this.tipo2 != null) && (this.num != null) && (this.lista_declaracion == null)) {
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

        // } else if ((this.tipo2 == null) && (this.num == null) && (this.lista_declaracion != null)) {
        //     nodo.agregarHijo(`${this.tipo}[]`);
        //     nodo.agregarHijo(this.id + "");
        //     nodo.agregarHijo("=");
        //     nodo.agregarHijo("{");
        //     var nodo2: NodoAST = new NodoAST("Lista Valores");
        //     for (let i = 0; i < this.lista_declaracion.length; i++) {
        //         nodo2.agregarHijo(this.lista_declaracion[i].getNodo());
        //     }
        //     nodo.agregarHijo(nodo2);
        //     nodo.agregarHijo("}");
        // }
        return nodo;
    }
}

/*


struct alv {
int var1 , int var2,


int efe3

};

struct alv2 {
alv efe , int efe2 ,int [] efe

};





print(alv);

*/