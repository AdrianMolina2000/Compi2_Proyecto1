import {Nodo} from "../Abstract/Nodo";
import {Table} from "../Simbols/Table";
import {Tree} from "../Simbols/Tree";
import {Tipo} from "../other/tipo";
import {tipos} from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";


export class Print extends Nodo{
    expresion : Array <Nodo>;
    tipo_print: Number;

    constructor(expresion: Array <Nodo>, line: Number, column: Number,tipo_print:Number){
        super(new Tipo(tipos.VOID), line, column);
        this.expresion = expresion; 
        this.tipo_print=tipo_print;
        
    }

    execute(table: Table, tree: Tree): any {
        

        for (let key in this.expresion) {
            
           
            const valor = this.expresion[key].execute(table, tree);
            tree.consola.push(valor);
        }
        /*agregando el tipo para el pritnln lo  maneje asi  fuera del for para evitar clavos papa ctm*/ 
        if (this.tipo_print==1){
            
        }
        else  if (this.tipo_print==2) {
            
            tree.consola.push("\n");

        }
         
        return null;
    }

    getNodo() {
        var nodo:NodoAST  = new NodoAST("PRINT");
        nodo.agregarHijo("print");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.expresion[0].getNodo());
        nodo.agregarHijo(")");
        return nodo;
    }
}