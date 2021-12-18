import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Tipo, tipos } from "../other/tipo";
import { Simbolo } from "../Simbols/Simbolo";
import { NodoAST } from "../Abstract/NodoAST";
import { Declaracion } from "./Declaracion";
import { DeclaracionArray } from "./DeclaracionArray";
import { Primitivo } from "../Expresiones/Primitivo";


export class DeclaracionVarStruct extends Nodo {
    nombre_struct: String
    id: String;
    valor: Array<Nodo>;
    newTable: Table
    temp: Array<Nodo>
    expresion: Nodo

    constructor(tipo: Tipo, nombre_struct: String, id: String, expresion: Nodo, line: Number, column: Number) {
        super(tipo, line, column);
        this.id = id;
        this.nombre_struct = nombre_struct
        this.expresion = expresion
    }



    execute(table: Table, tree: Tree) {
        this.newTable = new Table(table);

        let new_struct: Simbolo;
        let struct_padre: Simbolo;


        struct_padre = table.getVariable(this.nombre_struct);
        let nuevoArray = new Array<Nodo>();

        if (this.expresion != null) {
            if (struct_padre.valor.length == this.expresion.listaParams.length) {
                for (let index = 0; index < struct_padre.valor.length; index++) {
                    if (struct_padre.valor[index] instanceof Declaracion) {
                        let dec = struct_padre.valor[index];
                        let exp = this.expresion.listaParams[index];
                        let new_dec = new Declaracion(dec.tipo, dec.id, null, dec.line, dec.column);
                        new_dec.valor = Object.assign(Object.create(exp), exp)
                        nuevoArray.push(new_dec);
                        
                    }else if(struct_padre.valor[index] instanceof DeclaracionArray){
                        let dec = struct_padre.valor[index];
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

                }
            } else {
                const error = new Excepcion('Semantico',
                    `La lista de parametros no es la necesaria para la declaracion del struct\n`,
                    this.line, this.column);
                return error;
            }
        } else {
            for (let index = 0; index < struct_padre.valor.length; index++) {
                if (struct_padre.valor[index] instanceof Declaracion) {
                    let dec = struct_padre.valor[index];
                    let new_dec = new Declaracion(dec.tipo, dec.id, null, dec.line, dec.column);
                    new_dec.valor = Object.assign(Object.create(dec.valor), dec.valor)
                    nuevoArray.push(new_dec);
                }
            }
        }

        new_struct = new Simbolo(struct_padre.tipo, this.id[0], nuevoArray, new Tipo(tipos.STRUCTS), this.line, this.column);
        new_struct.ambito = this.newTable;
        
        const res = table.setVariable(new_struct);

        return null;
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("VAR_STRUCT");
        nodo.agregarHijo(this.tipo + "");
        nodo.agregarHijo(this.id);

        if (this.valor != null) {
            nodo.agregarHijo("=");
            nodo.agregarHijo(this.valor.getNodo());
        }

        return nodo;
    }
}