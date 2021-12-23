"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const NodoAST_1 = require("../Abstract/NodoAST");
const tipo_1 = require("../other/tipo");
class Identificador extends Nodo_1.Nodo {
    constructor(id, line, column) {
        super(null, line, column);
        this.id = id;
    }
    execute(table, tree) {
        let variable;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion_1.Excepcion('Semantico', `La variable {${this.id}} no ha sido encontrada`, this.line, this.column);
            tree.excepciones.push(error);
            return error;
        }
        this.tipo = variable.tipo;
        if (variable.valor instanceof Identificador) {
            variable.valor = variable.valor.execute(table, tree);
        }
        this.valor = variable.valor;
        return this.valor;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("IDENTIFICADOR");
        var nodo2 = new NodoAST_1.NodoAST(this.id + "");
        nodo2.agregarHijo(this.valor + "");
        nodo.agregarHijo(nodo2);
        return nodo;
    }
    get3D(table, tree) {
        let c3d = '';
        let variable = table.getVariable(this.id);
        let temporal = table.getTemporal();
        table.AgregarTemporal(temporal);
        c3d += `    ${temporal} = stack[(int)${variable.stack}];\n`;
        if (variable.tipo.tipo == tipo_1.tipos.STRING) {
            let temporal2 = table.getTemporal();
            table.AgregarTemporal(temporal2);
            c3d += `    ${temporal2} = P + ${table.variablesNum};\n`;
            c3d += `    ${temporal2} = ${temporal2} + 1;\n`;
            c3d += `    stack[(int)${temporal2}] = ${temporal};\n`;
            c3d += `    P = P + ${table.variablesNum};\n`;
            c3d += `    print();\n`;
            temporal2 = table.getTemporal();
            table.AgregarTemporal(temporal2);
            c3d += `    ${temporal2} = stack[(int)P];\n`;
            c3d += `    P = P - ${table.variablesNum};\n`;
            c3d += `    printf("%c", (char)10);\n`;
        }
        return c3d;
    }
}
exports.Identificador = Identificador;
