import { Table } from '../Simbols/Table';
import { ReporteGramatica } from '../Simbols/ReporteGramatica';
import { Simbolo } from '../Simbols/Simbolo';
import { getDot } from './Grafica'
import { Nodo } from '../Abstract/Nodo';
import { NodoAST } from '../Abstract/NodoAST';
const parser = require('../Gramatica/grammar.js');
let simbolos = "";
let graficas = "";
var editor = CodeMirror.fromTextArea(document.getElementById('editor1'), {
    mode: "javascript",
    lineNumbers: true,
    theme: "material-darker",
    smartIndent: true,
    indentUnit: 4,
});
editor.setSize(500, 400);
editor.save()

var editor2 = CodeMirror.fromTextArea(document.getElementById('editor2'), {
    mode: "javascript",
    lineNumbers: true,
    theme: "material-darker",
    smartIndent: true,
    indentUnit: 4,
});
editor2.setSize(500, 400);
editor2.save()
global.grafo = function grafo() {




    let prueba = "digraph G { a->b; }";

    d3.select("#AST").graphviz().renderDot(graficas)




}

global.reporte = function reporte() {






    document.getElementById("gramatical").innerHTML = simbolos;






}
global.Gramatical = function Gramatical() {



    let reporte_gramatical = `  <h1 style="color:beige;">Reporte Gramatical</h1>   
    
       <table style=" color:beige; float=left;"    \">
       <thead>
         <tr>
            <th>#</th>
         
             <th>Produccion</th>
             <th>Regla Semantica</th>
           
             
             
         </tr>
       </thead>
       
       
       `
    for (let index = 0; index < ReporteGramatica.Lista.length; index++) {
        var alv: ReporteGramatica = ReporteGramatica.Lista.length[index]
        reporte_gramatical += "<tr>"
        reporte_gramatical += `   <th><strong>   ${index} </strong></th>`;
        reporte_gramatical += `   <th><strong>   ${ReporteGramatica.Lista[index].produccion} </strong></th>`;
        reporte_gramatical += `   <th><strong>   ${ReporteGramatica.Lista[index].regla_semantica} </strong></th>  `;

        reporte_gramatical += "</tr>"

    }


    reporte_gramatical += "</table>"




    document.getElementById("gramatical").innerHTML = reporte_gramatical;






}


function graph_Simbols(tabla: Array<Simbolo>) {

    simbolos = "";

    simbolos += `  <h1 style="color: beige;">Tabla de SIMBOLOS</h1>   
    
    <table style=" color: beige;float=right;"    \">
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






}





global.Enviar = function entrada() {

    //  ReporteGramatica.Lista= null
    const entrada = editor.getValue();

    const tree = parser.parse(entrada);




    const tabla = new Table(null);

    tree.instrucciones.map((m: any) => {
        try {
            const res = m.execute(tabla, tree);
        } catch (error) {
            console.log(error)
        }
        // console.log(tree.consola);
        var texto = "";
        for (const key in tree.consola) {
            texto += tree.consola[key];
        }
        editor2.setValue(texto);
    });

    /**
    * 
    *  
    * 
    */


    /**
     * Generacion del reporte de la tabla de simbolos
     * 
     * 
    */


    graph_Simbols(tree.Variables)

    var init: NodoAST = new NodoAST("RAIZ");
    var instr: NodoAST = new NodoAST("INSTRUCCIONES");
    tree.instrucciones.map((m: Nodo) => {
        instr.agregarHijo(m.getNodo());
    });
    init.agregarHijo(instr);
    graficas = getDot(init)

    /**
     * Generacion del reporte de la tabla de simbolos
     * 
     * */

    // console.log(ReporteGramatica.Lista)
}


global.Traducir = function entrada() {

    const entrada = editor.getValue();
    const tree = parser.parse(entrada);
    const tabla = new Table(null);

    tree.instrucciones.map((m: any) => {
        try {
            const res = m.execute(tabla, tree);
        } catch (error) {
            console.log(error)
        }
    });

    var C3D = `/*------ENCABEZADO------*/
#include <stdio.h>
float heap[16384];
float stack[16394];
float P;
float H;
`;

    C3D += `float t0, t1, t2, t3, t4, t5;

`;

    C3D += `/*------Funcion Imprimir------*/
void print() {
    t1 = P+1;
    t2 = stack[(int)t1];
    L1:
        t3 = heap[(int)t2];
        if(t3 == -1) goto L0;
        printf("%c", (char)t3);
        t2 = t2+1;
        goto L1;
    L0:
        return;
}

`;

    C3D += `void main() {
P = 0; H = 0;

`;
    C3D += ``;
    
    tree.instrucciones.map((m: any) => {
        try {
            C3D += m.get3D(tabla, tree);

        } catch (error) {
            console.log(error)
        }
    });


    C3D += `return;
}`;
    editor2.setValue(C3D);


}
