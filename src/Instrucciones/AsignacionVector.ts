import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Simbolo } from "../Simbols/Simbolo";
import { Tipo, tipos } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";
import { Vector } from "../Expresiones/Vector";


export class AsignacionVector extends Nodo {
    id: String;
    posicion: Nodo;
    valor: Nodo;
    pos: any;

    constructor(id: String, posicion: Nodo, valor: Nodo, line: Number, column: Number) {
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

        let variable: Simbolo;
        variable = table.getVariable(this.id);

        if (variable == null) {
            const error = new Excepcion('Semantico',
                `La variable {${this.id}} no ha sido encontrada`,
                this.line, this.column);
            return error;
        }

        var arreglo: Array<Nodo> = variable.valor.valor;
        this.pos = this.posicion.execute(table, tree);

        if (this.posicion.tipo.tipo == tipos.ENTERO) {
            if ((this.pos >= arreglo.length) || (this.pos < 0)) {
                const error = new Excepcion('Semantico',
                    `La Posicion especificada no es valida para el vector {${this.id}}`,
                    this.line, this.column);
                return error;
            } else {
                if (variable.tipo.tipo != this.valor.tipo.tipo) {
                    this.valor.execute(table, tree);
                    if ((variable.tipo.tipo == tipos.DECIMAL) && (this.valor.tipo.tipo == tipos.ENTERO)) {
                        this.valor.tipo.tipo = tipos.DECIMAL;
                        arreglo[this.pos] = this.valor;
                        variable.valor.valor = arreglo;
                        return null;
                    } else {
                        const error = new Excepcion('Semantico',
                            `la posicion del vector no puede reasignarse debido a que son de diferentes tipos`,
                            this.line, this.column);
                        return error;
                    }
                } else {
                    arreglo[this.pos] = this.valor;
                    variable.valor.valor = arreglo;
                    return null;
                }
            }
        } else {
            const error = new Excepcion('Semantico',
                `Se esperaba un valor entero en la posicion`,
                this.line, this.column);
            return error;
        }
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