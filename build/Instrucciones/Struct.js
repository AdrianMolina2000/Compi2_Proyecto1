"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Simbolo_1 = require("../Simbols/Simbolo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Struct extends Nodo_1.Nodo {
    constructor(id, lista_declaracion, line, column) {
        super(null, line, column);
        this.id = id;
        this.lista_declaracion = lista_declaracion;
    }
    execute(table, tree) {
        this.tipo = new tipo_1.Tipo(tipo_1.tipos.STRUCTS);
        this.newTable = new Table_1.Table(table);
        if ((this.lista_declaracion != null)) {
            let simbolo;
            for (let index = 0; index < this.lista_declaracion.length; index++) {
                this.lista_declaracion[index].execute(this.newTable, tree);
            }
            simbolo = new Simbolo_1.Simbolo(this.tipo, this.id, this.lista_declaracion, new tipo_1.Tipo(tipo_1.tipos.STRUCTS), this.line, this.column);
            simbolo.ambito = this.newTable;
            if (table.getVariable(this.id) == null) {
                table.setVariable(simbolo);
                tree.Variables.push(simbolo);
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `El array ${this.id} no puede ser declarado debido a que ya ha sido declarado anteriormente`, this.line, this.column);
                return error;
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("DECLARACION STRUCT");
        nodo.agregarHijo("struct");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo("{");
        for (let index = 0; index < this.lista_declaracion.length; index++) {
            nodo.agregarHijo(this.lista_declaracion[index].getNodo());
        }
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.Struct = Struct;
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
