import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Tipo, tipos } from "../other/tipo";
import { Simbolo } from "../Simbols/Simbolo";
import { NodoAST } from "../Abstract/NodoAST";
import { Declaracion } from "./Declaracion";
import { Continue } from "../Expresiones/Continue";
import { Break } from "../Expresiones/Break";
import { Grafica } from "./Grafica";

export class Main extends Nodo {
    id: String;
    listaParams: Array<Nodo>;
    instrucciones: Array<Nodo>;

    constructor(tipo: Tipo,  instrucciones: Array<Nodo>, line: Number, column: Number) {
        super(tipo, line, column);
      
        this.instrucciones = instrucciones;
    }

    execute(table: Table, tree: Tree): any {
//com oasi ?

        // var nombre = this.id + "$";

       

        var result: Array<Nodo> = this.instrucciones;

        if (result){

            for (let i = 0; i < result.length; i++) {
                const res = result[i].execute(table, tree);
                if (res instanceof Continue || res instanceof Break) {
                    return res;
                }
                if(res instanceof Grafica ){


                    res.execute(table,tree);
                }
                



        }



       
    }

    return null;

}

    getNodo() {
        var nodo: NodoAST = new NodoAST("MAIN");
        if (this.tipo.tipo == tipos.VOID) {
            nodo.agregarHijo("Void");
        } 
        nodo.agregarHijo("main");
        nodo.agregarHijo("(");
        
        

        nodo.agregarHijo(")");
        nodo.agregarHijo("{");

        var nodo3: NodoAST = new NodoAST("INSTRUCCIONES");
        for (let i = 0; i < this.instrucciones.length; i++) {

            if(this.instrucciones[i].getNodo()!= null){
            nodo3.agregarHijo(this.instrucciones[i].getNodo());
        }
        }
        nodo.agregarHijo(nodo3);
        nodo.agregarHijo("}");
        return nodo;
    }
}