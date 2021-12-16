"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
function imprimir(lista, table, tree) {
    console.log(lista);
    var salida = "[";
    for (let key in lista.valor) {
        if (lista.valor[key].tipo.tipo == 6) {
            return salida + imprimir(lista.valor[key], table, tree) + "]";
        }
        salida += lista.valor[key].execute(table, tree) + ", ";
    }
    salida = salida.substring(0, salida.length - 2);
    return salida + "]";
}
class Print extends Nodo_1.Nodo {
    constructor(expresion, line, column, tipo_print) {
        super(null, line, column);
        this.expresion = expresion;
        this.tipo_print = tipo_print;
    }
    execute(table, tree) {
        console.log(this.expresion);
        for (let key in this.expresion) {
            const valor = this.expresion[key].execute(table, tree);
            if (this.expresion[key].tipo.tipo == 6) {
                tree.consola.push(imprimir(this.expresion[key], table, tree));
            }
            else {
                if (valor.tipo) {
                    if (valor.tipo.tipo == 6) {
                        tree.consola.push(imprimir(this.expresion[key].execute(table, tree), table, tree));
                    }
                }
                else {
                    tree.consola.push(valor);
                    this.tipo = this.expresion[key].tipo;
                }
            }
        }
        /*agregando el tipo para el pritnln lo  maneje asi  fuera del for para evitar clavos papa ctm*/
        if (this.tipo_print == 1) {
        }
        else if (this.tipo_print == 2) {
            tree.consola.push("\n");
        }
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("PRINT");
        nodo.agregarHijo("print");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.expresion[0].getNodo());
        nodo.agregarHijo(")");
        return nodo;
    }
    get3D(table, tree) {
        let estructura = 'heap';
        let codigo = '';
        let condicion = this.expresion.get3D(table, tree);
        codigo += condicion;
        let temp = table.getTemporalActual();
        if (this.tipo.toString() === 'numeric' || this.tipo.toString() == 'boolean') {
            codigo += `print(%e, ${temp})\n`;
            tabla.QuitarTemporal(temp);
        }
        else {
            let temp1 = tabla.getTemporal();
            let temp2 = tabla.getTemporal();
            let temp3 = tabla.getTemporal();
            let label = tabla.getEtiqueta();
            let label2 = tabla.getEtiqueta();
            codigo += `${temp1} = ${estructura}[${temp}]\n`;
            tabla.AgregarTemporal(temp1);
            tabla.QuitarTemporal(temp);
            codigo += `${temp2} = ${temp} + 1\n`;
            tabla.AgregarTemporal(temp2);
            tabla.QuitarTemporal(temp1);
            codigo += `${temp3} = 0\n`;
            tabla.AgregarTemporal(temp3);
            codigo += `${label2}:\n`;
            codigo += `if(${temp3} >= ${temp1}) goto ${label}\n`;
            tabla.QuitarTemporal(temp3);
            tabla.QuitarTemporal(temp1);
            let temp4 = tabla.getTemporal();
            codigo += `${temp4} = ${estructura}[${temp2}]\n`;
            tabla.AgregarTemporal(temp4);
            tabla.QuitarTemporal(temp3);
            codigo += `print(%c, ${temp4})\n`;
            tabla.QuitarTemporal(temp4);
            codigo += `${temp2} = ${temp2} + 1\n`;
            tabla.AgregarTemporal(temp2);
            codigo += `${temp3} = ${temp3} + 1\n`;
            tabla.AgregarTemporal(temp3);
            codigo += `${temp4} = ${temp4} + 1\n`;
            tabla.AgregarTemporal(temp4);
            codigo += `goto ${label2}\n`;
            codigo += `${label}:\n`;
        }
        return codigo;
    }
}
exports.Print = Print;
