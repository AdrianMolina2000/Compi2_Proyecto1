import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos } from "../other/tipo";
import { Simbolo } from "../Simbols/Simbolo";
import { NodoAST } from "../Abstract/NodoAST";
import { Declaracion } from "./Declaracion";
import { Continue } from "../Expresiones/Continue";
import { Break } from "../Expresiones/Break";
import { Retorno } from "./Retorno";
import {DeclaracionArray} from './DeclaracionArray'

export class LlamadaMetodo extends Nodo {
    id: String;
    listaParams: Array<Nodo>;

    constructor(id: String, listaParams: Array<Nodo>, line: Number, column: Number) {
        super(null, line, column);
        this.id = id;
        this.listaParams = listaParams;
    }

    execute(table: Table, tree: Tree): any {
        const newtable = new Table(table);

        var nombre = this.id + "$";
        // var nombre = this.id;
        var index = 0;
        for (let param of this.listaParams) {
            var valor = param.execute(newtable, tree);
            // nombre += <any>param.tipo;
            index += 1;
        }
        nombre += index + "";


        let simboloMetodo: Simbolo;
        simboloMetodo = table.getVariable(nombre);
        if (simboloMetodo == null) {
            const error = new Excepcion('Semantico',
                `El metodo {${this.id}} no ha sido encontrado con esa combinacion de parametros`,
                this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }

        var parametros: Array<Nodo> = (<any>simboloMetodo).valor[0];
        for (let i = 0; i < parametros.length; i++) {

            
           if(parametros[i] instanceof DeclaracionArray){
           /**
            * 
            * 
            * let dec = struct_padre.valor[index];
                        let exp = this.expresion.listaParams[index];
                        let nuevoArray2 = new Array<Nodo>();
                        for(let i = 0; i < exp.valor.length; i++){
                            nuevoArray2.push(Object.assign(Object.create(exp.valor[i]), exp.valor[i]));
                        }

                        let prim = Object.assign(Object.create(exp), exp);
                        prim.valor = nuevoArray2;
                        let new_dec = new DeclaracionArray(dec.tipo, dec.id, null, dec.line, dec.column);
                        new_dec.listaValores = prim
                        nuevoArray.push(new_dec);
                    }
            * 
            */
            var para: DeclaracionArray;
            var crear: DeclaracionArray;
            para = <DeclaracionArray>parametros[i];
            let Alv = new Array<Nodo>();
           
            crear = para;

            for (let index = 0; index < this.listaParams.length; index++) {
             Alv.push(Object.assign(Object.create(this.listaParams[index]), this.listaParams[index]))
                
            }
          
            //es que cuando vos cambias  ponete xd 
            /**
             * 
             * void efe(){
     int i=0;
     int j=1;
     int [] array = [10,20,30,40,50,60];
    array[j]=array[5];
    array[i]=array[j];
    print(array);
}
 efe();
 esa entrada si jala ponete asigancion vector n
             * 
             * 
             * void swap(int i, int j, int [] array) {
   array[j] = 10;
    array[i] = array[j];
    
     

      
  
}
   int [] array=[1,2,3,4,5,6];

int efe=0;
swap(efe,efe+1,array);

 println(array);
 pero aca no xd

             * 
             * 
             * 
             * 
            */
            crear.listaValores=Alv;
            
            crear.execute(newtable, tree);
           
           } else {
               
            var para: Declaracion;
            var crear: Declaracion;
            para = <Declaracion>parametros[i];
            crear = para;
            crear.valor = this.listaParams[i];
            crear.execute(newtable, tree);
        }}

        var result: Array<Nodo> = (<any>simboloMetodo).valor[1];

        if (result) {
            for (let i = 0; i < result.length; i++) {
                const res = result[i].execute(newtable, tree);
                if (res instanceof Continue || res instanceof Break) {
                    return res;
                }

                if (simboloMetodo.tipo.tipo == tipos.VOID) {
                    if (res instanceof Retorno) {
                        const error = new Excepcion('Semantico',
                            `No se esperaba un retorno en este metodo`,
                            res.line, res.column);
                        tree.excepciones.push(error);
                        tree.consola.push(error.toString());
                        return error;
                    }
                } else {
                    if (res instanceof Retorno) {
                        if (res.expresion != null) {

                            this.tipo = res.expresion.tipo;
                            res.execute(newtable, tree)
                            var retorno = res.exp;

                            if (simboloMetodo.tipo.tipo == res.expresion.tipo.tipo) {
                                return retorno;
                            } else {
                                if (simboloMetodo.tipo.tipo == tipos.DECIMAL && (res.expresion.tipo.tipo == tipos.ENTERO)) {
                                    return retorno;
                                }
                                const error = new Excepcion('Semantico',
                                    `No se puede retornar debido a que es de un tipo diferente al declarado`,
                                    res.line, res.column);
                                tree.excepciones.push(error);
                                tree.consola.push(error.toString());
                                return error;
                            }
                        } else {
                            const error = new Excepcion('Semantico',
                                `No se puede retornar debido a que es de un tipo diferente al declarado`,
                                res.line, res.column);
                            tree.excepciones.push(error);
                            tree.consola.push(error.toString());
                            return error;
                        }
                    }
                }
            }
            if (simboloMetodo.tipo.tipo != tipos.VOID) {
                const error = new Excepcion('Semantico',
                    `Se esperaba un retorno en esta Funcion`,
                    this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        return null;
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("LLAMADA METODO");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo("(");
        if (this.listaParams.length != 0) {
            var nodo2: NodoAST = new NodoAST("Parametros");
            var index = 1;
            for (let i = 0; i < this.listaParams.length; i++) {
                var param = <Declaracion>this.listaParams[i]
                var nodo3: NodoAST = new NodoAST(param.tipo + "");
                nodo3.agregarHijo(param.id + "");
                nodo2.agregarHijo(nodo3);
            }
            nodo.agregarHijo(nodo2);
        }

        nodo.agregarHijo(")");
        nodo.agregarHijo("{");

        var nodo3: NodoAST = new NodoAST("INSTRUCCIONES");
        nodo.agregarHijo(nodo3);
        nodo.agregarHijo("}");
        return nodo;
    }
}