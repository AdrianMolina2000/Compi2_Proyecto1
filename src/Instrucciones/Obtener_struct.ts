import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Simbolo } from "../Simbols/Simbolo";
import { Tipo, tipos } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";
import { Vector } from "../Expresiones/Vector";
import { If } from "./If";


function alv(padre: Simbolo, id: String, lista_ids: Array<String>,  tree: Tree, table: Table): any {

  
 





    for (let index = 0; index < padre.valor.length; index++) {

           

        if (padre.valor[index].id == padre.id + "_" + id) {

            
            if (padre.valor[index].tipo.tipo == 11) {
               


                if (lista_ids.length == 1) {
                   

                       return padre.valor[index].execute(tree,table)

                }

                else if(lista_ids.length>1){
                      
                    lista_ids.shift()
                    let id_hijo: Simbolo
                    id_hijo = table.getVariable(padre.valor[index].nombre_struct)

                      alv(id_hijo, lista_ids[0], lista_ids,  tree, table);





                    

                     





                }





            }
            else {

                console.log("-------------")
                console.log(padre.valor[index].execute(tree,table))
                        
              
                    return padre.valor[index].execute(tree,table)



               



                
            }




           /*
           
           */


        }






    }









}




export class Obtener_struct extends Nodo {
    id: Nodo;
    posicion: Array<String>;
  
    pos: any;

    constructor(id: Nodo, posicion: Array<String>, line: Number, column: Number) {
        super(null, line, column);
        this.id = id.id;
        this.posicion = posicion;
       
    }

    execute(table: Table, tree: Tree) {

       // const result = this.valor.execute(table, tree);
         
         
         let id_struct: Simbolo
        id_struct = table.getVariable(this.id)

        
        //console.log(table.getVariable("alv_a"))
        
      

        if (id_struct.tipo2.tipo == tipos.STRUCTS) {

            //   console.log(this.posicion[0])
           
          
           return alv(id_struct, this.posicion[0], this.posicion,  tree, table);











        }


        else {
            const error = new Excepcion('Semantico',
                `no se puede  modificar el valor del struct debido a que este id no es un struct \n`,
                this.line, this.column);
            return error;

        }

       




    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("ASIGNACION VECTOR");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(`[${this.pos}]`);
        nodo.agregarHijo("=");
        //nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}