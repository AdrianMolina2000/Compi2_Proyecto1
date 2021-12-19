"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Table_1 = require("../Simbols/Table");
const Excepcion_1 = require("../other/Excepcion");
const Continue_1 = require("../Expresiones/Continue");
const Break_1 = require("../Expresiones/Break");
const NodoAST_1 = require("../Abstract/NodoAST");
const Retorno_1 = require("./Retorno");
class ForIn extends Nodo_1.Nodo {
    constructor(id, cadena, expresion, line, column) {
        super(null, line, column);
        this.id = id;
        this.cadena = cadena;
        this.expresion = expresion;
        this.cadenaSalida = new Array();
    }
    execute(table, tree) {
        const newtable = new Table_1.Table(table);
        let result;
        this.id.execute(newtable, tree);
        this.cadena.execute(table, tree);
        this.indice = this.cadena.valor.length;
        let variable;
        variable = newtable.getVariable(this.id.id[0]);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `La variable {${this.id}} no ha sido encontrada`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        var cadena = this.cadena.valor;
        var tipo2 = null;
        try {
            cadena.execute(table, tree);
            tipo2 = cadena.tipo.tipo;
            cadena = cadena.valor;
        }
        catch (err) { }
        if (this.cadena.tipo.tipo == 6 || tipo2 == 6) {
            for (const key in cadena) {
                this.cadenaSalida.push(cadena[key].execute(newtable, tree));
                variable.tipo = cadena[key].tipo;
            }
        }
        else if (this.cadena.tipo.tipo == 4) {
            for (const key in cadena) {
                this.cadenaSalida.push(cadena[key]);
            }
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `No se puede utilizar un For in en este tipo de dato`, this.line, this.column);
            return error;
        }
        var paso = 0;
        while (paso < this.cadenaSalida.length) {
            variable.valor = this.cadenaSalida[paso];
            for (let i = 0; i < this.expresion.length; i++) {
                const res = this.expresion[i].execute(newtable, tree);
                if (res instanceof Continue_1.Continue) {
                    break;
                }
                else if (res instanceof Break_1.Break || res instanceof Retorno_1.Retorno) {
                    return;
                }
            }
            paso++;
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("FOR_IN");
        nodo.agregarHijo("forIn");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo(this.cadena.getNodo());
        nodo.agregarHijo("{");
        var nodo2 = new NodoAST_1.NodoAST("INSTRUCCIONES");
        for (let i = 0; i < this.expresion.length; i++) {
            nodo2.agregarHijo(this.expresion[i].getNodo());
        }
        nodo.agregarHijo(nodo2);
        nodo.agregarHijo("}");
        return nodo;
    }
}
exports.ForIn = ForIn;
