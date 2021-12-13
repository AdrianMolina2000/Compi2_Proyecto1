import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Simbolo } from "../Simbols/Simbolo";
import { Excepcion } from "../other/Excepcion";
import { NodoAST } from "../Abstract/NodoAST";
import { tipos } from "../other/tipo";

export class Vector extends Nodo {
    id: String;
    posicion: Nodo;
    valor: Nodo;
    bandera1: Boolean;
    pos: any;

    constructor(id: String, posicion: Nodo, line: Number, column: Number) {
        super(null, line, column);
        this.id = id;
        this.posicion = posicion;
        this.bandera1 = false;
    }

    execute(table: Table, tree: Tree) {
        let variable: Simbolo;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion('Semantico',
                `El Vector {${this.id}} no ha sido encontrada`,
                this.line, this.column);
            return error;
        }

        this.tipo = variable.tipo;
        var arreglo: Array<Nodo>;
        arreglo = variable.valor.valor;
        this.pos = this.posicion.execute(table, tree);
        if (this.posicion.tipo.tipo == tipos.ENTERO) {
            if ((this.pos >= arreglo.length ) || (this.pos < 0)) {
                const error = new Excepcion('Semantico',
                `La Posicion especificada no es valida para el vector {${this.id}}`,
                    this.line, this.column);
                    return error;
            } else {
                try {
                    this.bandera1 = true;
                    this.valor = arreglo[this.pos].execute(table, tree);
                    
                    return this.valor;
                } catch (err) {
                    const error = new Excepcion('Semantico',
                    `La Posicion especificada no es valida para el vector {${this.id}}`,
                        this.line, this.column);
                    return error;
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
        var nodo: NodoAST = new NodoAST("Vector Posicion");
        try {
            if (this.bandera1) {
                var nodo2: NodoAST = new NodoAST(`${this.id}[${this.pos}]`);
                nodo2.agregarHijo(this.valor.getNodo());
                nodo.agregarHijo(nodo2);
            }
        } catch (err) {

        }
        return nodo;
    }
}
