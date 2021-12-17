import { Table } from '../Simbols/Table';
import { Tree } from '../Simbols/Tree';
import { Simbolo } from '../Simbols/Simbolo';

const parser = require('../Gramatica/grammar.js');
let simbolos ="";
var editor = CodeMirror.fromTextArea(document.getElementById('editor1'), {
    mode: "javascript",
    lineNumbers: true,
    theme: "material-darker",
    smartIndent: true,
});
editor.save()

var editor2 = CodeMirror.fromTextArea(document.getElementById('editor2'), {
    mode: "javascript",
    lineNumbers: true,
    theme: "material-darker",
    smartIndent: true,
    readOnly: "nocursor"
});
editor2.save()
global.grafo =function grafo(){




    let prueba ="digraph G { a->b; }";

    d3.select("#AST").graphviz().renderDot(prueba)
  
    
    

}

global.reporte =function reporte(){


 
    
   

    document.getElementById("AST").innerHTML = simbolos;

   
  
    
    

}
function graph_Simbols(tabla:Array<Simbolo>){
    simbolos="";

    simbolos+= `  <h1 style="color: beige;">Tabla de SIMBOLOS</h1>   
    
    <table style=" color: beige;"    \">
    <thead>
      <tr>
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
         var alv:Simbolo=tabla[index]
        simbolos+="<tr>"
        simbolos+=`   <th><strong>   ${alv.id} </strong></th>`; 
        simbolos+=`   <th><strong>   ${alv.tipo} </strong></th>  `; 
        simbolos+=`   <th><strong>   ${alv.tipo2} </strong></th>  `; 
        simbolos+=`   <th><strong>   ${alv.line} </strong></th>  `;
         
        simbolos+=`   <th><strong>   ${alv.column} </strong></th>  `;
        
        simbolos+=`   <th><strong>   ${alv.valor} </strong></th>  `; 
        simbolos+="</tr>"
         
    }
     
    
    simbolos+="</table>"






}





global.Enviar = function entrada() {
    const entrada = editor.getValue();

    const tree = parser.parse(entrada);
    
    /**
     * Generacion del reporte de la tabla de simbolos
     * 
     * 
    */

  


  
  

    /**
     * Generacion del reporte de la tabla de simbolos
     * 
     * */


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
    

    graph_Simbols(tree.Variables)
}


