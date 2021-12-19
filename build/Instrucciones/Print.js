"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
const Identificador_1 = require("../Expresiones/Identificador");
function imprimir(lista, table, tree) {
    var salida = "[";
    for (let key in lista.valor) {
        lista.valor[key].execute(table, tree);
        if (lista.valor[key].tipo.tipo == 6) {
            salida = salida + imprimir(lista.valor[key], table, tree);
        }
        else {
            if (lista.valor[key] instanceof Identificador_1.Identificador) {
                try {
                    if (lista.valor[key].valor.tipo.tipo == 6) {
                        salida = salida + imprimir(lista.valor[key].valor, table, tree);
                    }
                }
                catch (err) {
                    salida += lista.valor[key].execute(table, tree) + ", ";
                }
            }
            else {
                salida += lista.valor[key].execute(table, tree) + ", ";
            }
        }
    }
    salida = salida.substring(0, salida.length - 2) + "], ";
    return salida;
}
class Print extends Nodo_1.Nodo {
    constructor(expresion, line, column, tipo_print) {
        super(null, line, column);
        this.expresion = expresion;
        this.tipo_print = tipo_print;
    }
    execute(table, tree) {
        console.log("PRINT");
        console.log(this.expresion);
        console.log("PRINT");
        for (let key in this.expresion) {
            var valor = this.expresion[key].execute(table, tree);
            if (this.expresion[key].tipo.tipo == 6) {
                let texto = imprimir(this.expresion[key], table, tree);
                tree.consola.push(texto.substring(0, texto.length - 2));
            }
            else {
                if (valor.tipo) {
                    if (valor.tipo.tipo == 6) {
                        let texto = imprimir(valor, table, tree);
                        tree.consola.push(texto.substring(0, texto.length - 2));
                    }
                }
                else {
                    this.valor2 = valor;
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
        console.log("TIPO");
        console.log(this.tipo);
        console.log("TIPO");
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
        // let condicion = this.expresion[0].get3D(table, tree);
        // codigo += condicion;
        let temp = table.getTemporalActual();
        console.log();
        if (this.tipo.tipo == 0 || this.tipo.tipo == 1 || this.tipo.tipo == 5) {
            codigo += `printf("%f", (double)${this.valor2});\n`;
            codigo += `printf("%c", (char)10);\n\n`;
            table.QuitarTemporal(temp);
        }
        else {
            let tmp1 = table.getTemporal();
            let tmp2 = table.getTemporal();
            let tmp3 = table.getTemporal();
            let label1 = table.getEtiqueta();
            let label2 = table.getEtiqueta();
            codigo += `${tmp1} = ${estructura}[${temp}]\n`;
            table.AgregarTemporal(tmp1);
            table.QuitarTemporal(temp);
            codigo += `${tmp2} = ${temp} + 1\n`;
            table.AgregarTemporal(tmp2);
            table.QuitarTemporal(tmp1);
            codigo += `${tmp3} = 0\n`;
            table.AgregarTemporal(tmp3);
            codigo += `${label2}:\n`;
            codigo += `if(${tmp3} >= ${tmp1}) goto ${label1}\n`;
            table.QuitarTemporal(tmp3);
            table.QuitarTemporal(tmp1);
            let temp4 = table.getTemporal();
            codigo += `${temp4} = ${estructura}[${tmp2}]\n`;
            table.AgregarTemporal(temp4);
            table.QuitarTemporal(tmp3);
            codigo += `print(%c, ${temp4})\n`;
            table.QuitarTemporal(temp4);
            codigo += `${tmp2} = ${tmp2} + 1\n`;
            table.AgregarTemporal(tmp2);
            codigo += `${tmp3} = ${tmp3} + 1\n`;
            table.AgregarTemporal(tmp3);
            codigo += `${temp4} = ${temp4} + 1\n`;
            table.AgregarTemporal(temp4);
            codigo += `goto ${label2}\n`;
            codigo += `${label1}:\n`;
        }
        return codigo;
    }
}
exports.Print = Print;
