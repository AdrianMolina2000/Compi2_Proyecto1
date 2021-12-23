import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Simbolo } from "../Simbols/Simbolo";
import { Excepcion } from "../other/Excepcion";
import { NodoAST } from "../Abstract/NodoAST";
import { tipos } from "../other/tipo";

export class Identificador extends Nodo {
    id: String;
    valor: any;

    constructor(id: String, line: Number, column: Number) {
        super(null, line, column);
        this.id = id;
    }

    execute(table: Table, tree: Tree) {
        let variable: Simbolo;
        variable = table.getVariable(this.id);
        if (variable == null) {
            const error = new Excepcion('Semantico',
                `La variable {${this.id}} no ha sido encontrada`,
                this.line, this.column);
            tree.excepciones.push(error);
            return error;
        }
        this.tipo = variable.tipo;

        if (variable.valor instanceof Identificador) {
            variable.valor = variable.valor.execute(table, tree)
        }
        this.valor = variable.valor;

        return this.valor;
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("IDENTIFICADOR");
        var nodo2: NodoAST = new NodoAST(this.id + "");
        nodo2.agregarHijo(this.valor + "");
        nodo.agregarHijo(nodo2);
        return nodo;
    }

    get3D(table: Table, tree: Tree): String {
        let c3d = '';
        let variable = table.getVariable(this.id)
        
        let temporal = table.getTemporal();
        table.AgregarTemporal(temporal);
        c3d += `    ${temporal} = stack[(int)${variable.stack}];\n`;
        
        if(variable.tipo.tipo == tipos.STRING){
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