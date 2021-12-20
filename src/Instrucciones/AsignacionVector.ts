import { Nodo } from "../Abstract/Nodo";
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Simbolo } from "../Simbols/Simbolo";
import { Tipo, tipos } from "../other/tipo";
import { NodoAST } from "../Abstract/NodoAST";
import { Vector } from "../Expresiones/Vector";


export class AsignacionVector extends Nodo {
    id: String;
    posicion: Nodo;
    valor: Nodo;
    pos: any;

    constructor(id: String, posicion: Nodo, valor: Nodo, line: Number, column: Number) {
        super(null, line, column);
        this.id = id;
        this.posicion = posicion;
        this.valor = valor;
    }

    execute(table: Table, tree: Tree) {

        const result = this.valor.execute(table, tree);
        if (result instanceof Excepcion) {
            return result;
        }

        let variable: Simbolo;
        variable = table.getVariable(this.id);

        if (variable == null) {
            const error = new Excepcion('Semantico',
                `La variable {${this.id}} no ha sido encontrada`,
                this.line, this.column);
            return error;
        }

        var arreglo: Array<Nodo> = variable.valor.valor;
        this.pos = this.posicion.execute(table, tree);

        if (this.posicion.tipo.tipo == tipos.ENTERO) {
            if ((this.pos >= arreglo.length) || (this.pos < 0)) {
                const error = new Excepcion('Semantico',
                    `efe arriba   La Posicion especificada no es valida para el vector {${this.id}}`,
                    this.line, this.column);
                    tree.excepciones.push(error)
                    tree.consola.push(error.toString());
                return error;
            } else {
                if (variable.tipo.tipo != this.valor.tipo.tipo) {
                    this.valor.execute(table, tree);
                    if ((variable.tipo.tipo == tipos.DECIMAL) && (this.valor.tipo.tipo == tipos.ENTERO)) {
                        this.valor.tipo.tipo = tipos.DECIMAL;
                        arreglo[this.pos] = this.valor;
                        variable.valor.valor = arreglo;
                        return null;
                    } else {
                        const error = new Excepcion('Semantico',
                            `efeeee la posicion del vector no puede reasignarse debido a que son de diferentes tipos`,
                            this.line, this.column);
                            tree.excepciones.push(error)
                            tree.consola.push(error.toString());
                        return error;
                    }
                } else {
                     
                     let Alv = new Array<Nodo>();
                    //Ni me acordaba jjajajaja, ni cuenta me di
                     //  jaja nome que la pases alegre men jaja aunque se
                     ,/* n*eteib a decir que voy a hacer push, y que trabajaras local que ya gaste todo mi cerebro
                     
                       let dec = arreglo[this.pos];
                        let exp = this.expresion.listaParams[index];
                        let nuevoArray2 = new Array<Nodo>();
                        for(let i = 0; i < exp.valor.length; i++){
                            nuevoArray2.push(Object.assign(Object.create(exp.valor[i]), exp.valor[i]));
                        }

                        let prim = Object.assign(Object.create(exp), exp);
                        prim.valor = nuevoArray2;
                        let new_dec = new DeclaracionArray(dec.tipo, dec.id, null, dec.line, dec.column);
                        new_dec.listaValores = prim
                        nuevoArray.push(new_dec);
                      
                    arreglo[this.pos] =this.valor
                    for (let index = 0; index < arreglo.length; index++) {
                       
                        Alv.push(Object.assign(Object.create(arreglo[index]), arreglo[index]))
                    }

                    console.log(Alv)
                    variable.valor.valor = Alv
                    console.log("--------------------------------")
                    
                    return null;
                }
            }
        } else {
            const error = new Excepcion('Semantico',
                `Se esperaba un valor entero en la posicion`,
                this.line, this.column);
                tree.excepciones.push(error)
                tree.consola.push(error.toString());
            return error;
        }
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("ASIGNACION VECTOR");
        nodo.agregarHijo(this.id + "");
        nodo.agregarHijo(`[${this.pos}]`);
        nodo.agregarHijo("=");
        nodo.agregarHijo(this.valor.getNodo());
        return nodo;
    }
}