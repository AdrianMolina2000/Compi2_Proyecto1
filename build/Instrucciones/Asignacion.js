"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Primitivo_1 = require("../Expresiones/Primitivo");
const Aritmetica_1 = require("../Expresiones/Aritmetica");
const Pow_1 = require("../Expresiones/Pow");
const Sqrt_1 = require("../Expresiones/Sqrt");
const Seno_1 = require("../Expresiones/Seno");
const Cos_1 = require("../Expresiones/Cos");
const Tan_1 = require("../Expresiones/Tan");
function revisar(tipo1, lista) {
    for (let key in lista.valor) {
        if (lista.valor[key].tipo.tipo == 6) {
            return revisar(tipo1, lista.valor[key]);
        }
        if (tipo1 != lista.valor[key].tipo.tipo) {
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
        if (this.valor.tipo.tipo == 12) {
            let variable;
            variable = table.getVariable(this.id);
            variable.valor = result;
        }
        else {
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
            var val = result;
            try {
                let variable;
                variable = table.getVariable(this.valor.id);
                if (variable.tipo2.tipo == tipo_1.tipos.ARREGLO) {
                    let nuevoArray = new Array();
                    for (let x = 0; x < this.valor.valor.valor.length; x++) {
                        nuevoArray.push(Object.assign(Object.create(this.valor.valor.valor[x]), this.valor.valor.valor[x]));
                    }
                    let nuevoObjeto = new Primitivo_1.Primitivo(new tipo_1.Tipo(tipo_1.tipos.ARREGLO), nuevoArray, this.valor.line, this.valor.column);
                    val = nuevoObjeto;
                }
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
            this.resultado = val;
            variable.valor = val;
            return null;
        }
    }
    getNodo() {
        console.log(this.valor);
        var nodo = new NodoAST_1.NodoAST("ASIGNACION");
        nodo.agregarHijo(this.id);
        nodo.agregarHijo("=");
        if (this.valor == null) {
            nodo.agregarHijo("nulo");
            return nodo;
        }
        else {
            nodo.agregarHijo(this.valor.getNodo());
        }
        return nodo;
    }
    get3D(table, tree) {
        let c3d = '';
        let variable = table.getVariable(this.id);
        c3d += `    /*----------Asigno Variable ${variable.id}----------*/\n`;
        if (variable.tipo.tipo == tipo_1.tipos.ENTERO || variable.tipo.tipo == tipo_1.tipos.DECIMAL) {
            let resul = this.resultado;
            if (this.valor instanceof Aritmetica_1.Aritmetica
                || this.valor instanceof Pow_1.Pow
                || this.valor instanceof Sqrt_1.Sqrt
                || this.valor instanceof Tan_1.Tan
                || this.valor instanceof Cos_1.Cos
                || this.valor instanceof Seno_1.Seno) {
                c3d += this.valor.get3D(table, tree);
                resul = table.getTemporalActual();
            }
            c3d += `    stack[(int)${variable.stack}] = ${resul};\n`;
        }
        else if (variable.tipo.tipo == tipo_1.tipos.STRING) {
            let temporal = table.getTemporal();
            table.AgregarTemporal(temporal);
            c3d += `    ${temporal} = H;\n`;
            for (let i in variable.valor) {
                c3d += `    heap[(int)H] = ${variable.valor[i].charCodeAt(0)};\n`;
                c3d += `    H = H + 1;\n`;
            }
            c3d += `    heap[(int)H] = -1;\n`;
            c3d += `    H = H + 1;\n`;
            c3d += `    stack[(int)${variable.stack}] = ${temporal};\n`;
        }
        return c3d;
    }
}
exports.Asignacion = Asignacion;
