import { Nodo } from "../Abstract/Nodo"
import { Table } from "../Simbols/Table";
import { Tree } from "../Simbols/Tree";
import { Excepcion } from "../other/Excepcion";
import { Simbolo } from "../Simbols/Simbolo";

import { tipos } from "../other/tipo";
import { Continue } from "../Expresiones/Continue";
import { Break } from "../Expresiones/Break";
import { NodoAST } from "../Abstract/NodoAST";
import { Retorno } from "./Retorno";

export class ForIn extends Nodo {
    id: Nodo;
    cadena: Nodo;
    cadenaSalida: Array<Nodo>;
    expresion: Array<Nodo>;
    indice: Number;

    constructor(id: Nodo, cadena: Nodo, expresion: Array<Nodo>, line: Number, column: Number) {
        super(null, line, column);
        this.id = id;
        this.cadena = cadena;
        this.expresion = expresion;
        this.cadenaSalida = new Array<Nodo>();
    }

    execute(table: Table, tree: Tree) {
        const newtable = new Table(table);
        let result: Nodo;
        
        this.id.execute(newtable, tree);
        
        this.cadena.execute(table, tree);
        this.indice = this.cadena.valor.length

        let variable: Simbolo;
        variable = newtable.getVariable(this.id.id[0]);
        
        if (variable == null) {
            const error = new Excepcion('Semantico',
                `La variable {${this.id}} no ha sido encontrada`,
                this.line, this.column);
            return error;
        }


        var cadena = this.cadena.valor;
        var tipo2 = null;
        try{
            cadena.execute(table, tree);
            tipo2 = cadena.tipo.tipo
            cadena = cadena.valor;
        }catch(err){}

        if (this.cadena.tipo.tipo == 6 || tipo2 == 6) {
            for (const key in cadena) {
                this.cadenaSalida.push(cadena[key].execute(newtable, tree));
            }
        } else if (this.cadena.tipo.tipo == 4) {
            for (const key in cadena) {
                this.cadenaSalida.push(cadena[key]);
            }
        }else{
            const error = new Excepcion('Semantico',
                `No se puede utilizar un For in en este tipo de dato`,
                this.line, this.column);
            return error;
        }

        var paso = 0;
        while(paso < this.cadenaSalida.length){
            variable.valor = this.cadenaSalida[paso];
            
            for (let i = 0; i < this.expresion.length; i++) {
                const res = this.expresion[i].execute(newtable, tree);
                if (res instanceof Continue) {
                    break;
                } else if (res instanceof Break || res instanceof Retorno) {
                    return;
                }
            }
            
            paso++;
        }
        return null;
    }

    getNodo() {
        var nodo: NodoAST = new NodoAST("FOR_IN");
        nodo.agregarHijo("forIn");
      
        nodo.agregarHijo(this.id);
      
      
    
        
        nodo.agregarHijo(this.cadena.getNodo());
        nodo.agregarHijo("{");
        var nodo2: NodoAST = new NodoAST("INSTRUCCIONES");

        for (let i = 0; i < this.expresion.length; i++) {
            nodo2.agregarHijo(this.expresion[i].getNodo());
        }
        nodo.agregarHijo(nodo2);
        nodo.agregarHijo("}");
        return nodo;
    }
}