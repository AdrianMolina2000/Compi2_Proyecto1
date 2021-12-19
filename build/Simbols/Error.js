"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Excepcion_1 = require("../other/Excepcion");
class Error {
    constructor(tipo, descripcion, line, column) {
        Error.Errores.push(new Excepcion_1.Excepcion(tipo, descripcion, line, column));
    }
}
exports.Error = Error;
Error.Errores = [];
