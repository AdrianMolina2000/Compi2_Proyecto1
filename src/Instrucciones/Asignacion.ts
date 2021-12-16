import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Simbolo } from "../Simbols/Simbolo";
import { Tipo, tipos } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";
import { Primitivo } from "../Expresiones/Primitivo";

function revisar(tipo1: Tipo, lista: Nodo) {
    for (let key in lista.valor) {
        if (lista.valor[key].tipo.tipo == 6) {
            return revisar(tipo1, lista.valor[key])
        }
        if (tipo1 != lista.valor[key].tipo.tipo) {
            return false;
        }
    }
    return true;
}

export class Asignacion extends Nodo {
    id: String;
    valor: Nodo;

    constructor(id: String, valor: Nodo, line: Number, column: Number) {
        super(null, line, column);
        this.id = id;
        this.valor = valor;
    }

    execute(table: Table, tree: Tree) {
        const result = this.valor.execute(table, tree);
        var bandera = true;
        if (result instanceof Excepcion) {
            return result;
        }

        let variable: Simbolo;
        variable = table.getVariable(this.id);

        if (variable == null) {
            const error = new Excepcion('Semantico',
                `La variable {${this.id}} no ha sido encontrada`,
                this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }


        if (this.valor.tipo.tipo != variable.tipo.tipo) {
            if (variable.tipo2.tipo == 6 && this.valor.tipo.tipo == 6) {
                bandera = false;
            } else {
                if (variable.tipo.tipo == tipos.DECIMAL && (this.valor.tipo.tipo == tipos.DECIMAL || this.valor.tipo.tipo == tipos.ENTERO)) {
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
        }

        var val;


        try {
            let variable: Simbolo
            variable = table.getVariable((<any>this.valor).id)
            if (variable.tipo2.tipo == tipos.ARREGLO) {
                let nuevoArray = new Array<Nodo>();
                for(let x = 0; x < this.valor.valor.valor.length; x++){
                    nuevoArray.push(Object.assign(Object.create(this.valor.valor.valor[x]), this.valor.valor.valor[x]));
                }

                let nuevoObjeto = new Primitivo(new Tipo(tipos.ARREGLO), nuevoArray, this.valor.line, this.valor.column);
                val = nuevoObjeto;
            }


        } catch (err) {
            if (bandera) {
                val = result;
            } else {
                if (revisar(variable.tipo.tipo, this.valor)) {
                    val = this.valor;
                } else {
                    const error = new Excepcion('Semantico',
                        `El Array no puede ser declarado debido a que son de diferentes tipos \n`,
                        this.line, this.column);
                    return error;
                }
            }
        }

        variable.valor = val;
        return null;
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("ASIGNACION");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo("=");
        nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}