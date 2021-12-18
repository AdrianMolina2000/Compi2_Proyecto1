"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Continue_1 = require("../Instrucciones/Continue");
const Break_1 = require("../Expresiones/Break");
const NodoAST_1 = require("../Abstract/NodoAST");
const Retorno_1 = require("./Retorno");
class If_unico extends Nodo_1.Nodo {
    constructor(condicion, listaIf, listaIf2, listaElse, tipos, line, column) {
        super(null, line, column);
        this.condicion = condicion;
        this.listaIf = listaIf;
        this.listaElse = listaElse;
        this.tipos = tipos;
        this.listaIf2 = listaIf2;
    }
    execute(table, tree) {
        let cont1 = 0;
        let cont2 = 0;
        const newtable = new Table_1.Table(table);
        let result;
        result = this.condicion.execute(newtable, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        if (this.condicion.tipo.tipo !== tipo_1.tipos.BOOLEANO) {
            const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba una expresion BOOLEANA para la condicion`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        if (result) {
            if (this.tipos == 1) {
                const res = this.listaIf.execute(newtable, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                    return res;
                }
            }
            else {
                for (let i = 0; i < this.listaIf2.length; i++) {
                    const res = this.listaIf2[i].execute(newtable, tree);
                    if (res instanceof Continue_1.Continue || res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                        return res;
                    }
                }
            }
        }
        else {
            const res = this.listaElse.execute(newtable, tree);
            if (res instanceof Continue_1.Continue || res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                return res;
            }
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("IF");
        nodo.agregarHijo("if");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.condicion.getNodo());
        nodo.agregarHijo(")");
        var nodo2 = new NodoAST_1.NodoAST("INSTRUCCIONES IF");
        nodo2.agregarHijo(this.listaIf.getNodo());
        nodo.agregarHijo(nodo2);
        if (this.listaElse != null) { // ELSE
            nodo.agregarHijo("else");
            var nodo3 = new NodoAST_1.NodoAST("INSTRUCCIONES ELSE");
            nodo3.agregarHijo(this.listaElse.getNodo());
            nodo.agregarHijo(nodo3);
        }
        return nodo;
    }
}
exports.If_unico = If_unico;
