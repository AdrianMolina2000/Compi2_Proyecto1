import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos } from "../other/tipo";
import { Continue } from "../Instrucciones/Continue";
import { Break } from "../Expresiones/Break";
import { NodoAST } from "../Abstract/NodoAST";
import { Retorno } from "./Retorno";

export class If_unico extends Nodo {
    condicion: Nodo;
    listaIf: Nodo;
    listaIf2: Array<Nodo>;
    listaElse: Nodo;
    tipos: Number;


    constructor(condicion: Nodo, listaIf: Nodo,listaIf2: Array<Nodo>, listaElse: Nodo, tipos: Number, line: Number, column: Number) {
        super(null, line, column);
        this.condicion = condicion;
        this.listaIf = listaIf;
        this.listaElse = listaElse;
        this.tipos = tipos;
        this.listaIf2=listaIf2;
    }

    execute(table: Table, tree: Tree) {

        let cont1 = 0;
        let cont2 = 0;


        const newtable = new Table(table);
        let result: Nodo;
        result = this.condicion.execute(newtable, tree);
        if (result instanceof Excepcion) {
            return result;
        }

        if (this.condicion.tipo.tipo !== tipos.BOOLEANO) {
            const error = new Excepcion('Semantico',
                `Se esperaba una expresion BOOLEANA para la condicion`,
                this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }

        if (result) {
            if (this.tipos == 1) {

                const res = this.listaIf.execute(newtable, tree);
                if (res instanceof Continue || res instanceof Break || res instanceof Retorno) {
                    return res;
                }

            } else {
                for (let i = 0; i < this.listaIf2.length; i++) {
                    const res = this.listaIf2[i].execute(newtable, tree);
                    if (res instanceof Continue || res instanceof Break || res instanceof Retorno) {
                        return res;
                    }
                }



            }





        } else {



            const res = this.listaElse.execute(newtable, tree);
            if (res instanceof Continue || res instanceof Break || res instanceof Retorno) {
                return res;
            }





        }

        return null;



    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("IF");
        nodo.agregarHijo("if");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.condicion.getNodo());
        nodo.agregarHijo(")");
     
        var nodo2: NodoAST = new NodoAST("INSTRUCCIONES IF");
        nodo2.agregarHijo(this.listaIf.getNodo());

        nodo.agregarHijo(nodo2);
    
        if (this.listaElse != null) { // ELSE
            nodo.agregarHijo("else");
          
            var nodo3: NodoAST = new NodoAST("INSTRUCCIONES ELSE");

            nodo3.agregarHijo(this.listaElse.getNodo());

            nodo.agregarHijo(nodo3);
            
        }
        return nodo;
    }
}