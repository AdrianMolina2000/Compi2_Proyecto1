"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const Simbolo_1 = require("../Simbols/Simbolo");
const Primitivo_1 = require("../Expresiones/Primitivo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Var_1 = require("../Simbols/Var");
const Aritmetica_1 = require("../Expresiones/Aritmetica");
const Pow_1 = require("../Expresiones/Pow");
const Sqrt_1 = require("../Expresiones/Sqrt");
const Seno_1 = require("../Expresiones/Seno");
const Cos_1 = require("../Expresiones/Cos");
const Tan_1 = require("../Expresiones/Tan");
function defal(tipo, line, column) {
    if (tipo.tipo == tipo_1.tipos.ENTERO) {
        return new Primitivo_1.Primitivo(tipo, 0, line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.DECIMAL) {
        return new Primitivo_1.Primitivo(tipo, 0.0, line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.BOOLEANO) {
        return new Primitivo_1.Primitivo(tipo, true, line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.CARACTER) {
        return new Primitivo_1.Primitivo(tipo, '', line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.STRING) {
        return new Primitivo_1.Primitivo(tipo, "", line, column);
    }
    else if (tipo.tipo == tipo_1.tipos.STRUCTS) {
        return new Primitivo_1.Primitivo(tipo, null, line, column);
    }
}
exports.defal = defal;
class Declaracion extends Nodo_1.Nodo {
    constructor(tipo, id, valor, line, column) {
        super(tipo, line, column);
        this.id = id;
        this.valor = valor;
    }
    execute(table, tree) {
        const result = this.valor.execute(table, tree);
        if (result instanceof Excepcion_1.Excepcion) {
            return result;
        }
        if (this.valor.tipo.tipo != this.tipo.tipo) {
            if (this.tipo.tipo == tipo_1.tipos.DECIMAL && (this.valor.tipo.tipo == tipo_1.tipos.DECIMAL || this.valor.tipo.tipo == tipo_1.tipos.ENTERO)) {
                this.valor.tipo.tipo = tipo_1.tipos.DECIMAL;
            }
            else {
                const error = new Excepcion_1.Excepcion('Semantico', `La variable no puede ser declarada debido a que son de diferentes tipos`, this.line, this.column);
                tree.excepciones.push(error);
                tree.consola.push(error.toString());
                return error;
            }
        }
        let simbolo;
        for (let key in this.id) {
            simbolo = new Simbolo_1.Simbolo(this.tipo, this.id[key], result, new tipo_1.Tipo(tipo_1.tipos.VARIABLE), this.line, this.column);
            const res = table.setVariable(simbolo);
            tree.Variables.push(simbolo);
            Var_1.Var.Lista.push(simbolo);
        }
        this.resultado = result;
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("DECLARACION");
        nodo.agregarHijo(this.tipo + "");
        nodo.agregarHijo(this.id);
        if (this.valor != null) {
            nodo.agregarHijo("=");
            nodo.agregarHijo(this.valor.getNodo());
        }
        return nodo;
    }
    get3D(table, tree) {
        let c3d = '';
        let variable;
        for (let i = 0; i < this.id.length; i++) {
            variable = table.getVariable(this.id[i]);
            c3d += `    /*----------Declaro Variable ${variable.id}----------*/\n`;
            if (variable.tipo.tipo == tipo_1.tipos.ENTERO || variable.tipo.tipo == tipo_1.tipos.DECIMAL) {
                let resul = this.resultado;
                if (this.valor instanceof Aritmetica_1.Aritmetica
                    || this.valor instanceof Pow_1.Pow
                    || this.valor instanceof Sqrt_1.Sqrt
                    || this.valor instanceof Seno_1.Seno
                    || this.valor instanceof Cos_1.Cos
                    || this.valor instanceof Tan_1.Tan) {
                    c3d += this.valor.get3D(table, tree);
                    resul = table.getTemporalActual();
                }
                c3d += `    stack[(int)${variable.stack}] = ${resul};\n`;
            }
            else if (variable.tipo.tipo == tipo_1.tipos.STRING) {
                let temporal = table.getTemporal();
                table.AgregarTemporal(temporal);
                c3d += `    ${temporal} = H;\n`;
                for (let j in variable.valor) {
                    c3d += `    heap[(int)H] = ${variable.valor[j].charCodeAt(0)};\n`;
                    c3d += `    H = H + 1;\n`;
                }
                c3d += `    heap[(int)H] = -1;\n`;
                c3d += `    H = H + 1;\n`;
                c3d += `    stack[(int)${variable.stack}] = ${temporal};\n`;
            }
        }
        return c3d;
    }
}
exports.Declaracion = Declaracion;
