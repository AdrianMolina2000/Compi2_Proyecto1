import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

export class Substring extends Nodo {
    expresion: Nodo;

     inicio:Number;
     final:Number;
    constructor(expresion: Nodo,inicio:Number,final:Number, line: Number, column: Number) {
        super(new Tipo(tipos.STRING), line, column);
        this.expresion = expresion;
        this.inicio=inicio;
        this.final=final;
    }

    execute(table: Table, tree: Tree) {

        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion) {
                return resultado;
            } else {
                console.log(this.inicio+"--"+this.final);
                console.log(resultado.substring(this.inicio,this.final));
                 //const inicio_rec=this.inicio;
                 return resultado.substring(this.inicio,this.final);

             


            }
        } catch (err) {
            const error = new Excepcion('Semantico',
                `Ha ocurrido un error al momento de realizar la funcion substring`,
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