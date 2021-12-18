import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

export class CaracterOFposition extends Nodo {
    expresion: Nodo;

     posicion:Nodo;
     final:Number;
    constructor(expresion: Nodo,posicion:Nodo,line: Number, column: Number) {
        super(new Tipo(tipos.STRING), line, column);
        this.expresion = expresion;
        this.posicion=posicion;
      
    }

    execute(table: Table, tree: Tree) {

        try {
            const resultado = this.expresion.execute(table, tree);
            const pos = this.posicion.execute(table,tree);

         
            if (resultado instanceof Excepcion) {
                return resultado;
            } else {
                    //const inicio_rec=this.inicio;
                    return resultado.charAt(pos)
            }
        } catch (err) {
            console.log(err)
            const error = new Excepcion('Semantico',
                `Ha ocurrido un error querer imprimir la posicion del string joven`,
                this.line, this.column);
            return error;
        }
    }

    getNodo() {
        try {
            var nodo: NodoAST = new NodoAST("CaracterOfPosition");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo("CaracterOfPosition");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.posicion.getNodo());
            
            nodo.agregarHijo(")");
            return nodo;
        } catch (err) {
            var nodo: NodoAST = new NodoAST("CaracterOfPosition");
            return nodo;
        }
    }

}