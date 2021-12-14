"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
function alv(padre, id, lista_ids, tree, table) {
    var name = "";
    for (let index = 0; index < padre.valor.length; index++) {
        if (padre.valor[index].id[0] == padre.id + "_" + id) {
            name = padre.id + "_" + id;
            if (padre.valor[index].tipo.tipo == 11) {
                if (lista_ids.length == 1) {
                    let variable = table.getVariable(name);
                    return variable.valor;
                }
                else if (lista_ids.length > 1) {
                    lista_ids.shift();
                    let id_hijo;
                    id_hijo = table.getVariable(padre.valor[index].nombre_struct);
                    return alv(id_hijo, lista_ids[0], lista_ids, tree, id_hijo.ambito);
                }
            }
            else {
                let variable = table.getVariable(name);
                return variable;
            }
        }
    }
}
class Obtener_struct extends Nodo_1.Nodo {
    constructor(id, posicion, line, column) {
        super(null, line, column);
        this.id = id.id;
        this.posicion = posicion;
    }
    execute(table, tree) {
        let id_struct;
        id_struct = table.getVariable(this.id);
        if (id_struct.tipo2.tipo == tipo_1.tipos.STRUCTS) {
            let retorno = alv(id_struct, this.posicion[0], this.posicion, tree, id_struct.ambito);
            this.tipo = retorno.tipo.tipo;
            return retorno.valor;
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `no se puede  modificar el valor del struct debido a que este id no es un struct \n`, this.line, this.column);
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ASIGNACION VECTOR");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(`[${this.pos}]`);
        nodo.agregarHijo("=");
        //nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}
exports.Obtener_struct = Obtener_struct;
