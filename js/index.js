
let parser = require('../grammar');

   
var entrada = document.getElementById("editor1").value;

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



const ejecutar = document.getElementById("interpretar");

ejecutar.addEventListener('click', () => {
    let entrada = editor.getValue();

    
    console.log(entrada);
})
