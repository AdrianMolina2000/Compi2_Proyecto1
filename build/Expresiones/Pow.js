"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Pow extends Nodo_1.Nodo {
    constructor(base, exponente, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.DECIMAL), line, column);
        this.base = base;
        this.exponente = exponente;
    }
    execute(table, tree) {
        try {
            const resultado = this.base.execute(table, tree);
            this.bas = resultado;
            const resultado2 = this.exponente.execute(table, tree);
            this.exp = resultado2;
            if (resultado instanceof Excepcion_1.Excepcion) {
                return resultado;
            }
            else {
                return Math.pow(resultado, resultado2);
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al ejecutar el comando pow`, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("POW");
            nodo.agregarHijo("POW");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.base.getNodo());
            nodo.agregarHijo(",");
            nodo.agregarHijo(this.exponente.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("ToLower");
            return nodo;
        }
    }
    get3D(table, tree) {
        let c3d = "";
        table.banderapow = 1;
        let temporal = table.getTemporal();
        table.AgregarTemporal(temporal);
        c3d += `    ${temporal} = P + ${table.variablesNum};\n`;
        c3d += `    ${temporal} = ${temporal} + 1;\n`;
        c3d += `    stack[(int)${temporal}] = ${this.bas};\n`;
        c3d += `    ${temporal} = ${temporal} + 1;\n`;
        c3d += `    stack[(int)${temporal}] = ${this.exp};\n`;
        c3d += `    P = P + ${table.variablesNum};\n`;
        c3d += `    power();\n`;
        temporal = table.getTemporal();
        table.AgregarTemporal(temporal);
        c3d += `    ${temporal} = stack[(int)P];\n`;
        c3d += `    P = P - ${table.variablesNum};\n`;
        return c3d;
    }
}
exports.Pow = Pow;
