import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Tipo, tipos } from "../other/tipo";
import { Simbolo } from "../Simbols/Simbolo";
import { Primitivo } from "../Expresiones/Primitivo";
import { NodoAST } from "../Abstract/NodoAST";
import { fork } from "child_process";
import { forEachChild } from "typescript";



export class DeclaracionVarStruct extends Nodo {
    nombre_struct: String
    id: String;
    valor: Nodo;

    constructor(tipo: Tipo, nombre_struct: String, id: String, valor: Nodo, line: Number, column: Number) {
        super(tipo, line, column);
        this.id = id;
        this.nombre_struct = nombre_struct
        this.valor=valor;
    }

    execute(table: Table, tree: Tree) {

        if (this.valor instanceof Excepcion) {
            return this.valor;
        }

        let simbolo: Simbolo;

        simbolo = new Simbolo(this.tipo, this.id[0], this.valor, new Tipo(tipos.STRUCTS), this.line, this.column);
        const res = table.setVariable(simbolo);
       
        tree.Variables.push(simbolo); 

        return null;
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("DECLARACION");
        nodo.agregarHijo(this.tipo + "");
        nodo.agregarHijo(this.id);

        if (this.valor != null) {
            nodo.agregarHijo("=");
            nodo.agregarHijo(this.valor.getNodo());
        }

        return nodo;
    }
}