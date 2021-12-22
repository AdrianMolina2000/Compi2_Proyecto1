import { NodoReporteGramatica } from "./NodoReporteGramatica"
import {Simbolo}from "./Simbolo"
import {Tipo, tipos} from "../other/tipo";
export class Var{


 static Lista:any=[]



constructor( tipo: Tipo, id: String, valor: Object, tipo2: Tipo, line:Number, column:Number){

  Var.Lista.push(new Simbolo(tipo,id,valor,tipo2,line,column));

    
    
    
}




}