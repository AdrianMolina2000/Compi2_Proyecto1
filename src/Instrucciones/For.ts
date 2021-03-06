import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos } from "../other/tipo";
import { Continue } from "../Expresiones/Continue";
import { Break } from "../Expresiones/Break";
import { NodoAST } from "../Abstract/NodoAST";
import { Retorno } from "./Retorno";

export class For extends Nodo {
    inicio: Nodo;
    fin: Nodo;
    paso: Nodo;
    expresion: Array<Nodo>;

    constructor(inicio: Nodo, fin: Nodo, paso: Nodo, expresion: Array<Nodo>, line: Number, column: Number) {
        super(null, line, column);
        this.inicio = inicio;
        this.fin = fin;
        this.paso = paso;
        this.expresion = expresion;
    }

    execute(table: Table, tree: Tree) {

        this.inicio.execute(table, tree);
        const newtable = new Table(table);
        let result: Nodo;

        do {
            result = this.fin.execute(newtable, tree);
            if (result instanceof Excepcion) {
                return result;
            }

            if (this.fin.tipo.tipo !== tipos.BOOLEANO) {
                const error = new Excepcion('Semantico',
                    `Se esperaba una expresion booleana para la condicion`,
                    this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }

            if (result) {
                for (let i = 0; i < this.expresion.length; i++) {
                    const res = this.expresion[i].execute(newtable, tree);
                    if (res instanceof Continue) {
                        break;
                    } else if (res instanceof Break || res instanceof Retorno) {
                        return;
                    }
                }
                this.paso.execute(table, tree);
            }
        } while (result);
        return null;
    }

    getNodo() {
        var nodo:NodoAST  = new NodoAST("FOR");
        nodo.agregarHijo("for");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.inicio.getNodo());
        nodo.agregarHijo(";");
        nodo.agregarHijo(this.fin.getNodo());
        nodo.agregarHijo(";");
        nodo.agregarHijo(this.paso.getNodo());
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        var nodo2:NodoAST  = new NodoAST("INSTRUCCIONES");

        for(let i = 0; i<this.expresion.length; i++){
            nodo2.agregarHijo(this.expresion[i].getNodo());
        }
        nodo.agregarHijo(nodo2);
        nodo.agregarHijo("}");
        return nodo;
    }
}