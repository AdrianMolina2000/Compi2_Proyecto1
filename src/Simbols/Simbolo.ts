import {Tipo, tipos} from "../other/tipo";
import {Table} from "./Table";

export class Simbolo {
    tipo: Tipo;
    id: String;
    valor: Object;
    line : Number;
    column : Number;
    tipo2 : Tipo;
    ambito:Table;


    constructor(tipo: Tipo, id: String, valor: Object, tipo2: Tipo, line:Number, column:Number) {
        this.tipo = tipo;
        this.id = id;
        this.valor = valor;
        this.line = line;
        this.column = column;
        this.tipo2 = tipo2;
    }
}