import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

export class Nativas_Diferentes extends Nodo {
    expresion: Nodo;
    tipo: Tipo;
    constructor(tipo: Tipo, expresion: Nodo, line: Number, column: Number) {
        super(new Tipo(tipos.STRING), line, column);
        this.expresion = expresion;
        this.tipo = tipo;
    }

    execute(table: Table, tree: Tree) {

        try {

            const resultado = this.expresion.execute(table, tree);

            if (resultado instanceof Excepcion) {
                console.log(resultado);
                return resultado;
            } else {

                if (this.tipo.tipo == tipos.DECIMAL) {
                    return parseFloat(resultado)


                }

                else if (this.tipo.tipo == tipos.ENTERO) {
                    return parseInt(resultado)


                }
                else if (this.tipo.tipo == tipos.BOOLEANO) {

                    switch (resultado) {
                        case true:
                        case "true":
                        case 1:
                        case "1":
                        case "on":
                        case "yes":
                            return true;
                        case false:
                        case "false":
                        case 0:
                        case "0":
                        
                        case "no":
                            return  false;
                        default:
                            return false;
                    }

                }

            }
        } catch (err) {
            const error = new Excepcion('Semantico',
                `Ha ocurrido un error al querrer convertir `,
                this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
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