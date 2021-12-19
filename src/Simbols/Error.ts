import {Excepcion} from "../other/Excepcion";
export class Error
{
Nodo:Excepcion

 static Errores:any=[]



constructor(  tipo: String, descripcion: String, line: Number, column: Number){

  Error.Errores.push(new Excepcion(tipo,descripcion,line,column));

    
    
    
}


}




