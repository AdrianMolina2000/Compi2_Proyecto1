"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class AsignacionVector extends Nodo_1.Nodo {
    constructor(id, posicion, valor, line, column) {
        super(null, line, column);
        this.id = id;
        this.posicion = posicion;
        this.valor = valor;
    }
    execute(table, tree) {
        const result = this.valor.execute(table, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `La variable {${this.id}} no ha sido encontrada`, this.line, this.column);
            return error;
        }
        var arreglo = variable.valor.valor;
        this.pos = this.posicion.execute(table, tree);
        if (this.posicion.tipo.tipo == tipo_1.tipos.ENTERO) {
            if ((this.pos >= arreglo.length) || (this.pos < 0)) {
                const error = new Excepcion_1.Excepcion('Semantico', `La Posicion especificada no es valida para el vector {${this.id}}`, this.line, this.column);
                return error;
            }
            else {
                if (variable.tipo.tipo != this.valor.tipo.tipo) {
                    this.valor.execute(table, tree);
                    if ((variable.tipo.tipo == tipo_1.tipos.DECIMAL) && (this.valor.tipo.tipo == tipo_1.tipos.ENTERO)) {
                        this.valor.tipo.tipo = tipo_1.tipos.DECIMAL;
                        arreglo[this.pos] = this.valor;
                        variable.valor.valor = arreglo;
                        return null;
                    }
                    else {
                        const error = new Excepcion_1.Excepcion('Semantico', `la posicion del vector no puede reasignarse debido a que son de diferentes tipos`, this.line, this.column);
                        return error;
                    }
                }
                else {
                    arreglo[this.pos] = this.valor;
                    variable.valor.valor = arreglo;
                    return null;
                }
            }
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba un valor entero en la posicion`, this.line, this.column);
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("ASIGNACION VECTOR");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(`[${this.pos}]`);
        nodo.agregarHijo("=");
        nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}
exports.AsignacionVector = AsignacionVector;
