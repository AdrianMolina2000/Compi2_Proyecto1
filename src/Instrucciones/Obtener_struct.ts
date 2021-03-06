import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Simbolo } from "../Simbols/Simbolo";
import { Tipo, tipos } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";
import { Vector } from "../Expresiones/Vector";
import { If } from "./If";


function alv(padre: Simbolo, id: String, lista_ids: Array<String>, tree: Tree, table: Table): any {

    for (let index = 0; index < padre.valor.length; index++) {
        if (padre.valor[index].id[0] == id) {
            if (padre.valor[index].tipo.tipo == 11) {





                // if (lista_ids.length == 1) {
                //     let variable = table.getVariable(id);
                //     return variable.valor;
                // }
                // else if (lista_ids.length > 1) {

                //     lista_ids.shift();
                //     let id_hijo: Simbolo
                //     id_hijo = table.getVariable(padre.valor[index].id[0])
                //     return alv(id_hijo, lista_ids[0], lista_ids, tree, id_hijo.ambito);
                // }





            } else {
                let variable = table.getVariable(id);
                return variable;
            }
        }
    }
    return null;
}




export class Obtener_struct extends Nodo {
    id: String;
    posicion: Array<String>;
    pos: any;
    valor: any;

    constructor(id: String, posicion: Array<String>, line: Number, column: Number) {
        super(null, line, column);
        this.id = id.id;
        this.posicion = posicion;
    }

    execute(table: Table, tree: Tree) {

        let struct_var: Simbolo
        struct_var = table.getVariable(this.id)
        

        for (let x = 0; x < struct_var.valor.length; x++) {
            struct_var.valor[x].execute(struct_var.ambito, tree);
        }


        if (struct_var.tipo2.tipo == tipos.STRUCTS) {
            let retorno = alv(struct_var, this.posicion[0], this.posicion, tree, struct_var.ambito)
            this.tipo = retorno.tipo;
            this.valor = retorno.valor;
            return retorno.valor;
        } else {
            const error = new Excepcion('Semantico',
                `no se puede  modificar el valor del struct debido a que este id no es un struct`,
                this.line, this.column);
            return error;
        }
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("OBTENER_STRUCT");
        nodo.agregarHijo(this.id + "");
        
        
        
       for (let index = 0; index < this.posicion.length; index++) {
        nodo.agregarHijo(".");
        nodo.agregarHijo(this.posicion[index] );
        
           
       }
 
        return nodo;
    }
}