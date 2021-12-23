"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Table_1 = require("../Simbols/Table");
const ReporteGramatica_1 = require("../Simbols/ReporteGramatica");
const Grafica_1 = require("./Grafica");
const NodoAST_1 = require("../Abstract/NodoAST");
const Error_1 = require("../Simbols/Error");
const DeclaracionMetodo_1 = require("../Instrucciones/DeclaracionMetodo");
const Declaracion_1 = require("../Instrucciones/Declaracion");
const DeclaracionArray_1 = require("../Instrucciones/DeclaracionArray");
const Main_1 = require("../Instrucciones/Main");
const Struct_1 = require("../Instrucciones/Struct");
const Grafica_2 = require("../Instrucciones/Grafica");
const parser = require('../Gramatica/grammar.js');
let simbolos = "";
let graficas = "";
let err = "";
var editor = CodeMirror.fromTextArea(document.getElementById('editor1'), {
    mode: "javascript",
    lineNumbers: true,
    theme: "material-darker",
    smartIndent: true,
    indentUnit: 4,
});
editor.setSize(500, 500);
editor.save();
var editor2 = CodeMirror.fromTextArea(document.getElementById('editor2'), {
    mode: "javascript",
    lineNumbers: true,
    theme: "material-darker",
    smartIndent: true,
    indentUnit: 4,
});
editor2.setSize(500, 500);
editor2.save();
global.grafo = function grafo() {
    let prueba = "digraph G { a->b; }";
    d3.select("#AST").graphviz().renderDot(graficas);
};
global.reporte = function reporte() {
    document.getElementById("gramatical").innerHTML = simbolos;
};
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
global.efe = function efe() {
    document.getElementById("gramatical").innerHTML = err;
};
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
       
       
       `;
    for (let index = 0; index < ReporteGramatica_1.ReporteGramatica.Lista.length; index++) {
        var alv = ReporteGramatica_1.ReporteGramatica.Lista.length[index];
        reporte_gramatical += "<tr>";
        reporte_gramatical += `   <th><strong>   ${index} </strong></th>`;
        reporte_gramatical += `   <th><strong>   ${ReporteGramatica_1.ReporteGramatica.Lista[index].produccion} </strong></th>`;
        reporte_gramatical += `   <th><strong>   ${ReporteGramatica_1.ReporteGramatica.Lista[index].regla_semantica} </strong></th>  `;
        reporte_gramatical += "</tr>";
    }
    reporte_gramatical += "</table>";
    document.getElementById("gramatical").innerHTML = reporte_gramatical;
};
function graph_Simbols(tabla) {
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
          <th>Stack</th> 
          
          
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
        simbolos += `   <th><strong>   ${alv.stack} </strong></th>  `;
        simbolos += "</tr>";
    }
    simbolos += "</table>";
    //  let archivo =new File([simbolos],"TablaSimbolos.html");
    //generar(archivo) ;
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
function graph_err(tabla) {
    err = "";
    err += `  <h1 style="color: beige;">Tabla de errores</h1>   
    
    <table style=" color: beige;float=right;"    \">
    <thead>
      <tr>
      <th>#</th>
       
  
          <th>Tipo</th>
          <th>Descripcion</th>
          <th>linea</th>
          <th>columna</th> 
      
          
          
      </tr>
    </thead>
    
    
    `;
    for (let index = 0; index < Error_1.Error.Errores.length; index++) {
        var alv = Error_1.Error.Errores[index];
        err += "<tr>";
        err += `   <th><strong>   ${index} </strong></th>`;
        err += `   <th><strong>   ${alv.tipo} </strong></th>`;
        err += `   <th><strong>   ${alv.descripcion} </strong></th>  `;
        err += `   <th><strong>   ${alv.line} </strong></th>  `;
        err += `   <th><strong>   ${alv.column} </strong></th>  `;
        err += "</tr>";
    }
    for (let index = 0; index < tabla.length; index++) {
        var alv = tabla[index];
        err += "<tr>";
        err += `   <th><strong>   ${index} </strong></th>`;
        err += `   <th><strong>   ${alv.tipo} </strong></th>`;
        err += `   <th><strong>   ${alv.descripcion} </strong></th>  `;
        err += `   <th><strong>   ${alv.line} </strong></th>  `;
        err += `   <th><strong>   ${alv.column} </strong></th>  `;
        err += "</tr>";
    }
    err += "</table>";
}
global.Enviar = function entrada() {
    //  ReporteGramatica.Lista= null
    const entrada = editor.getValue();
    const tree = parser.parse(entrada);
    const tabla = new Table_1.Table(null);
    tree.instrucciones.map((m) => {
        try {
            if (m instanceof DeclaracionMetodo_1.DeclaracionMetodo) {
                m.execute(tabla, tree);
            }
        }
        catch (error) {
            console.log(error);
        }
        // console.log(tree.consola);
    });
    tree.instrucciones.map((m) => {
        try {
            if (m instanceof DeclaracionArray_1.DeclaracionArray) {
                m.execute(tabla, tree);
            }
        }
        catch (error) {
            console.log(error);
        }
        // console.log(tree.consola);
    });
    tree.instrucciones.map((m) => {
        try {
            if (m instanceof Declaracion_1.Declaracion) {
                m.execute(tabla, tree);
            }
        }
        catch (error) {
            console.log(error);
        }
        // console.log(tree.consola);
    });
    tree.instrucciones.map((m) => {
        try {
            if (m instanceof Struct_1.Struct) {
                m.execute(tabla, tree);
            }
        }
        catch (error) {
            console.log(error);
        }
        // console.log(tree.consola);
    });
    tree.instrucciones.map((m) => {
        try {
            if (m instanceof Grafica_2.Grafica) {
                graph_Simbols2(tree.Variables);
            }
            //  console.log(tree);
        }
        catch (error) {
            console.log(error);
        }
    });
    tree.instrucciones.map((m) => {
        try {
            if (m instanceof Main_1.Main) {
                const res = m.execute(tabla, tree);
            }
            //  console.log(tree);
            var texto = "";
            for (const key in tree.consola) {
                texto += tree.consola[key];
            }
            editor2.setValue(texto);
        }
        catch (error) {
            console.log(error);
        }
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
    graph_Simbols(tree.Variables);
    graph_err(tree.excepciones);
    var init = new NodoAST_1.NodoAST("RAIZ");
    var instr = new NodoAST_1.NodoAST("INSTRUCCIONES");
    tree.instrucciones.map((m) => {
        instr.agregarHijo(m.getNodo());
    });
    init.agregarHijo(instr);
    graficas = Grafica_1.getDot(init);
    /**
     * Generacion del reporte de la tabla de simbolos
     *
     * */
    // console.log(ReporteGramatica.Lista)
};
global.Traducir = function entrada() {
    const entrada = editor.getValue();
    const tree = parser.parse(entrada);
    const tabla = new Table_1.Table(null);
    tree.instrucciones.map((m) => {
        try {
            const res = m.execute(tabla, tree);
        }
        catch (error) {
            console.log(error);
        }
    });
    var C3D = `/*------ENCABEZADO------*/
