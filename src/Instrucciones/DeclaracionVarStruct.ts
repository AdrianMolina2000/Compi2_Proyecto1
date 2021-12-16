import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Tipo, tipos } from "../other/tipo";
import { Simbolo } from "../Simbols/Simbolo";
import { Primitivo } from "../Expresiones/Primitivo";
import { NodoAST } from "../Abstract/NodoAST";
import { fork } from "child_process";
import { forEachChild } from "typescript";
import { Struct } from "./Struct";


export class DeclaracionVarStruct extends Nodo {
    nombre_struct: String
    id: String;
    valor:  Array<Nodo>;
    newTable: Table

    constructor(tipo: Tipo, nombre_struct: String, id: String, valor:  Array<Nodo>, line: Number, column: Number) {
        super(tipo, line, column);
        this.id = id;
        this.nombre_struct = nombre_struct
        this.valor = valor;
    }



    execute(table: Table, tree: Tree) {
        this.newTable = new Table(table);

        if (this.valor instanceof Excepcion) {
            return this.valor;
        }
        
        let simbolo: Simbolo;
        // console.log(this.nombre_struct+"::")
        let struct_padre: Simbolo;
        struct_padre = this.newTable.getVariable(this.nombre_struct);

        this.valor=struct_padre.valor

       
    for (let index = 0; index < this.valor.length; index++) {

          
        
        let id_padre=this.id[0].split("_")
     
        let id_hijo = this.valor[index].id[0].split("_")

        console.log(id_padre[1]+"---"+id_hijo[1])

        this.valor[index].id[0]=id_padre[1]+"_"+id_hijo[1]

        this.valor[index].execute(table,tree)


        // let id_hijo = this.valor[index].id[0].split("_")
     //   console.log(id_padre[1]+"--"+id_hijo[1])
        
     //   this.valor[index].id[0]=id_padre[1]+"_"+id_hijo[1]
          
      
            
       
         
     }

     console.log(this.valor)
          
     
        

        /* atributos_struct = new Struct(this.id[0],struct_padre.valor,this.line,this.columns); 
           console.log("----") 
          console.log(atributos_struct);    
          console.log("---")*/

        //this.valor=atributos_struct;*/
        simbolo = new Simbolo(this.tipo, this.id[0], struct_padre.valor, new Tipo(tipos.STRUCTS), this.line, this.column);
        const res = table.setVariable(simbolo);
        tree.Variables.push(simbolo);
        simbolo.ambito = this.newTable;


        return null;
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("DECLARACION");
        nodo.agregarHijo(this.tipo + "");
        nodo.agregarHijo(this.id);

        if (this.valor != null) {
            nodo.agregarHijo("=");
            nodo.agregarHijo(this.valor.getNodo());
        }

        return nodo;
    }
}