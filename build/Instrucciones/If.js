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
class If extends Nodo_1.Nodo {
    constructor(condicion, listaIf, listaElse, line, column) {
        super(null, line, column);
        this.condicion = condicion;
        this.listaIf = listaIf;
        this.listaElse = listaElse;
    }
    execute(table, tree) {
        let cont1 = 0;
        let cont2 = 0;
        for (cont1 < this.listaIf.length; cont1++;) {
            console.log(cont1);
        }
        for (cont2 < this.listaElse.length; cont2++;) {
            console.log(cont2);
        }
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
            for (let i = 0; i < this.listaIf.length; i++) {
                const res = this.listaIf[i].execute(newtable, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                    return res;
                }
            }
        }
        else {
            for (let i = 0; i < this.listaElse.length; i++) {
                const res = this.listaElse[i].execute(newtable, tree);
                if (res instanceof Continue_1.Continue || res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                    return res;
                }
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
        nodo.agregarHijo("{");
        var nodo2 = new NodoAST_1.NodoAST("INSTRUCCIONES IF");
        for (let i = 0; i < this.listaIf.length; i++) {
            nodo2.agregarHijo(this.listaIf[i].getNodo());
        }
        nodo.agregarHijo(nodo2);
        nodo.agregarHijo("}");
        if (this.listaElse != null) { // ELSE
            nodo.agregarHijo("else");
            nodo.agregarHijo("{");
            var nodo3 = new NodoAST_1.NodoAST("INSTRUCCIONES ELSE");
            for (let i = 0; i < this.listaElse.length; i++) {
                nodo3.agregarHijo(this.listaElse[i].getNodo());
            }
            nodo.agregarHijo(nodo3);
            nodo.agregarHijo("}");
        }
        return nodo;
    }
    get3D(table, tree) {
        let c3d = "";
        table.bandera = 1;
        let etiqueta1 = table.getEtiqueta();
        let etiqueta2 = table.getEtiqueta();
        c3d += `    /*----------IF----------*/\n`;
        c3d += this.condicion.get3D(table, tree);
        c3d += `goto ${etiqueta1};\n`;
        c3d += `    goto ${etiqueta2};\n`;
        c3d += `    ${etiqueta1}:\n`;
        for (let i = 0; i < this.listaIf.length; i++) {
            c3d += this.listaIf[i].get3D(table, tree);
        }
        c3d += `    ${etiqueta2}:\n`;
        return c3d;
    }
}
exports.If = If;
