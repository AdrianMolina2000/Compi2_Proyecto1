import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Simbolo } from "../Simbols/Simbolo";
import { Tipo, tipos } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

//
function alv(padre: Simbolo, id: String, lista_ids: Array<String>, valor: Nodo, tree: Tree, table: Table): any {
    var name = "";
    var new_name = padre.id.split("_")

    if (padre.id.includes('_')) {

        name = new_name[1] + "_" + id

    } else {

        name = padre.id + "_" + id;
    }
    for (let index = 0; index < padre.valor.length; index++) {
        if (padre.valor[index].id == name) {
            if (padre.valor[index].tipo.tipo == 11) {
                if (lista_ids.length == 1) {
                    let variable = table.getVariable(name);
                    variable.valor = valor.execute(table, tree)
                    break;
                }
                else if (lista_ids.length > 1) {
                    lista_ids.shift();
                    let id_hijo: Simbolo
                    id_hijo = table.getVariable(padre.valor[index].id[0])

                    alv(id_hijo, lista_ids[0], lista_ids, valor, tree, id_hijo.ambito);

                }
            } else {
                padre.valor[index].valor.valor = valor.execute(table, tree)
                break;
            }
        }
    }
}




export class Asignacion_Struct extends Nodo {
    id: String;
    posicion: Array<String>;
    valor: Nodo;
    pos: any;

    constructor(id: String, posicion: Array<String>, valor: Nodo, line: Number, column: Number) {
        super(null, line, column);
        this.id = id;
        this.posicion = posicion;
        this.valor = valor;
    }

    execute(table: Table, tree: Tree) {



        const result = this.valor.execute(table, tree);
        if (result instanceof Excepcion) {
            return result;
        }

        let struct: Simbolo
        struct = table.getVariable(this.id)

        console.log(struct);

        if (id_struct.tipo2.tipo == tipos.STRUCTS) {


            //id.id,id,id
            alv(id_struct, this.posicion[0], this.posicion, this.valor, tree, id_struct.ambito);

        } else {
            const error = new Excepcion('Semantico',
                `no se puede  modificar el valor del struct debido a que este id no es un struct \n`,
                this.line, this.column);
            return error;
        }

        return null;
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("ASIGNACION VECTOR");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(`[${this.pos}]`);
        nodo.agregarHijo("=");
        nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}