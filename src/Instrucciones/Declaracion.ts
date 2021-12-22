import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Tipo, tipos } from "../other/tipo";
import { Simbolo } from "../Simbols/Simbolo";
import { Primitivo } from "../Expresiones/Primitivo";
import { NodoAST } from "../Abstract/NodoAST";
import {Var} from "../Simbols/Var"

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
    else if (tipo.tipo == tipos.STRUCTS) {
        return new Primitivo(tipo, null, line, column);
    }


}

export class Declaracion extends Nodo {
    tipo: Tipo;
    id: Array<String>;
    valor: Nodo;

    constructor(tipo: Tipo, id: Array<String>, valor: Nodo, line: Number, column: Number) {
        super(tipo, line, column);
        this.id = id;
        this.valor = valor;
    }

    execute(table: Table, tree: Tree) {
        const result = this.valor.execute(table, tree);

        if (result instanceof Excepcion) {
            return result;
        }

        if (this.valor.tipo.tipo != this.tipo.tipo) {
            if (this.tipo.tipo == tipos.DECIMAL && (this.valor.tipo.tipo == tipos.DECIMAL || this.valor.tipo.tipo == tipos.ENTERO)) {
                this.valor.tipo.tipo = tipos.DECIMAL;
            } else {
                const error = new Excepcion('Semantico',
                    `La variable no puede ser declarada debido a que son de diferentes tipos`,
                    this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }

        let simbolo: Simbolo;


        for (let key in this.id) {


            simbolo = new Simbolo(this.tipo, this.id[key], result, new Tipo(tipos.VARIABLE), this.line, this.column);
            const res = table.setVariable(simbolo);
            tree.Variables.push(simbolo)
            Var.Lista.push(simbolo)

        }

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

    get3D(table: Table, tree: Tree): String {
        let c3d = '';
        let variable = table.getVariable(this.id[0])
        c3d += `    stack[(int)${variable.stack}] = ${variable.valor};\n`;
        
        return c3d;
    }
}