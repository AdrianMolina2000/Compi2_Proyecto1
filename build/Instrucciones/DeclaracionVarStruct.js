"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Simbolo_1 = require("../Simbols/Simbolo");
const NodoAST_1 = require("../Abstract/NodoAST");
class DeclaracionVarStruct extends Nodo_1.Nodo {
    constructor(tipo, nombre_struct, id, valor, line, column) {
        super(tipo, line, column);
        this.id = id;
        this.nombre_struct = nombre_struct;
        this.valor = valor;
    }
    execute(table, tree) {
        this.newTable = new Table_1.Table(table);
        if (this.valor instanceof Excepcion_1.Excepcion) {
            return this.valor;
        }
        let simbolo;
        // console.log(this.nombre_struct+"::")
        let struct_padre;
        struct_padre = this.newTable.getVariable(this.nombre_struct);
        this.valor = struct_padre.valor;
        for (let index = 0; index < this.valor.length; index++) {
            let id_padre = this.id[0].split("_");
            let id_hijo = this.valor[index].id[0].split("_");
            console.log(id_padre[1] + "---" + id_hijo[1]);
            this.valor[index].id[0] = id_padre[1] + "_" + id_hijo[1];
            this.valor[index].execute(table, tree);
            // let id_hijo = this.valor[index].id[0].split("_")
            //   console.log(id_padre[1]+"--"+id_hijo[1])
            //   this.valor[index].id[0]=id_padre[1]+"_"+id_hijo[1]
        }
        console.log(this.valor);
        /* atributos_struct = new Struct(this.id[0],struct_padre.valor,this.line,this.columns);
           console.log("----")
          console.log(atributos_struct);
          console.log("---")*/
        //this.valor=atributos_struct;*/
        simbolo = new Simbolo_1.Simbolo(this.tipo, this.id[0], struct_padre.valor, new tipo_1.Tipo(tipo_1.tipos.STRUCTS), this.line, this.column);
        const res = table.setVariable(simbolo);
        tree.Variables.push(simbolo);
        simbolo.ambito = this.newTable;
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("DECLARACION");
        nodo.agregarHijo(this.tipo + "");
        nodo.agregarHijo(this.id);
        if (this.valor != null) {
            nodo.agregarHijo("=");
            nodo.agregarHijo(this.valor.getNodo());
        }
        return nodo;
    }
}
exports.DeclaracionVarStruct = DeclaracionVarStruct;
