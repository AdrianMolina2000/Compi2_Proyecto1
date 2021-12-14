import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Simbolo } from "../Simbols/Simbolo";
import { Tipo, tipos } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";
import { Vector } from "../Expresiones/Vector";
import { If } from "./If";
import { Print } from "./Print";


function alv(padre: Simbolo, id: String, lista_ids: Array<String>, valor: Nodo, tree: Tree, table: Table): any {

  
 
    

    for (let index = 0; index < padre.valor.length; index++) {



        if (padre.valor[index].id == padre.id + "_" + id) {


            if (padre.valor[index].tipo.tipo == 11) {
               


                if (lista_ids.length == 1) {
                   

                       padre.valor[index]=valor


                }

                else if(lista_ids.length>1){
                      
                    lista_ids.shift()
                    let id_hijo: Simbolo
                    id_hijo = table.getVariable(padre.valor[index].nombre_struct)

                     alv(id_hijo, lista_ids[0], lista_ids, valor, tree, table);





                    

                     





                }





            }
            else {
                
                      console.log("------------")
             
                       
                      padre.valor[index].valor=valor

                      console.log(padre.valor[index].valor)
                       
                 

               



                
            }




           /*
           
           */


        }






    }









}




export class Asignacion_Struct extends Nodo {
    id: String;
    posicion: Array<String>;
    valor: Nodo;
    pos: any;

    constructor(id: String, posicion: Array<String>, valor: Nodo, line: Number, column: Number) {
        super(null, line, column);
        this.id = id;
        this.posicion = posicion;
        this.valor = valor;
    }

    execute(table: Table, tree: Tree) {

        const result = this.valor.execute(table, tree);

        let id_struct: Simbolo
        id_struct = table.getVariable(this.id)


        let efe: Simbolo
        efe = table.getVariable("alv2_efe2")
        //console.log(table.getVariable("alv_a"))

        // prueba=table.getVariable("alv_a")

        
        if (id_struct.tipo2.tipo == tipos.STRUCTS) {

            //   console.log(this.posicion[0])




            alv(id_struct, this.posicion[0], this.posicion, this.valor, tree, table);












        }


        else {
            const error = new Excepcion('Semantico',
                `no se puede  modificar el valor del struct debido a que este id no es un struct \n`,
                this.line, this.column);
            return error;

        }

        if (result instanceof Excepcion) {
            return result;
        }




    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("ASIGNACION VECTOR");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(`[${this.pos}]`);
        nodo.agregarHijo("=");
        nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}