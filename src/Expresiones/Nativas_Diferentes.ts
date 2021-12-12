import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

export class Nativas_Diferentes extends Nodo {
    expresion: Nodo;
    tipo2: Tipo;
    constructor(tipo2: Tipo, expresion: Nodo, line: Number, column: Number) {
        super(null, line, column);
        this.expresion = expresion;
        this.tipo2 = tipo2;
    }

    execute(table: Table, tree: Tree) {
        try {
            const resultado = this.expresion.execute(table, tree);

            if (resultado instanceof Excepcion) {
                return resultado;
            }

            if (typeof (resultado) == typeof ("")) {

                if (this.tipo2.tipo == tipos.DECIMAL) {
                    this.tipo = new Tipo(tipos.DECIMAL)
                    return parseFloat(resultado)
                } else if (this.tipo2.tipo == tipos.ENTERO) {
                    this.tipo = new Tipo(tipos.ENTERO)
                    return parseInt(resultado)
                }
                else if (this.tipo2.tipo == tipos.BOOLEANO) {
                    this.tipo = new Tipo(tipos.BOOLEANO)
                    switch (resultado) {
                        case "true":
                        case "1":
                            return true;
                        case "false":
                        case "0":
                            return false;
                        default:
                            return false;
                    }
                }
            } else {
                const error = new Excepcion('Semantico',
                    `La entrada debe ser del tipo String para realizar esta operacion `,
                    this.line, this.column);
                return error;
            }
        } catch (err) {
            const error = new Excepcion('Semantico',
                `Ha ocurrido un error al querrer convertir `,
                this.line, this.column);
            return error;
        }
    }

    getNodo() {
        try {
            var nodo: NodoAST = new NodoAST("TOLOWER");
            nodo.agregarHijo("ToLower");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        } catch (err) {
            var nodo: NodoAST = new NodoAST("ToLower");
            return nodo;
        }
    }


}