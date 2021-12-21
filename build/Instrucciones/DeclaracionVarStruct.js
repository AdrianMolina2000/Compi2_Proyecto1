"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Simbolo_1 = require("../Simbols/Simbolo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Declaracion_1 = require("./Declaracion");
const DeclaracionArray_1 = require("./DeclaracionArray");
class DeclaracionVarStruct extends Nodo_1.Nodo {
    constructor(tipo, nombre_struct, id, expresion, line, column) {
        super(tipo, line, column);
        this.id = id;
        this.nombre_struct = nombre_struct;
        this.expresion = expresion;
    }
    execute(table, tree) {
        this.newTable = new Table_1.Table(table);
        let new_struct;
        let struct_padre;
        console.log(this.nombre_struct);
        struct_padre = table.getVariable(this.nombre_struct);
        let nuevoArray = new Array();
        if (this.expresion != null) {
            if (struct_padre.valor.length == this.expresion.listaParams.length) {
                for (let index = 0; index < struct_padre.valor.length; index++) {
                    if (struct_padre.valor[index] instanceof Declaracion_1.Declaracion) {
                        let dec = struct_padre.valor[index];
                        let exp = this.expresion.listaParams[index];
                        let new_dec = new Declaracion_1.Declaracion(dec.tipo, dec.id, null, dec.line, dec.column);
                        new_dec.valor = Object.assign(Object.create(exp), exp);
                        nuevoArray.push(new_dec);
                    }
                    else if (struct_padre.valor[index] instanceof DeclaracionArray_1.DeclaracionArray) {
                        let dec = struct_padre.valor[index];
                        let exp = this.expresion.listaParams[index];
                        let nuevoArray2 = new Array();
                        for (let i = 0; i < exp.valor.length; i++) {
                            nuevoArray2.push(Object.assign(Object.create(exp.valor[i]), exp.valor[i]));
                        }
                        let prim = Object.assign(Object.create(exp), exp);
                        prim.valor = nuevoArray2;
                        let new_dec = new DeclaracionArray_1.DeclaracionArray(dec.tipo, dec.id, null, dec.line, dec.column);
                        new_dec.listaValores = prim;
                        nuevoArray.push(new_dec);
                    }
                }
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `La lista de parametros no es la necesaria para la declaracion del struct\n`, this.line, this.column);
                return error;
            }
        }
        else {
            for (let index = 0; index < struct_padre.valor.length; index++) {
                if (struct_padre.valor[index] instanceof Declaracion_1.Declaracion) {
                    let dec = struct_padre.valor[index];
                    let new_dec = new Declaracion_1.Declaracion(dec.tipo, dec.id, null, dec.line, dec.column);
                    new_dec.valor = Object.assign(Object.create(dec.valor), dec.valor);
                    nuevoArray.push(new_dec);
                }
            }
        }
        new_struct = new Simbolo_1.Simbolo(struct_padre.tipo, this.id[0], nuevoArray, new tipo_1.Tipo(tipo_1.tipos.STRUCTS), this.line, this.column);
        new_struct.ambito = this.newTable;
        const res = table.setVariable(new_struct);
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("VAR_STRUCT");
        nodo.agregarHijo(this.nombre_struct);
        nodo.agregarHijo(".");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo(this.expresion.getNodo());
        if (this.valor != null) {
            nodo.agregarHijo("=");
            nodo.agregarHijo(this.valor.getNodo());
        }
        return nodo;
    }
}
exports.DeclaracionVarStruct = DeclaracionVarStruct;
