"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const NodoAST_1 = require("../Abstract/NodoAST");
const tipo_1 = require("../other/tipo");
class Vector extends Nodo_1.Nodo {
    constructor(id, posicion, line, column) {
        super(null, line, column);
        this.id = id;
        this.posicion = posicion;
        this.bandera1 = false;
    }
    execute(table, tree) {
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `El Vector {${this.id}} no ha sido encontrada`, this.line, this.column);
            return error;
        }
        /*
        int [] a = [1,2,3,4,5];
        print(a[0]);
        */
        this.tipo = variable.tipo;
        var arreglo;
        arreglo = variable.valor.valor;
        this.pos = this.posicion.execute(table, tree);
        if (this.posicion.tipo.tipo == tipo_1.tipos.ENTERO) {
            if ((this.pos >= arreglo.length) || (this.pos < 0)) {
                const error = new Excepcion_1.Excepcion('Semantico', `La Posicion especificada no es valida para el vector {${this.id}}`, this.line, this.column);
                return error;
            }
            else {
                try {
                    this.bandera1 = true;
                    this.valor = arreglo[this.pos].execute(table, tree);
                    return this.valor;
                }
                catch (err) {
                    const error = new Excepcion_1.Excepcion('Semantico', `La Posicion especificada no es valida para el vector {${this.id}}`, this.line, this.column);
                    console.log(err);
                    return error;
                }
            }
        }
        else {
            const error = new Excepcion_1.Excepcion('Semantico', `Se esperaba un valor entero en la posicion`, this.line, this.column);
            return error;
        }
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("Vector Posicion");
        try {
            if (this.bandera1) {
                var nodo2 = new NodoAST_1.NodoAST(`${this.id}[${this.pos}]`);
                nodo2.agregarHijo(this.valor.getNodo());
                nodo.agregarHijo(nodo2);
            }
        }
        catch (err) {
        }
        return nodo;
    }
}
exports.Vector = Vector;
