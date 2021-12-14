"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
function revisar(tipo1, lista) {
    for (let key in lista.valor) {
        if (lista.valor[key].tipo.tipo == 6) {
            return revisar(tipo1, lista.valor[key]);
        }
        if (tipo1.tipo != lista.valor[key].tipo.tipo) {
            return false;
        }
    }
    return true;
}
class Asignacion extends Nodo_1.Nodo {
    constructor(id, valor, line, column) {
        super(null, line, column);
        this.id = id;
        this.valor = valor;
    }
    execute(table, tree) {
        const result = this.valor.execute(table, tree);
        var bandera = true;
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `La variable {${this.id}} no ha sido encontrada`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
        if (this.valor.tipo.tipo != variable.tipo.tipo) {
            if (variable.tipo2.tipo == 6 && this.valor.tipo.tipo == 6) {
                bandera = false;
            }
            else {
                if (variable.tipo.tipo == tipo_1.tipos.DECIMAL && (this.valor.tipo.tipo == tipo_1.tipos.DECIMAL || this.valor.tipo.tipo == tipo_1.tipos.ENTERO)) {
                    this.valor.tipo.tipo = tipo_1.tipos.DECIMAL;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `La variable no puede ser declarada debido a que son de diferentes tipos`, this.line, this.column);
                    tree.excepciones.push(error);
                    tree.consola.push(error.toString());
                    return error;
                }
            }
        }
        var val;
        try {
            let variable;
            variable = table.getVariable(this.valor.id);
            if (variable.tipo2.tipo == tipo_1.tipos.ARREGLO) {
                val = this.valor.valor;
            }
            // else if (variable.tipo2.tipo == tipos.LISTA) {
            //     val = (<any>this.valor).valor;
            // }
        }
        catch (err) {
            if (bandera) {
                val = result;
            }
            else {
                if (revisar(variable.tipo.tipo, this.valor)) {
                    val = this.valor;
                }
                else {
                    const error = new Excepcion_1.Excepcion('Semantico', `El Array no puede ser declarado debido a que son de diferentes tipos \n`, this.line, this.column);
                    return error;
                }
            }
        }
        variable.valor = val;
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ASIGNACION");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo("=");
        nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}
exports.Asignacion = Asignacion;
