
let parser = require('../src/grammar');

   


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



const ejecutar = document.getElementById("ejecutar");

ejecutar.addEventListener('click', () => {
    

    
    console.log(entrada);
})
/* 

browserify index.js -o bundle.js
*/