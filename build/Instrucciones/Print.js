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
function imprimir2(lista, table, tree) {
    var salida = "[";
    if (lista.valor == null) {
        salida = "null";
        console.log(salida + "------");
        return salida;
    }
    for (let key in lista.valor) {
        if (lista.valor[key].valor.valor == null) {
            salida += lista.valor[key].valor + ",";
        }
        else {
            salida += lista.valor[key].valor.valor + ",";
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
                tree.consola.push(texto.substring(0, texto.length - 2) + " ");
            }
            else if (this.expresion[key].tipo.tipo == 11) {
                let texto = imprimir2(this.expresion[key], table, tree);
                if (texto == "null") {
                    tree.consola.push("null");
                }
                else {
                    tree.consola.push(texto.substring(0, texto.length - 2) + " ");
                }
            }
            else {
                if (valor.tipo) {
                    if (valor.tipo.tipo == 6) {
                        let texto = imprimir(valor, table, tree);
                        tree.consola.push(texto.substring(0, texto.length - 2) + " ");
                    }
                }
                else {
                    this.valor2 = valor;
                    tree.consola.push(valor + " ");
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
        let temporal;
        let codigo = '';
        if (this.tipo.tipo == 0 || this.tipo.tipo == 1) {
            codigo += `    /*----------Imprimo Numeros----------*/\n`;
            codigo += this.expresion[0].get3D(table, tree);
            codigo += `    printf("%f", (double)${table.getTemporalActual()});\n`;
            codigo += `    printf("%c", (char)10);\n`;
        }
        else if (this.tipo.tipo == 4) {
            codigo += `    /*----------Imprimo Strings----------*/\n`;
            table.banderastr = 1;
            if (this.expresion instanceof Identificador_1.Identificador) {
                codigo += this.expresion.get3D(table, tree);
            }
            else {
                temporal = table.getTemporal();
                table.AgregarTemporal(temporal);
                codigo += `    ${temporal} = H;\n`;
                for (let i in this.valor2) {
                    codigo += `    heap[(int)H] = ${this.valor2[i].charCodeAt(0)};\n`;
                    codigo += `    H = H + 1;\n`;
                }
                codigo += `    heap[(int)H] = -1;\n`;
                codigo += `    H = H + 1;\n`;
                let tempActual1 = table.getTemporalActual();
                temporal = table.getTemporal();
                table.AgregarTemporal(temporal);
                codigo += `    ${temporal} = P + 1;\n`;
                let tempActual2 = table.getTemporalActual();
                codigo += `    stack[(int)${tempActual2}] = ${tempActual1};\n`;
                codigo += `    print();\n`;
                temporal = table.getTemporal();
                table.AgregarTemporal(temporal);
                codigo += `    ${temporal} = stack[(int)P];\n`;
                codigo += `    printf("%c", (char)10);\n\n`;
            }
        }
        else if (this.tipo.tipo == 5) {
            codigo += `    /*----------Imprimo Booleans----------*/\n`;
            let Etiq = table.getEtiqueta();
            table.setTrue(table.etiqueta);
            Etiq = table.getEtiqueta();
            table.setFalse(table.etiqueta);
            codigo += this.expresion[0].get3D(table, tree);
            codigo += `    ${table.getTrue()}:\n`;
            codigo += `    printf("%c", (char)116);\n`;
            codigo += `    printf("%c", (char)114);\n`;
            codigo += `    printf("%c", (char)117);\n`;
            codigo += `    printf("%c", (char)101);\n`;
            Etiq = table.getEtiqueta();
            codigo += `    goto ${table.getEtiquetaActual()};\n`;
            codigo += `    ${table.getFalse()}:\n`;
            codigo += `    printf("%c", (char)102);\n`;
            codigo += `    printf("%c", (char)97);\n`;
            codigo += `    printf("%c", (char)108);\n`;
            codigo += `    printf("%c", (char)115);\n`;
            codigo += `    printf("%c", (char)101);\n`;
            codigo += `    ${table.getEtiquetaActual()}:\n`;
            codigo += `    printf("%c", (char)10);\n`;
        }
        return codigo;
    }
}
exports.Print = Print;
