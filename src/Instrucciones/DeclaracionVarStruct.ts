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

export class DeclaracionVarStruct extends Nodo {
    nombre_struct: String
    id: String;
    valor: Nodo;

    constructor(tipo: tipo, nombre_struct: String, id: String, valor: Nodo, line: Number, column: Number) {
        super(tipo, line, column);
        this.id = id;
        this.nombre_struct = nombre_struct
        this.valor=valor;
    }

    execute(table: Table, tree: Tree) {
        // const result = this.valor.execute(table, tree);

        if (this.valor instanceof Excepcion) {
            return this.valor;
        }



        let simbolo: Simbolo;
        let id_struct: Simbolo;

        //id_struct = table.getVariable(this.nombre_struct);
        

        simbolo = new Simbolo(this.tipo, this.id, this.valor, new Tipo(tipos.STRUCTS), this.line, this.column);
        const res = table.setVariable(simbolo);
       
        tree.Variables.push(simbolo); 









        // if (res != null) {
        // const error = new Excepcion('Semantico',
        // res,
        // this.line, this.column);
        // tree.excepciones.push(error);
        // tree.consola.push(error.toString());
        // }
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