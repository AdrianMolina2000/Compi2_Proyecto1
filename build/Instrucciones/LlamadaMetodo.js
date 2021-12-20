"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Continue_1 = require("../Expresiones/Continue");
const Break_1 = require("../Expresiones/Break");
const Retorno_1 = require("./Retorno");
const DeclaracionArray_1 = require("./DeclaracionArray");
class LlamadaMetodo extends Nodo_1.Nodo {
    constructor(id, listaParams, line, column) {
        super(null, line, column);
        this.id = id;
        this.listaParams = listaParams;
    }
    execute(table, tree) {
        const newtable = new Table_1.Table(table);
        var nombre = this.id + "$";
        // var nombre = this.id;
        var index = 0;
        for (let param of this.listaParams) {
            var valor = param.execute(newtable, tree);
            // nombre += <any>param.tipo;
            index += 1;
        }
        nombre += index + "";
        let simboloMetodo;
        simboloMetodo = table.getVariable(nombre);
        if (simboloMetodo == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `El metodo {${this.id}} no ha sido encontrado con esa combinacion de parametros`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        var parametros = simboloMetodo.valor[0];
        for (let i = 0; i < parametros.length; i++) {
            if (parametros[i] instanceof DeclaracionArray_1.DeclaracionArray) {
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
                var para;
                var crear;
                para = parametros[i];
                let Alv = new Array();
                crear = para;
                for (let index = 0; index < this.listaParams.length; index++) {
                    Alv.push(Object.assign(Object.create(this.listaParams[index]), this.listaParams[index]));
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
                crear.listaValores = Alv;
                crear.execute(newtable, tree);
            }
            else {
                var para;
                var crear;
                para = parametros[i];
                crear = para;
                crear.valor = this.listaParams[i];
                crear.execute(newtable, tree);
            }
        }
        var result = simboloMetodo.valor[1];
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const res = result[i].execute(newtable, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break) {
                    return res;
                }
                if (simboloMetodo.tipo.tipo == tipo_1.tipos.VOID) {
                    if (res instanceof Retorno_1.Retorno) {
                        const error = new Excepcion_1.Excepcion('Semantico', `No se esperaba un retorno en este metodo`, res.line, res.column);
                        tree.excepciones.push(error);
                        tree.consola.push(error.toString());
                        return error;
                    }
                }
                else {
                    if (res instanceof Retorno_1.Retorno) {
                        if (res.expresion != null) {
                            this.tipo = res.expresion.tipo;
                            res.execute(newtable, tree);
                            var retorno = res.exp;
                            if (simboloMetodo.tipo.tipo == res.expresion.tipo.tipo) {
                                return retorno;
                            }
                            else {
                                if (simboloMetodo.tipo.tipo == tipo_1.tipos.DECIMAL && (res.expresion.tipo.tipo == tipo_1.tipos.ENTERO)) {
                                    return retorno;
                                }
                                const error = new Excepcion_1.Excepcion('Semantico', `No se puede retornar debido a que es de un tipo diferente al declarado`, res.line, res.column);
                                tree.excepciones.push(error);
                                tree.consola.push(error.toString());
                                return error;
                            }
                        }
                        else {
                            const error = new Excepcion_1.Excepcion('Semantico', `No se puede retornar debido a que es de un tipo diferente al declarado`, res.line, res.column);
                            tree.excepciones.push(error);
                            tree.consola.push(error.toString());
                            return error;
                        }
                    }
                }
            }
            if (simboloMetodo.tipo.tipo != tipo_1.tipos.VOID) {
                const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba un retorno en esta Funcion`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("LLAMADA METODO");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo("(");
        if (this.listaParams.length != 0) {
            var nodo2 = new NodoAST_1.NodoAST("Parametros");
            var index = 1;
            for (let i = 0; i < this.listaParams.length; i++) {
                var param = this.listaParams[i];
                var nodo3 = new NodoAST_1.NodoAST(param.tipo + "");
                nodo3.agregarHijo(param.id + "");
                nodo2.agregarHijo(nodo3);
            }
            nodo.agregarHijo(nodo2);
        }
        nodo.agregarHijo(")");
        nodo.agregarHijo("{");
        var nodo3 = new NodoAST_1.NodoAST("INSTRUCCIONES");
        nodo.agregarHijo(nodo3);
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.LlamadaMetodo = LlamadaMetodo;
