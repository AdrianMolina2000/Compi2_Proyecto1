"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const Excepcion_1 = require("../other/Excepcion");
const tipo_1 = require("../other/tipo");
const NodoAST_1 = require("../Abstract/NodoAST");
class Nativas_Diferentes extends Nodo_1.Nodo {
    constructor(tipo, expresion, line, column) {
        super(new tipo_1.Tipo(tipo_1.tipos.STRING), line, column);
        this.expresion = expresion;
        this.tipo = tipo;
    }
    execute(table, tree) {
        try {
            const resultado = this.expresion.execute(table, tree);
            if (resultado instanceof Excepcion_1.Excepcion) {
                console.log(resultado);
                return resultado;
            }
            else {
                if (this.tipo.tipo == tipo_1.tipos.DECIMAL) {
                    return parseFloat(resultado);
                }
                else if (this.tipo.tipo == tipo_1.tipos.ENTERO) {
                    return parseInt(resultado);
                }
                else if (this.tipo.tipo == tipo_1.tipos.BOOLEANO) {
                    switch (resultado) {
                        case true:
                        case "true":
                        case 1:
                        case "1":
                        case "on":
                        case "yes":
                            return true;
                        case false:
                        case "false":
                        case 0:
                        case "0":
                        case "no":
                            return false;
                        default:
                            return false;
                    }
                }
            }
        }
        catch (err) {
            const error = new Excepcion_1.Excepcion('Semantico', `Ha ocurrido un error al querrer convertir `, this.line, this.column);
            tree.excepciones.push(error);
            tree.consola.push(error.toString());
            return error;
        }
    }
    getNodo() {
        try {
            var nodo = new NodoAST_1.NodoAST("TOLOWER");
            nodo.agregarHijo("ToLower");
            nodo.agregarHijo("(");
            nodo.agregarHijo(this.expresion.getNodo());
            nodo.agregarHijo(")");
            return nodo;
        }
        catch (err) {
            var nodo = new NodoAST_1.NodoAST("ToLower");
            return nodo;
        }
    }
}
exports.Nativas_Diferentes = Nativas_Diferentes;