#include <stdio.h>
#include <math.h>

float heap[16384];
float stack[16394];
float P;
float H;\n`;
    var C3D2 = ``;
    let temp1;
    let temp2;
    let temp3;
    let tepow1;
    let tepow2;
    let tepow3;
    let tepow4;
    tree.instrucciones.map((m) => {
        try {
            C3D2 += m.get3D(tabla, tree);
        }
        catch (error) {
            console.log(error);
        }
    });
    C3D += `float `;
    if (tabla.banderastr) {
        temp1 = tabla.getTemporal();
        tabla.AgregarTemporal(temp1);
        temp2 = tabla.getTemporal();
        tabla.AgregarTemporal(temp2);
        temp3 = tabla.getTemporal();
        tabla.AgregarTemporal(temp3);
    }
    if (tabla.banderapow) {
        tepow1 = tabla.getTemporal();
        tabla.AgregarTemporal(tepow1);
        tepow2 = tabla.getTemporal();
        tabla.AgregarTemporal(tepow2);
        tepow3 = tabla.getTemporal();
        tabla.AgregarTemporal(tepow3);
        tepow4 = tabla.getTemporal();
        tabla.AgregarTemporal(tepow4);
    }
    for (let i = 0; i < tabla.tempStorage.length; i++) {
        C3D += `${tabla.tempStorage[i]}, `;
    }
    C3D = C3D.substring(0, C3D.length - 2);
    C3D += `;\n\n`;
    if (tabla.banderastr) {
        C3D += `/*------Funcion Imprimir------*/
void print() {
    ${temp1} = P+1;
    ${temp2} = stack[(int)${temp1}];
    L1:
        ${temp3} = heap[(int)${temp2}];
        if(${temp3} == -1) goto L0;
        printf("%c", (char)${temp3});
        ${temp2} = ${temp2}+1;
        goto L1;
    L0:
        return;
}\n\n`;
    }
    if (tabla.banderapow) {
        C3D += `/*------Funcion Pow------*/
void power() {
    ${tepow1} = P+1;
    ${tepow2} = stack[(int)${tepow1}];
    ${tepow3} = ${tepow2};
    ${tepow4} = ${tepow2};
    ${tepow1} = P+2;
    ${tepow2} = stack[(int)${tepow1}];
    if(${tepow2} == 0) goto L1;
    L2:
    if(${tepow2} <= 1) goto L0;
    ${tepow3} = ${tepow3}*${tepow4};
    ${tepow2} = ${tepow2}-1;
    goto L2;
    L0:
    stack[(int)P] = ${tepow3};
    goto L3;
    L1:
    stack[(int)P] = 1;
    L3:
    return;
}\n\n`;
    }
    C3D += `/*------Funcion Main------*/
 void main() {
    P = 0; H = 0;\n\n`;
    C3D += C3D2;
    C3D += `\nreturn;\n}`;
    editor2.setValue(C3D);
    //console.log("12"=="12");
};
