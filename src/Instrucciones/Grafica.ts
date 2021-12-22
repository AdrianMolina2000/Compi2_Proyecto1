import { Nodo } from "../Abstract/Nodo";
import { NodoAST } from "../Abstract/NodoAST";
import { Table } from "../Simbols/Table";
import { Simbolo } from "../Simbols/Simbolo";
import { Tree } from "../Simbols/Tree";
let simbolos="";
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
function graph_Simbols2(tabla: Array<Simbolo>) {

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
    
    
    `

    for (let index = 0; index < tabla.length; index++) {
        var alv: Simbolo = tabla[index]
        simbolos += "<tr>"
        simbolos += `   <th><strong>   ${index} </strong></th>`;
        simbolos += `   <th><strong>   ${alv.id} </strong></th>`;
        simbolos += `   <th><strong>   ${alv.tipo} </strong></th>  `;
        simbolos += `   <th><strong>   ${alv.tipo2} </strong></th>  `;
        simbolos += `   <th><strong>   ${alv.line} </strong></th>  `;

        simbolos += `   <th><strong>   ${alv.column} </strong></th>  `;

        simbolos += `   <th><strong>   ${alv.valor} </strong></th>  `;
        simbolos += "</tr>"

    }




    simbolos += "</table>"

    let archivo =new File([simbolos],"TablaSimbolos.html");
    generar(archivo) ;






}

export class Grafica extends Nodo {
    expresion: Nodo;
    exp: Nodo;
    constructor( line: Number, column: Number) {
        super(null, line, column);
     
    }

    execute(table: Table, tree: Tree) {
       graph_Simbols2(tree.Variables)
        return null;
    }



    getNodo() {
        var nodo: NodoAST = new NodoAST("Grafica_ts");
       nodo.agregarHijo("-")

        return nodo;
    }
}