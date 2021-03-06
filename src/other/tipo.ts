export enum tipos {
    ENTERO,
    DECIMAL,
    NUMERO,
    CARACTER,
    STRING,
    BOOLEANO,
    ARREGLO,
    VOID, 
    METODO,
    FUNCION,
    VARIABLE,
    STRUCTS,
    NULO
}

export function esEntero(numero: number) {
    if (numero % 1 == 0) {
        return tipos.ENTERO;
    } else {
        return tipos.DECIMAL;
    }
}

export class Tipo {
    tipo: tipos;


    constructor(tipo: tipos) {
        this.tipo = tipo;
    }

    toString() {
        if (this.tipo === tipos.BOOLEANO) {
            return 'boolean';
        } else if (this.tipo === tipos.ENTERO) {
            return 'entero';
        } else if (this.tipo === tipos.DECIMAL) {
            return 'decimal';
        } else if (this.tipo === tipos.STRING) {
            return 'string';
        } else if (this.tipo === tipos.CARACTER) {
            return 'caracter';
        }else if (this.tipo === tipos.VARIABLE) {
            return 'Variable';
        }else if (this.tipo === tipos.METODO) {
            return 'Metodo';
        }else if (this.tipo === tipos.FUNCION) {
            return 'Funcion';
        }else if (this.tipo === tipos.VOID) {
            return 'Void';
        }else if (this.tipo === tipos.ARREGLO) {
            return 'Arreglo';
        }
        else if (this.tipo === tipos.STRUCTS) {
            return 'Lista';
        }
        else if (this.tipo === tipos.NULO) {
            return 'Lista';
        }
    }
}
