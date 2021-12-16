import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Tipo } from "../other/tipo";
import { tipos } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";
import { Identificador } from "../Expresiones/Identificador";
import { Primitivo } from "../Expresiones/Primitivo";

function imprimir(lista: Nodo, table: Table, tree: Tree) {
    var salida = "[";
    for (let key in lista.valor) {
        lista.valor[key].execute(table, tree);
        if (lista.valor[key].tipo.tipo == 6) {
            salida = salida + imprimir(lista.valor[key], table, tree);
        } else {
            if (lista.valor[key] instanceof Identificador) {
                try {
                    if (lista.valor[key].valor.tipo.tipo == 6) {
                        salida = salida + imprimir(lista.valor[key].valor, table, tree);
                    }
                } catch (err) {
                    salida += lista.valor[key].execute(table, tree) + ", ";
                }
            } else {
                salida += lista.valor[key].execute(table, tree) + ", ";
            }
        }
    }
    salida = salida.substring(0, salida.length - 2) + "], ";
    return salida
}

export class Print extends Nodo {
    expresion: Array<Nodo>;
    tipo_print: Number;

    constructor(expresion: Array<Nodo>, line: Number, column: Number, tipo_print: Number) {
        super(null, line, column);
        this.expresion = expresion;
        this.tipo_print = tipo_print;
    }

    execute(table: Table, tree: Tree): any {
        console.log("PRINT");
        console.log(this.expresion)
        console.log("PRINT");
        for (let key in this.expresion) {
            var valor = this.expresion[key].execute(table, tree);

            if (this.expresion[key].tipo.tipo == 6) {
                tree.consola.push(imprimir(this.expresion[key], table, tree));
            } else {
                if (valor.tipo) {
                    if (valor.tipo.tipo == 6) {
                        let texto = imprimir(valor, table, tree)
                        tree.consola.push(texto.substring(0, texto.length - 2));
                    }
                } else {
                    tree.consola.push(valor);
                    this.tipo = this.expresion[key].tipo
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
        var nodo: NodoAST = new NodoAST("PRINT");
        nodo.agregarHijo("print");
        nodo.agregarHijo("(");
        nodo.agregarHijo(this.expresion[0].getNodo());
        nodo.agregarHijo(")");
        return nodo;
    }

    get3D(table: Table, tree: Tree): String {
        let estructura = 'heap';
        let codigo = '';


        let condicion = this.expresion.get3D(table, tree);
        codigo += condicion;

        let temp = table.getTemporalActual();

        if (this.tipo.toString() === 'numeric' || this.tipo.toString() == 'boolean') {
            codigo += `print(%e, ${temp})\n`;
            tabla.QuitarTemporal(temp);
        } else {
            let temp1 = tabla.getTemporal();
            let temp2 = tabla.getTemporal();
            let temp3 = tabla.getTemporal();
            let label = tabla.getEtiqueta();
            let label2 = tabla.getEtiqueta();
            codigo += `${temp1} = ${estructura}[${temp}]\n`
            tabla.AgregarTemporal(temp1);
            tabla.QuitarTemporal(temp);

            codigo += `${temp2} = ${temp} + 1\n`
            tabla.AgregarTemporal(temp2);
            tabla.QuitarTemporal(temp1);

            codigo += `${temp3} = 0\n`
            tabla.AgregarTemporal(temp3);

            codigo += `${label2}:\n`
            codigo += `if(${temp3} >= ${temp1}) goto ${label}\n`
            tabla.QuitarTemporal(temp3);
            tabla.QuitarTemporal(temp1);


            let temp4 = tabla.getTemporal();
            codigo += `${temp4} = ${estructura}[${temp2}]\n`
            tabla.AgregarTemporal(temp4);
            tabla.QuitarTemporal(temp3);


            codigo += `print(%c, ${temp4})\n`
            tabla.QuitarTemporal(temp4);

            codigo += `${temp2} = ${temp2} + 1\n`
            tabla.AgregarTemporal(temp2);

            codigo += `${temp3} = ${temp3} + 1\n`
            tabla.AgregarTemporal(temp3);

            codigo += `${temp4} = ${temp4} + 1\n`
            tabla.AgregarTemporal(temp4);

            codigo += `goto ${label2}\n`
            codigo += `${label}:\n`
        }
        return codigo;
    }
}