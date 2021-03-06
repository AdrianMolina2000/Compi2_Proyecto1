"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
//
function alv(padre, id, lista_ids, valor, tree, table) {
    for (let index = 0; index < padre.valor.length; index++) {
        if (padre.valor[index].id == id) {
            if (padre.valor[index].tipo.tipo == 11) {
                if (lista_ids.length == 1) {
                    let variable = table.getVariable(name);
                    variable.valor = valor.execute(table, tree);
                    break;
                }
                else if (lista_ids.length > 1) {
                    lista_ids.shift();
                    let id_hijo;
                    id_hijo = table.getVariable(padre.valor[index].id[0]);
                    alv(id_hijo, lista_ids[0], lista_ids, valor, tree, id_hijo.ambito);
                }
            }
            else {
                let res;
                padre.valor[index].valor = valor;
                break;
            }
        }
    }
}
class Asignacion_Struct extends Nodo_1.Nodo {
    constructor(id, posicion, valor, line, column) {
        super(null, line, column);
        this.id = id;
        this.posicion = posicion;
        this.valor = valor;
    }
    execute(table, tree) {
        const result = this.valor.execute(table, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        let struct;
        struct = table.getVariable(this.id);
        if (struct.tipo2.tipo == tipo_1.tipos.STRUCTS) {
            //id.id,id,id
            alv(struct, this.posicion[0], this.posicion, this.valor, tree, struct.ambito);
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `no se puede  modificar el valor del struct debido a que este id no es un struct \n`, this.line, this.column);
            return error;
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ASIGNACION_STRUCT");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(`[${this.pos}]`);
        nodo.agregarHijo("=");
        nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}
exports.Asignacion_Struct = Asignacion_Struct;
