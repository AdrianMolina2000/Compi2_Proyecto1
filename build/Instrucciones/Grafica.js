"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = require("../Abstract/Nodo");
const NodoAST_1 = require("../Abstract/NodoAST");
let simbolos = "";
function generar(archivo) {
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = URL.createObjectURL(archivo);
    link.download = archivo.name;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        archivo.parentNode.removeChild(link);
    }, 0);
}
function graph_Simbols2(tabla) {
    simbolos = "";
    simbolos += `  <h1 style="color: blue;">Tabla de SIMBOLOS</h1>   
    
    <table style=" color: blue;float=right;"    \">
    <thead>
      <tr>
      <th>#</th>
       
          <th>ID</th>
          <th>Tipo</th>
          <th>tipo</th>
          <th>linea</th>
          <th>columna</th> 
          <th>Valor</th> 
          
          
      </tr>
    </thead>
    
    
    `;
    for (let index = 0; index < tabla.length; index++) {
        var alv = tabla[index];
        simbolos += "<tr>";
        simbolos += `   <th><strong>   ${index} </strong></th>`;
        simbolos += `   <th><strong>   ${alv.id} </strong></th>`;
        simbolos += `   <th><strong>   ${alv.tipo} </strong></th>  `;
        simbolos += `   <th><strong>   ${alv.tipo2} </strong></th>  `;
        simbolos += `   <th><strong>   ${alv.line} </strong></th>  `;
        simbolos += `   <th><strong>   ${alv.column} </strong></th>  `;
        simbolos += `   <th><strong>   ${alv.valor} </strong></th>  `;
        simbolos += "</tr>";
    }
    simbolos += "</table>";
    let archivo = new File([simbolos], "TablaSimbolos.html");
    generar(archivo);
}
class Grafica extends Nodo_1.Nodo {
    constructor(line, column) {
        super(null, line, column);
    }
    execute(table, tree) {
        graph_Simbols2(tree.Variables);
        return null;
    }
    getNodo() {
        var nodo = new NodoAST_1.NodoAST("Grafica_ts");
        nodo.agregarHijo("-");
        return nodo;
    }
}
exports.Grafica = Grafica;
