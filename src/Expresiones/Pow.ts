import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { tipos, Tipo } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";

export class Pow extends Nodo {
    base: Nodo;
    exponente: Nodo;
    bas: any;
    exp: any;
    constructor(base: Nodo, exponente: Nodo, line: Number, column: Number) {
        super(new Tipo(tipos.DECIMAL), line, column);
        this.base = base;
        this.exponente = exponente
    }

    execute(table: Table, tree: Tree) {

        try {

            const resultado = this.base.execute(table, tree);
            this.bas = resultado;
            const resultado2 = this.exponente.execute(table, tree);
            this.exp = resultado2;

            if (resultado instanceof Excepcion) {
                return resultado;
            } else {
                return Math.pow(resultado, resultado2);
            }
        } catch (err) {
            const error = new Excepcion('Semantico',
                `Ha ocurrido un error al ejecutar el comando pow`,
                this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }

    getNodo() {
        try {
            var nodo: NodoAST = new NodoAST("POW");
            nodo.agregarHijo("POW");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.base.getNodo());
            nodo.agregarHijo(",");
            nodo.agregarHijo(this.exponente.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        } catch (err) {
            var nodo: NodoAST = new NodoAST("ToLower");
            return nodo;
        }
    }

    get3D(table: Table, tree: Tree): String {
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

        return c3d
    }

}