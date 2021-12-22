"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Simbolo_1 = require("./Simbolo");
class Var {
    constructor(tipo, id, valor, tipo2, line, column) {
        Var.Lista.push(new Simbolo_1.Simbolo(tipo, id, valor, tipo2, line, column));
    }
}
exports.Var = Var;
Var.Lista = [];
