import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";
import { Primitivo } from "./Primitivo";

export class Length extends Nodo {
    expresion: Nodo;

    constructor(expresion: Nodo, line: Number, column: Number) {
        super(new Tipo(tipos.ENTERO), line, column);
        this.expresion = expresion;
    }

    execute(table: Table, tree: Tree) {
        const resultado = this.expresion.execute(table, tree);
        try {
            if (resultado instanceof Excepcion) {
                return resultado;
            } 

            if(resultado instanceof Primitivo){
                if(resultado.tipo.tipo == 6){
                    return resultado.valor.length;
                }
            }

            if(this.expresion.tipo.tipo == 6){
                return this.expresion.valor.length
            }else{
                return resultado.length;
            }
            
        } catch (err) {
            
            const error = new Excepcion('Semantico',
                `Ha ocurrido un error con la longitud buscada`,//
                this.line, this.column);
                tree.excepciones.push(error)
                tree.consola.push(error.toString());
            return error;
        }
    }

    getNodo() {
        try {
            var nodo: NodoAST = new NodoAST("LENGTH");
            nodo.agregarHijo("Length");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        } catch (err) {
            var nodo: NodoAST = new NodoAST("LENGTH");
            return nodo;
        }
    }

}