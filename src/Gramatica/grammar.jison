%{  const {Excepcion} = require('../other/Excepcion');

    const {Error} = require('../Simbols/Error');
    const {Tree} = require('../Simbols/Tree');
    const {ReporteGramatica} = require('../Simbols/ReporteGramatica');
    const {Tipo, tipos, esEntero} = require('../other/tipo');
    const {Primitivo} = require('../Expresiones/Primitivo');
    const {Identificador} = require('../Expresiones/Identificador');
    const {Vector} = require('../Expresiones/Vector');
     //Expresion
    const {Aritmetica} = require('../Expresiones/Aritmetica');
    const {Logico} = require('../Expresiones/Logico');
    const {Relacional} = require('../Expresiones/Relacional');
    const {ToLower} = require('../Expresiones/ToLower');
    const {ToUpper} = require('../Expresiones/ToUpper');  
   
    const {Length} = require('../Expresiones/Length');   
    const {Substring} = require('../Expresiones/Substring'); 
    const {CaracterOFposition} = require('../Expresiones/CaracterOFposition'); 
    const {ToInt} = require('../Expresiones/ToInt'); 
    const {ToDouble} = require('../Expresiones/ToDouble'); 
    const {ConverString} = require('../Expresiones/ConverString');
    const {TypeOf} = require('../Expresiones/TypeOf');
    const {Log} = require('../Expresiones/Log');
    const {Seno} = require('../Expresiones/Seno');
    const {Cos} = require('../Expresiones/Cos');
    const {Tan} = require('../Expresiones/Tan');
    const {Sqrt} = require('../Expresiones/Sqrt');
    const {Pow} = require('../Expresiones/Pow');
    const {Nativas_Diferentes} = require('../Expresiones/Nativas_Diferentes');
    const {Ternario} = require('../Expresiones/Ternario');
    //Instrucciones+

    const {Print} = require('../Instrucciones/Print');
    const {If} = require('../Instrucciones/If');
    const {If_unico} = require('../Instrucciones/If_unico');
    const {Switch} = require('../Instrucciones/Switch');
    const {Case} = require('../Instrucciones/Case');
    const {Retorno} = require('../Instrucciones/Retorno');
    const {Break} = require('../Expresiones/Break'); 
    const {While} = require('../Instrucciones/While'); 
    const {DoWhile} = require('../Instrucciones/DoWhile');
    const {Declaracion, defal} = require('../Instrucciones/Declaracion');
    const {Main} = require('../Instrucciones/Main');
    const {DeclaracionArray} = require('../Instrucciones/DeclaracionArray');
    const {Asignacion_Struct} = require('../Instrucciones/Asignacion_Struct');
    const {AsignacionVector} = require('../Instrucciones/AsignacionVector');
    const {Asignacion} = require('../Instrucciones/Asignacion');
    const {InDecrement} = require('../Expresiones/InDecrement');
    const {AddLista} = require('../Instrucciones/AddLista');
    const {Pop} = require('../Instrucciones/pop');
    const {For} = require('../Instrucciones/For');
    const {ForIn} = require('../Instrucciones/ForIn');
    const {Struct} = require('../Instrucciones/Struct');
    const {DeclaracionMetodo} = require('../Instrucciones/DeclaracionMetodo');
    const {DeclaracionVarStruct} = require('../Instrucciones/DeclaracionVarStruct');
    const {Obtener_struct} = require('../Instrucciones/Obtener_struct');
    const {LlamadaMetodo} = require('../Instrucciones/LlamadaMetodo');
%}

%lex

%options case-sensitive
no  ([\"]*)

stringliteral (\"[^"]*\")


caracter (\'[^☼]\')
%%  

\s+                 {}
[ \t\r\n\f]         {}
\n                  {}                 
"/""/".*            {}
"/*"((\*+[^/*])|([^*]))*\**"*/"     {/*Ignorar comentarios con multiples lineas*/}

{caracter}            return 'caracter'
{stringliteral}       return 'cadena'

"caracterOfPosition"  return 'caracterOfPosition'
"int"                 return 'int'
"String"              return 'String'
"double"              return 'double'
"boolean"             return 'boolean'
"char"                return 'char'
"subString"           return 'subString'
"length"              return 'length'
"toUppercase"         return 'toUppercase'
"toLowercase"         return 'toLowercase'
"toInt"               return 'toInt'
"toDouble"            return 'toDouble'
"string"              return 'string'
"typeof"              return 'typeof'
"parse"               return 'parse'
"*"                   return '*'

"%"                   return '%'
"."                   return '.'
":"                   return ':'
";"                   return ';'
"?"                   return '?'

"^"                   return '^'
","                   return ','
"++"                  return 'incremento'
"--"                  return 'decremento'
"-"                   return '-'
"+"                   return '+'
"/"                   return '/'
"#"                   return '#'



"<="                  return '<='
"<"                   return '<'
">="                  return '>='
">"                   return '>'
"=="                  return '=='
"!="                  return '!='
"="                   return '='
"||"                  return '||'
"&&"                  return '&&'
"&"                  return '&'
"!"                   return '!'

"("                   return '('
")"                   return ')'  
"["                   return '['
"]"                   return ']'
"{"                   return '{'
"}"                   return '}'
"true"                return 'true'
"function"            return 'function'
"pow"                 return 'pow'
"sqrt"                return 'sqrt'
"sin"                 return 'sin'
"cos"                 return 'cos'
"tan"                 return 'tan'
"null"                return 'null'
"new"                 return 'new'
"void"                return 'void'
"main"                return 'main'
"false"               return 'false'
"print"               return 'print'
"println"             return 'println'
"printf"              return 'printf'
"if"                  return 'if'
"in"                  return 'in'
"for"                 return 'for'
"else"                return 'else'
"main"                return 'main'
"break"               return 'break'
"while"               return 'while'
"bool"                return 'bool'
"switch"              return 'switch'
"case"                return 'case'
"default"             return 'default'
"break"               return 'break'
"do"                  return 'do'
"return"              return 'return'
"pop"                 return 'pop'
"push"                return 'push'
"log10"                return 'log10'

[0-9]+("."[0-9]+)?\b  return 'numero';

"struct"                return 'struct'
([a-zA-Z])[a-zA-Z0-9_]* return 'identifier';




<<EOF>>               return 'EOF'
.                     {console.log("Error Lexico " + yytext
                        + "linea "+ yylineno
                        + "columna " +(yylloc.last_column+1));
               
               new Error(   "Error LEXICO","Token no reconocido por el lenguaje",yylineno,2);
                        }
/lex
%left 'else'
%left '||'
%left '&&' ,'&','^','#','?'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-'  '.'
%left '*' '/' '%' 'identifier' 
%right '!'
%left UMENOS

%start INICIO

%%


// INICIO : LISTA_INSTRUCCIONES EOF { $$ = new Tree($1); return $$; } ;

INICIO : INSTRUCCIONES EOF { $$ = new Tree($1); return $$; 
     new ReporteGramatica("INICIO -> INSTRUCCIONES  EOF",  "Inicio.val = INSTRUCCIONES.val"      );
      




} ;

INSTRUCCIONES
            :INSTRUCCIONES INSTRUCCION  {$$ = $1; $1.push($2);
            
               new ReporteGramatica("INSTRUCCIONES -> INSTRUCCIONES INSTRUCCION ", " INSTRUCCIONES = new Array (INSTRUCCION)              ----    INSTRUCCIONES.push(INSTRUCCION.val)"      );
         
            
            
            }
            |INSTRUCCION                {$$ =[$1];
            
                              new ReporteGramatica("INSTRUCCIONES ->  INSTRUCCIONES ", "INSTRUCCIONES.val=[INSTRUCCION.val]"      );

            }
;

INSTRUCCION  
    :TIPO 'identifier' '(' Verificar_params ')' '{' LISTA_INSTRUCCIONES '}'     {$$ = new DeclaracionMetodo($1 ,$2, $4, $7, @1.first_line, @1.first_column);
    
         new ReporteGramatica("INSTRUCCION -> TIPO identificador ( Verificar_params ) { LISTA_INSTRUCCIONES } ", 
        " INSTRUCCION.val =new Declaracion_Metodo=(TIPO.val,identificador.lexval,Verificar_params.value,LISTA_INSTRUCCIONES.value)"      );
    
    
    }


    |   TIPO  'main'  '(' Verificar_params ')' '{' LISTA_INSTRUCCIONES '}'  {$$ = new Main($1 , $7, @1.first_line, @1.first_column);}
    |DECLARACION ';'                                                            {$$ = $1;
    
         new ReporteGramatica("INSTRUCCION ->  DECLARACION ", " INSTRUCCION.val=DECLARACION.val"      );
 
    
    }
    |llamada  {
       $$ = $1;
       new ReporteGramatica("INSTRUCCION ->  llamada ", " INSTRUCCION.val=llamada.val"      );


          



    }



    |PRINT ';'

    | error {console.log("Error Sintactico "  + yytext
                           + " linea: " + this._$.first_line
                           +" columna: "+ this._$.first_column);

                           new Error(   "Error Sintactico"," no se esperaba el token  "+yytext,yylineno,2            );
                           
            
                           }
;

Verificar_params
    :PARAMETROS     {$$ = $1;
           new ReporteGramatica("Verificar_params ->  PARAMETROS ", " Verificar_params.val=PARAMETROS.val"      );

    
    
    }
    |               {$$ = [];
    
    
         new ReporteGramatica("Verificar_params ->  epsilon ", " Verificar_params.val=[]"      );
  
    
    
    
    
    }
;

PARAMETROS
    :PARAMETROS ',' OPCION_PARAMETROS   {$$ = $1; $$.push($3);
           new ReporteGramatica("PARAMETROS ->  PARAMETROS , TIPO identifier ", " PARAMETROS=new Array(Declaracion)   PARAMETROS.push (new Declaracion(PARAMETROS.val,TIPO.val,identifier.lexval))"      );

    
    }
    |OPCION_PARAMETROS               {$$ = []; $$.push($1);
         new ReporteGramatica("PARAMETROS ->  PARAMETROS , TIPO identifier ", " PARAMETROS= [new Declaracion(TIPO.val,identifier.lexval)]"      )

    
    
    } 
;
/*
  |TIPO LISTA_ID                              {  $$ = new Declaracion($1, $2, defal($1), @1.first_line, @1.first_column);
       new ReporteGramatica("DECLARACION-> TIPO LISTA_ID "
    ,"DECLARACION=new Declaracion(TIPO.val,LISTA_ID.val)");
    
    }
    |TIPO '[' ']' 'identifier' '=' EXPRESION    {$$ = new DeclaracionArray($1, $4, $6, @1.first_line, @1.first_column);
        new ReporteGramatica("DECLARACION-> TIPO [] identifier = EXPRESION "
    ,"DECLARACION=new DeclaracionArray(TIPO.val,identifier.lexval,EXPRESION.val)");
    
    }

*/
OPCION_PARAMETROS:
 TIPO 'identifier'   {$$ = new Declaracion($1, [$2], defal($1), @1.first_line, @1.first_column);}
|TIPO  '[' ']' 'identifier'   { $$ = new DeclaracionArray($1, $4, new Primitivo(new Tipo(tipos.ARREGLO), [], @1.first_line, @1.first_column), @1.first_line, @1.first_column);




}


;

LISTA_INSTRUCCIONES
    :LISTA_INSTRUCCIONES ListaIns   {$$ = $1; $1.push($2);
    
      new ReporteGramatica("LISTA_INSTRUCCIONES -> LISTA_INSTRUCCIONES ListaIns ", " LISTA_INSTRUCCIONES = new Array (Lista_Ans)              ----    LISTA_INSTRUCCIONES.push(ListaIns.val)"  )
 
    
    }
    |ListaIns                       {$$ =[$1];
    
        new ReporteGramatica("LISTA_INSTRUCCIONES -> ListaIns ", "                ----    LISTA_INSTRUCCIONES.val=[ListaIns.val)]"  )
  
    
    }
;

llamada
    :llamar ';'                          {$$ = $1;
    
    new ReporteGramatica("llamada ->  llamar ", " llamada.val=llamar.val"  );
    }
;

llamar
    :'identifier' '(' parametros_llamada ')'    {$$ = new LlamadaMetodo($1, $3, @1.first_line, @1.first_column);
    
      new ReporteGramatica("llamar ->  indetifier (parametros_llamada) ", " llamar.val=new LlmadaMetodo(identifier.lexval,parametros_llamada.val)  "  );

    
    }
    |'identifier' '(' ')'                       {$$ = new LlamadaMetodo($1, [], @1.first_line, @1.first_column);
      new ReporteGramatica("llamar ->  indetifier (parametros_llamada) ", " llamar.val=new LlmadaMetodo(identifier.lexval,parametros_llamada.val)  "  );
    
    }
;

parametros_llamada
    :parametros_llamada ',' EXPRESION   { $$ = $1; $$.push($3);


    new ReporteGramatica(" parametros_llamada-> parametros_llamada , EXPRESION   "
    ,"paremtros_llamda= new Array(EXPRESION) ----parametros_llama.push(EXPRESION)");
    
    
    
    
    }
    |EXPRESION                          { $$ = []; $$.push($1);
    new ReporteGramatica(" parametros_llamada-> EXPRESION   "
    ,"paremtros_llamda.val= parametros_llama=[EXPRESION]");
    
    
    }
;

ListaIns
    :PRINT ';'                                  {$$ = $1;

    new ReporteGramatica("Lista_Ins-> PRINT   "
    ,"Lista_Ins.val= PRINT.val");
    
    
    
    
    }    
    |DECLARACION ';'                            {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> DECLARACION   "
    ,"Lista_Ins.val= DECLARACION.val");
    
    
    }
    |ASIGNACION ';'                             {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> ASIGNACION   "
    ,"Lista_Ins.val= ASIGNACION.val");
    
    }
    |IF                                         {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> IF   "
    ,"Lista_Ins.val= IF.val");
    
    }  
    |SWITCH                                      {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> SWITCH   "
    ,"Lista_Ins.val= SWITCH.val");
    
    }  
    |'break' ';'                                {$$ = new Break(@1.first_line, @1.first_column);
    
    new ReporteGramatica("Lista_Ins-> break;   "
    ,"Lista_Ins.val= new Break(break.lexval");
    
    }
    |WHILE                                      {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> WHILE   "
    ,"Lista_Ins.val= WHILE.val");
    
    }  
    |DO ';'                                     {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> DO "
    ,"Lista_Ins.val= DO.val");
    
    }  
    |FOR          {$$ = $1;
    
    new ReporteGramatica("Lista_Ins->FOR   "
    ,"Lista_Ins.val= FOR.val"); 
    
    }
    |'identifier' 'decremento' ';'              {$$ = new InDecrement($1, "--", @1.first_line, @1.first_column);
     new ReporteGramatica("Lista_Ins->identifier decremento   "
    ,"Lista_Ins.val= new Decremento(identifier.lexval )");


    
    
    
    }
    |'identifier' 'incremento' ';'              {$$ = new InDecrement($1, "++", @1.first_line, @1.first_column);
    
      new ReporteGramatica("Lista_Ins->identifier incremento   "
    ,"Lista_Ins.val= new Decremento(identifier.lexval )");
    
    
    }
    | RETURN ';'                                {$$ = $1;
    
    
    new ReporteGramatica("Lista_Ins->RETURN   "
    ,"Lista_Ins.val= RETURN.val"); 
    
    
    }  
    |'identifier' '.' 'pop' '(' ')'             {$$ = new Pop($1, @1.first_line, @1.first_column);
    
    new ReporteGramatica("Lista_Ins->identifier .pop   "
    ,"Lista_Ins.val= new Pop(identifier.lexval )");
    
    } 
    |'identifier' '.' 'push' '(' EXPRESION ')'  {$$ = new AddLista($1, $5, @1.first_line, @1.first_column);
    
    new ReporteGramatica("Lista_Ins->identifier .push   "
    ,"Lista_Ins.val= new Push(identifier.lexval )");
    
    
    } 
    |STRUCT ';'                                   {$$ = $1;
      
    new ReporteGramatica("Lista_Ins->STRUCT   "
    ,"Lista_Ins.val= STRUCT.val"); 
    
    }  
    |'continue' ';'                             {$$ = new Continue(@1.first_line, @1.first_column);
    
        new ReporteGramatica("Lista_Ins->continue   "
    ,"Lista_Ins.val= new continue( )");
    
    }
    |llamada                                    {$$ = $1
        new ReporteGramatica("Lista_Ins->llamada  "
    ,"Lista_Ins.val=llamada.val");
    
    
    }
    | error {console.log("Error Sintactico "  + yytext
                           + " linea: " + this._$.first_line
                           +" columna: "+ this._$.first_column);
                  new Error(   "Error Sintactico"," no se esperaba el token  "+yytext,yylineno,2       );
                           }


;

ListaIns2
    :PRINT ';'                                  {$$ = $1;

    new ReporteGramatica("Lista_Ins-> PRINT   "
    ,"Lista_Ins.val= PRINT.val");
    
    
    
    
    }    
    |DECLARACION ';'                            {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> DECLARACION   "
    ,"Lista_Ins.val= DECLARACION.val");
    
    
    }
    |ASIGNACION ';'                             {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> ASIGNACION   "
    ,"Lista_Ins.val= ASIGNACION.val");
    
    }
  
    |SWITCH                                      {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> SWITCH   "
    ,"Lista_Ins.val= SWITCH.val");
    
    }  
    |'break' ';'                                {$$ = new Break(@1.first_line, @1.first_column);
    
    new ReporteGramatica("Lista_Ins-> break;   "
    ,"Lista_Ins.val= new Break(break.lexval");
    
    }
    |WHILE                                      {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> WHILE   "
    ,"Lista_Ins.val= WHILE.val");
    
    }  
    |DO ';'                                     {$$ = $1;
    
    new ReporteGramatica("Lista_Ins-> DO "
    ,"Lista_Ins.val= DO.val");
    
    }  
    |FOR          {$$ = $1;
    
    new ReporteGramatica("Lista_Ins->FOR   "
    ,"Lista_Ins.val= FOR.val"); 
    
    }
    |'identifier' 'decremento' ';'              {$$ = new InDecrement($1, "--", @1.first_line, @1.first_column);
     new ReporteGramatica("Lista_Ins->identifier decremento   "
    ,"Lista_Ins.val= new Decremento(identifier.lexval )");


    
    
    
    }
    |'identifier' 'incremento' ';'              {$$ = new InDecrement($1, "++", @1.first_line, @1.first_column);
    
      new ReporteGramatica("Lista_Ins->identifier incremento"
    ,"Lista_Ins.val= new Decremento(identifier.lexval )");
    
    
    }
    | RETURN ';'                                {$$ = $1;
    
    
    new ReporteGramatica("Lista_Ins->RETURN   "
    ,"Lista_Ins.val= RETURN.val"); 
    
    
    }  
    |'identifier' '.' 'pop' '(' ')'             {$$ = new Pop($1, @1.first_line, @1.first_column);
    
    new ReporteGramatica("Lista_Ins->identifier .pop   "
    ,"Lista_Ins.val= new Pop(identifier.lexval )");
    
    } 
    |'identifier' '.' 'push' '(' EXPRESION ')'  {$$ = new AddLista($1, $5, @1.first_line, @1.first_column);
    
    new ReporteGramatica("Lista_Ins->identifier .push   "
    ,"Lista_Ins.val= new Push(identifier.lexval )");
    
    
    } 
    |STRUCT ';'                                   { $$ = $1;
      
    new ReporteGramatica("Lista_Ins->STRUCT   "
    ,"Lista_Ins.val= STRUCT.val"); 
    
    }  
    |'continue' ';'                             {$$ = new Continue(@1.first_line, @1.first_column);
    
        new ReporteGramatica("Lista_Ins->continue   "
        ,"Lista_Ins.val= new continue( )");
    
    }
    |llamada                                    {$$ = $1;
        new ReporteGramatica("Lista_Ins->llamada  "
       ,"Lista_Ins.val=llamada.val");
    
    
    }
         | error {console.log("Error Sintactico "  + yytext
                           + " linea: " + this._$.first_line
                           +" columna: "+ this._$.first_column);
                     new Error(   "Error Sintactico"," no se esperaba el token  "+yytext,yylineno,2       );
                           }


;


PRINT
    :'print' '(' LISTA_EXPRESION ')'    {$$ = new Print($3, @1.first_line, @1.first_column,1); 
    
       new ReporteGramatica("PRINT->print(LISTA_EXPRESION)  "
    ,"PRINT.val=LISTA_EXPRESION.val");
    
    
    }
    |'println' '(' LISTA_EXPRESION ')'  {$$ = new Print($3, @1.first_line, @1.first_column,2);
    
      new ReporteGramatica("PRINT->println(LISTA_EXPRESION)  "
    ,"PRINT.val=LISTA_EXPRESION.val");
    


     }
    |'printf' '(' LISTA_EXPRESION ')'
;

LISTA_EXPRESION
    :LISTA_EXPRESION ',' EXPRESION      { $$ = $1; $1.push($3);
    
        new ReporteGramatica("LISTA_EXPRESION->LISTA_EXPRESION,EXPRESION "
    ,"LISTA_EXPRESION = new Array(EXPRESION) ------- LISTA_EXPRESION.push(EXPRESION)");
    
    
    }
    |EXPRESION                          { $$ = []; $$.push($1);
    
          new ReporteGramatica("LISTA_EXPRESION->EXPRESION "
    ,"LISTA_EXPRESION = new Array(EXPRESION) ------- LISTA_EXPRESION.push(EXPRESION)");
    
    }
;


DECLARACION
    :TIPO 'identifier' '=' EXPRESION            {  $$ = new Declaracion($1, [$2], $4, @1.first_line, @1.first_column);
    
      new ReporteGramatica("DECLARACION-> TIPO identifier = EXPRESION "
    ,"DECLARACION=new Declaracion(TIPO.val,identifier.lexval,EXPRESION.val)");
    
    }
    |TIPO LISTA_ID                              {  $$ = new Declaracion($1, $2, defal($1), @1.first_line, @1.first_column);
       new ReporteGramatica("DECLARACION-> TIPO LISTA_ID "
    ,"DECLARACION=new Declaracion(TIPO.val,LISTA_ID.val)");
    
    }
    |TIPO '[' ']' 'identifier' '=' EXPRESION    {$$ = new DeclaracionArray($1, $4, $6, @1.first_line, @1.first_column);
        new ReporteGramatica("DECLARACION-> TIPO [] identifier = EXPRESION "
    ,"DECLARACION=new DeclaracionArray(TIPO.val,identifier.lexval,EXPRESION.val)");
    
    }
    |TIPO '[' ']' 'identifier'                  {   $$ = new DeclaracionArray($1, $4, new Primitivo(new Tipo(tipos.ARREGLO), [], @1.first_line, @1.first_column), @1.first_line, @1.first_column);
    
    new ReporteGramatica("DECLARACION-> TIPO []  identifier "
    "DECLARACION=new DeclaracionArray(TIPO.val,LISTA_ID.val)");
    
    
    }
    |'identifier' 'identifier' '=' llamar       {   $$ = new DeclaracionVarStruct(new Tipo(tipos.STRUCTS),$1, [$2], $4, @1.first_line, @1.first_column);
    
    
    new ReporteGramatica("DECLARACION-> identifier  identifier = llamar"
   ,"DECLARACION=new DeclaracionVarStruct(TIPO.val,identifier.lexval,identifier.lexval)");
    
    }
;

LISTA_ID
    :LISTA_ID ',' 'identifier'      {   $$ = $1; $1.push($3);
    
    
    new ReporteGramatica("LISTA_ID->LISTA_ID , identifier"
,"LISTA_ID=new Array(identifier) ----LISTA_ID.push(identifier.lexval)");
    
    }
    
    
    |'identifier'                   {  $$ = []; $$.push($1);
    
    new ReporteGramatica("LISTA_ID->identifier"
   ,"LISTA_ID=[identifier.lexval]");
    
    }
;

ASIGNACION
    
    :'identifier' '=' EXPRESION     {   $$ = new Asignacion($1, $3, @1.first_line, @1.first_column);
        
    new ReporteGramatica("ASIGNACION->identifier =EXPRESION"
    ,"ASIGNACION=new Asignacion(identifier.lexval,EXPRESION.val)");
    
    
    
    
    }
    |'identifier' '.' LISTA_EXPRESION_PTO '=' EXPRESION  {  $$ = new Asignacion_Struct($1, $3,$5, @1.first_line, @1.first_column);
    new ReporteGramatica("ASIGNACION->identifier . LISTA_EXPRESION_PTO=EXPRESION"
    ,"ASIGNACION=new Asignacion_Struct(identifier.lexval,LISTA_EXPRESION_PTO,EXPRESION.val)");
    
    
    
    
    }
    |'identifier' '[' EXPRESION ']' '=' EXPRESION   {  $$ = new AsignacionVector($1, $3, $6, @1.first_line, @1.first_column);
    
    new ReporteGramatica("ASIGNACION->identifier . [EXPRESION]=EXPRESION"
    ,"ASIGNACION=new AsignacionVector(identifier.lexval,EXPRESION.val,EXPRESION.val)");
    
    
    
    
    } 
;



  LISTA_EXPRESION_PTO:
  LISTA_EXPRESION_PTO OPCION_PTO    { $$ = $1; $1.push($2);
  
  
                new ReporteGramatica("LISTA_EXPRESION_PTO->LISTA_EXPRESION_PTO OPCION_PTO"
          ,"LISTA_EXPRESION_PTO=new Array(OPCION_PTO) ----LISTA_EXPRESION_PTO.push(OPCION_PTO.val)");
    
  
  
  }
    | OPCION_PTO                    { $$ = []; $$.push($1);
    new ReporteGramatica("LISTA_EXPRESION_PTO-> OPCION_PTO"
     ,"LISTA_EXPRESION_PTO.val=[OPCION_PTO.val]");
    
    }
  
  ;  
  OPCION_PTO
  :'.' 'identifier'                 { $$ =$2;
    new ReporteGramatica("OPCION_PTO-> . identifier"
    ,"OPCION_PTO.val=identifier.lexval");
  
  
  }
  |'identifier'                     {$$ =$1;
  
   new ReporteGramatica("OPCION_PTO->  identifier"
    ,"OPCION_PTO.val=identifier.lexval");
  
  }
  |'identifier' '[' EXPRESION']'    {$$ =$1;
  
  
     new ReporteGramatica("OPCION_PTO->  identifier [EXPRESION]"
    ,"OPCION_PTO.val=identifier.lexval+EXPRESION.val");
  
  }

  
  
  
  ;

PARAMETROS_LLAMADA
    :PARAMETROS_LLAMADA ',' EXPRESION       { $$ = $1; $1.push($2);
      
   new ReporteGramatica("PARAMETROS_LLAMADA->PARAMETROS_LLAMADA , EXPRESION"
    ,"PARAMETROS_LLAMADA=new Array(EXPRESION) ----PARAMETROS_LLAMADA.push(EXPRESION.val)");
    
    
    
    } 
    |EXPRESION                              { $$ = []; $$.push($1);
    
    new ReporteGramatica("PARAMETROS_LLAMADA-> EXPRESION"
   ,"PARAMETROS_LLAMADA=[EXPRESION.val]");
    
    
    
    };

IF
    :'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}'                                     {$$ = new If($3, $6, [], @1.first_line, @1.first_column);
    new ReporteGramatica("IF->  (EXPRESION){LISTA_INSTRUCCIONES}"
   ,"IF.val=new IF(EXPRESION.val,LISTA_INSTRUCCIONES.val)");
    
    
    
    }
    |'if' '(' EXPRESION ')' ListaIns2                                                       {$$ = new If_unico($3, $5,[], null,1, @1.first_line, @1.first_column);
    
        new ReporteGramatica("IF->  (EXPRESION) ListaIns"
   ,"IF.val=new IF(EXPRESION.val,ListaIns.val)");
    
    }
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' '{' LISTA_INSTRUCCIONES '}'  {$$ = new If($3, $6, $10, @1.first_line, @1.first_column);
        new ReporteGramatica("IF->  (EXPRESION){LISTA_INSTRUCCIONES} else {LISTA_INSTRUCCIONES}"
   ,"IF.val=new IF(EXPRESION.val,LISTA_INSTRUCCIONES.val)");
    
    
    }
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' IF                           {$$ = new If($3, $6, [$9], @1.first_line, @1.first_column);
    
      new ReporteGramatica("IF->  (EXPRESION){LISTA_INSTRUCCIONES} else IF"
   ,"IF.val=new IF(EXPRESION.val,LISTA_INSTRUCCIONES.val,IF.val)");
    
    
    }
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' ListaIns2                    {$$ = new If_unico($3,null, $6, $9,2, @1.first_line, @1.first_column);
        new ReporteGramatica("IF->  (EXPRESION){LISTA_INSTRUCCIONES} else ListaIns2"
   ,"IF.val=new IF(EXPRESION.val,LISTA_INSTRUCCIONES.val,ListaIns2.val)");
    }
    |'if' '(' EXPRESION ')' ListaIns2 'else' ListaIns2                                      {$$ = new If_unico($3,$5,[],$7,1,@1.first_line, @1.first_column);
         new ReporteGramatica("IF->  (EXPRESION)ListaIns2 else ListaIns2"
   ,"IF.val=new IF(EXPRESION.val,ListaIns2.val,ListaIns2.val)");
    
    
    }
;

SWITCH  
    :'switch' '(' EXPRESION ')' '{' CASE_LIST DEFAULT_LIST '}'      {$$ = new Switch($3, $6, $7, @1.first_line, @1.first_column);
    
         new ReporteGramatica("SWITCH-> switch (EXPRESION){  CASE_LIST DEFAULT_LIST}"
   ,"SWITCH.val=new SWITCH(EXPRESION.val,CASE_LIST.val,DEFAULT_LIST.val)");
    
    
    
    }
    |'switch' '(' EXPRESION ')' '{' CASE_LIST '}'                   {$$ = new Switch($3, $6, null, @1.first_line, @1.first_column);
        new ReporteGramatica("SWITCH-> switch (EXPRESION){  CASE_LIST }"
   ,"SWITCH.val=new SWITCH(EXPRESION.val,CASE_LIST.val)");
    
    }
    |'switch' '(' EXPRESION ')' '{' DEFAULT_LIST '}'                {$$ = new Switch($3, null, $6, @1.first_line, @1.first_column);
        new ReporteGramatica("SWITCH-> switch (EXPRESION){   DEFAULT_LIST}"
   ,"SWITCH.val=new SWITCH(EXPRESION.val,DEFAULT_LIST.val)");
    }
;

CASE_LIST
    :CASE_LIST 'case' EXPRESION ':' LISTA_INSTRUCCIONES             {$$ = $1; $$.push(new Case($3, $5, @1.first_line, @1.first_column));
    
    
        new ReporteGramatica("CASE_LIST-> CASE_LIST case  EXPRESION :  LISTA_INSTRUCCIONES"
   ,"CASE_LIST =new Array(case)---------------------- CASE_LIST.push (new case(EXPRESION.val,LISTA_INSTRUCCIONES.val))");
    }
    
    }
    |'case' EXPRESION ':' LISTA_INSTRUCCIONES                       {$$ = []; $$.push(new Case($2, $4, @1.first_line, @1.first_column));
    
    
        new ReporteGramatica("CASE_LIST->  case  EXPRESION :  LISTA_INSTRUCCIONES"
   ,"---------------------- CASE_LIST= [new case (EXPRESION.val,LISTA_INSTRUCCIONES.val)]");
    
    }
;

DEFAULT_LIST
    :'default' ':' LISTA_INSTRUCCIONES      {$$ = $3
    
    
        new ReporteGramatica("DEFAULT_LIST-> default :  LISTA_INSTRUCCIONES"
   ,"DEFAULT_LIST.val=LISTA_INSTRUCCIONES.val");
    }
;

WHILE
    :'while' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}'          {$$ = new While($3, $6, @1.first_line, @1.first_column);
    
        new ReporteGramatica("WHILE-> while ( EXPRESION )  {LISTA_INSTRUCCIONES}"
   ,"While.val=new While(EXPRESION.val,LISTA_INSTRUCCIONES.val)");
    }
    
    
;

DO
    :'do' '{'  LISTA_INSTRUCCIONES '}' 'while' '(' EXPRESION ')'    {$$ = new DoWhile($7, $3, @1.first_line, @1.first_column);
    
        new ReporteGramatica("DO->do {  LISTA_INSTRUCCIONES } while ( EXPRESION )  "
   ,"DO.val=new DoWhile(LISTA_INSTRUCCIONES.val ,EXPRESION.val)");
    
    
    
    
    }
;

FOR
    :'for' forIn 'in' EXPRESION '{' LISTA_INSTRUCCIONES '}'                             {$$ = new ForIn($2, $4, $6, @1.first_line, @1.first_column);
    
          new ReporteGramatica("FOR->for forIn in EXPRESIONES { LISTA_INSTRUCCIONES }  "
   ,"FOR.val=new ForIn(forIn.val ,EXPRESION.val,LISTA_INSTRUCCIONES.val)");
    
    
    }
    |'for' '(' forVar ';' EXPRESION ';' for_increment ')' '{' LISTA_INSTRUCCIONES '}'   {$$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column);
    
          new ReporteGramatica("FOR->for (forVar ; EXPRESION;for_increment)  { LISTA_INSTRUCCIONES }  "
   ,"FOR.val=new For(forVar.val,EXPRESION.val,for_increment.val,LISTA_INSTRUCCIONES.val ");
    
    
    
    }
;

forIn
    :'identifier'                       {$$ = new Declaracion(new Tipo(tipos.STRING), [$1], defal(new Tipo(tipos.STRING)), @1.first_line, @1.first_column);
              new ReporteGramatica("forIn->identifier "
   ,"forIn.val=identifier.lexval ");
    
    }
;


forVar
    :TIPO 'identifier' '=' EXPRESION    {$$ = new Declaracion($1, [$2], $4, @1.first_line, @1.first_column);
    
             new ReporteGramatica("forVar->TIPO identifier = EXPRESION "
   ,"forVar.val= new Declaracion(TIPO.val,identifier.lexval,EXPRESION.val ");
    
    }
    |'identifier' '=' EXPRESION         {$$ = new Asignacion($1, $3, @1.first_line, @1.first_column);
    
            new ReporteGramatica("forVar-> identifier = EXPRESION "
   ,"forVar.val= new Asiganacion(identifier.lexval,EXPRESION.val ");
    
    }
;

for_increment
    :'identifier' 'incremento' 	        {$$ = new InDecrement($1, "++", @1.first_line, @1.first_column);
    
    
            new ReporteGramatica("for_increment-> identifier incremento "
   ,"forVar.val= new InDecrement(identifier.lexval,incremento.lexval) ");
    
    }   					    
	|'identifier' 'decremento'          {$$ = new InDecrement($1, "--", @1.first_line, @1.first_column);
    
    
            new ReporteGramatica("for_increment-> identifier decremento "
   ,"forVar.val= new InDecrement(identifier.lexval,decremento.lexval) ");
    
    }
    |'identifier' '=' EXPRESION         {$$ = new Asignacion($1, $3, @1.first_line, @1.first_column);
    
    
            new ReporteGramatica("for_increment-> identifier =EXPRESION "
   ,"forVar.val= new Asignacion(identifier.lexval,EXPRESION.val) ");
    }        	 
;

RETURN 
    :'return' EXPRESION         {$$ = new Retorno($2, @1.first_line, @1.first_column);
    
          new ReporteGramatica("RETURN-> return EXPRESION "
   ,"RETURN.val= new Retorno(EXPRESION.val) ");
    }   
    
    }
    |'return'                   {$$ = new Retorno(null, @1.first_line, @1.first_column);
    
       new ReporteGramatica("RETURN-> return EXPRESION "
   ,"RETURN.val= new Retorno(null) ");
    
    }
;

STRUCT
    :'struct' 'identifier' '{' Lista_declaracion '}'   {$$ = new Struct($2,$4, @1.first_line, @1.first_column);
    
      new ReporteGramatica("STRUCT-> struct identifier {Lista_declaracion} "
   ,"STRUCT.val= new Struct(identifier.lexval, Lista_declaracion.val) ");
    
    } 
;

Lista_declaracion
                :Lista_declaracion ',' OPCION_DECLARACIO_Struct      {$$ = $1; $1.push($3);
                  new ReporteGramatica("Lista_declaracion-> Lista_declaracion , OPCION_DECLARACIO_Struct "
                  ,"Lista_declaracion.val= new Array (OPCION_DECLARACIO_Struct)------Lista_declaracion.push(OPCION_DECLARACIO_Struct.val ) ");
                
                
                }
                |OPCION_DECLARACIO_Struct                           {$$ = []; $$.push($1);
                
                    new ReporteGramatica("Lista_declaracion->   OPCION_DECLARACIO_Struct "
                  ,"Lista_declaracion.val= [OPCION_DECLARACIO_Struct.val ] ");
                
                
                }
;

OPCION_DECLARACIO_Struct
                        :TIPO 'identifier'              {$$ = new Declaracion($1, [$2], defal($1), @1.first_line, @1.first_column);
                     new ReporteGramatica("OPCION_DECLARACIO_Struct->   TIPO identifier "
                  ,"OPCION_DECLARACIO_Struct.val= new Declaracion( TIPO.val,identifier.lexval  ) ");
                         
                        }
                        |'identifier'  'identifier'     {$$ = new DeclaracionVarStruct(new Tipo(tipos.STRUCTS),$1, $2, null, @1.first_line, @1.first_column);
                        
                             new ReporteGramatica("OPCION_DECLARACIO_Struct->   identifier identifier "
                  ,"OPCION_DECLARACIO_Struct.val= new  DeclaracionVarStruct( identifier.lexval ,identifier.lexval  ) ");
                        
                        }
                        | TIPO  '[' ']' 'identifier'    {$$ = new DeclaracionArray($1, $4, new Primitivo(new Tipo(tipos.ARREGLO), [], @1.first_line, @1.first_column), @1.first_line, @1.first_column);
                        
                         new ReporteGramatica("OPCION_DECLARACIO_Struct->   TIPO [] identifier "
                  ,"OPCION_DECLARACIO_Struct.val= new  DeclaracionArray( TIPO.val ,identifier.lexval  ) ");
                        
                        
                        }
;

EXPRESION 
        //Aritmeticas
        :'-' EXPRESION %prec UMENOS     {$$ = new Aritmetica(null, $2, '-', @1.first_line, @1.first_column);
           new ReporteGramatica("EXPRESION->  - EXPRESION  "
                  ,"EXPRESION.val= new  Aritmetica( EXPRESION.val  ) ");
        
        }	    
        |EXPRESION '+' EXPRESION        {$$ = new Aritmetica($1, $3, '+', @1.first_line, @1.first_column);
        new ReporteGramatica("EXPRESION->   EXPRESION +EXPRESION  "
                  ,"EXPRESION.val= new  Aritmetica( EXPRESION.val ,+,  EXPRESION.val ) ");
        
        }	
        |EXPRESION '-' EXPRESION        {$$ = new Aritmetica($1, $3, '-', @1.first_line, @1.first_column);
        
          new ReporteGramatica("EXPRESION->   EXPRESION  - EXPRESION  "
                  ,"EXPRESION.val= new  Aritmetica( EXPRESION.val, -,  EXPRESION.val ) ");
        }
        |EXPRESION '*' EXPRESION        {$$ = new Aritmetica($1, $3, '*', @1.first_line, @1.first_column);
               
          new ReporteGramatica("EXPRESION->   EXPRESION  * EXPRESION  "
                  ,"EXPRESION.val= new  Aritmetica( EXPRESION.val *  EXPRESION.val ) ")
        
        }	
        |EXPRESION '/' EXPRESION        {$$ = new Aritmetica($1, $3, '/', @1.first_line, @1.first_column);
         new ReporteGramatica("EXPRESION->   EXPRESION  ,/, EXPRESION  "
                  ,"EXPRESION.val= new  Aritmetica( EXPRESION.val ,/,  EXPRESION.val ) ")
        
        }	
        |EXPRESION '%' EXPRESION        {$$ = new Aritmetica($1, $3, '%', @1.first_line, @1.first_column);
        
                 new ReporteGramatica("EXPRESION->   EXPRESION  % EXPRESION  "
                  ,"EXPRESION.val= new  Aritmetica( EXPRESION.val ,% , EXPRESION.val ) ")
        
        }	
        
         
        //Nativas Aritmeticas
        |'sin'  '(' EXPRESION ')'                   {$$ = new Seno($3, @1.first_line, @1.first_column);
        
         new ReporteGramatica("EXPRESION->   sin(EXPRESION)  "
                  ,"EXPRESION.val= new  Seno(EXPRESION.val) ")
        
        
        }
        |'cos' '(' EXPRESION ')'                    {$$ = new Cos($3, @1.first_line, @1.first_column);
          new ReporteGramatica("EXPRESION->   cos(EXPRESION)  "
                  ,"EXPRESION.val= new  Cos(EXPRESION.val) ")
        
        
        }
        |'tan' '(' EXPRESION ')'                    {$$ = new Tan($3, @1.first_line, @1.first_column);
         new ReporteGramatica("EXPRESION->   tan(EXPRESION)  "
                  ,"EXPRESION.val= new  Tan(EXPRESION.val) ")
        }
        |'pow' '(' EXPRESION ',' 'EXPRESION' ')'    {$$ = new Pow($3,$5, @1.first_line, @1.first_column);
         new ReporteGramatica("EXPRESION->   pow(EXPRESION)  "
                  ,"EXPRESION.val= new  Pow(EXPRESION.val) ")
        
        }
        |'sqrt' '(' EXPRESION ')'                   {$$ = new Sqrt($3, @1.first_line, @1.first_column);
         new ReporteGramatica("EXPRESION->   sqrt(EXPRESION)  "
                  ,"EXPRESION.val= new  Sqrt(EXPRESION.val) ")
        
        }


        //Relacionales
        |EXPRESION '==' EXPRESION       {$$ = new Relacional($1, $3, '==', @1.first_line, @1.first_column);
                        new ReporteGramatica("EXPRESION->   EXPRESION  == EXPRESION  "
                  ,"EXPRESION.val= new  Relacional( EXPRESION.val ,==, EXPRESION.val ) ")
        
        }
        |EXPRESION '!=' EXPRESION       {$$ = new Relacional($1, $3, '!=', @1.first_line, @1.first_column);
         new ReporteGramatica("EXPRESION->   EXPRESION  != EXPRESION  "
                  ,"EXPRESION.val= new  Relacional( EXPRESION.val ,!=, EXPRESION.val ) ")
        
        
        }
        |EXPRESION '>=' EXPRESION       {$$ = new Relacional($1, $3, '>=', @1.first_line, @1.first_column);
        
         new ReporteGramatica("EXPRESION->   EXPRESION  >= EXPRESION  "
                  ,"EXPRESION.val= new  Relacional( EXPRESION.val ,>=, EXPRESION.val ) ")
        
        }
        |EXPRESION '>'  EXPRESION       {$$ = new Relacional($1, $3, '>', @1.first_line, @1.first_column);
         new ReporteGramatica("EXPRESION->   EXPRESION  > EXPRESION  "
                  ,"EXPRESION.val= new  Relacional( EXPRESION.val ,>, EXPRESION.val ) ")
        
        
        }	
        |EXPRESION '<=' EXPRESION       {$$ = new Relacional($1, $3, '<=', @1.first_line, @1.first_column);
         new ReporteGramatica("EXPRESION->   EXPRESION  <= EXPRESION  "
                  ,"EXPRESION.val= new  Relacional( EXPRESION.val, <= ,EXPRESION.val ) ")
        
        }	
        |EXPRESION '<'  EXPRESION       {$$ = new Relacional($1, $3, '<', @1.first_line, @1.first_column);
        
        new ReporteGramatica("EXPRESION->   EXPRESION  < EXPRESION  "
                  ,"EXPRESION.val= new  Relacional( EXPRESION.val ,< ,EXPRESION.val ) ")
        
        }	 
        
        //Logicas
        |'!' EXPRESION	                {$$ = new Logico(null, $2, '!', @1.first_line, @1.first_column);
        
        new ReporteGramatica("EXPRESION->   !EXPRESION  "
                  ,"EXPRESION.val= new  Logico( ! ,EXPRESION.val ) ")
        
        }	
        |EXPRESION '&&' EXPRESION       {$$ = new Logico($1, $3, '&&', @1.first_line, @1.first_column);
          new ReporteGramatica("EXPRESION->   EXPRESION  < EXPRESION  "
                  ,"EXPRESION.val= new  Logico( EXPRESION.val ,< ,EXPRESION.val ) ")
        }
        |EXPRESION '||' EXPRESION       {$$ = new Logico($1, $3, '||', @1.first_line, @1.first_column);
          new ReporteGramatica("EXPRESION->   EXPRESION  < EXPRESION  "
                  ,"EXPRESION.val= new  Logico( EXPRESION.val ,< ,EXPRESION.val ) ")
        
        
        }

        //Cadenas
        |EXPRESION '&' EXPRESION        {$$ = new Aritmetica($1, $3, '&', @1.first_line, @1.first_column);
        
             new ReporteGramatica("EXPRESION->   EXPRESION  & EXPRESION  "
                  ,"EXPRESION.val= new  Aritmetica( EXPRESION.val ,& , EXPRESION.val ) ")
        
        }
        |EXPRESION '^' EXPRESION        {$$ = new Aritmetica($1, $3, '^', @1.first_line, @1.first_column);
        
             new ReporteGramatica("EXPRESION->   EXPRESION  ^ EXPRESION  "
                  ,"EXPRESION.val= new  Aritmetica( EXPRESION.val ,^ , EXPRESION.val ) ")
        
        
        }
        
        //Operador Ternario
        |EXPRESION '?' EXPRESION ':' EXPRESION  {$$ = new Ternario($1, $3, $5, @1.first_line, @1.first_column);
        
          new ReporteGramatica("EXPRESION->   EXPRESION  ? EXPRESION : EXPRESION  "
                  ,"EXPRESION.val= new  Ternario( EXPRESION.val ,EXPRESION.val, EXPRESION.val ) ")
        
        
        }




        //Primitivos
        |'null'    
        |'numero'                                               {$$ = new Primitivo(new Tipo(esEntero(Number($1))), Number($1), @1.first_line, @1.first_column);
          new ReporteGramatica("EXPRESION->   numero  "
                  ,"EXPRESION.val= new  Primitivo( numero.lexval ) ")
        
        } 
        |'true'                                                 {$$ = new Primitivo(new Tipo(tipos.BOOLEANO), true, @1.first_line, @1.first_column);
        
           new ReporteGramatica("EXPRESION->   true  "
                  ,"EXPRESION.val= new  Primitivo( true.lexval ) ")
        
        }
        |'false'                                                {$$ = new Primitivo(new Tipo(tipos.BOOLEANO), false, @1.first_line, @1.first_column);
        
           new ReporteGramatica("EXPRESION->   false  "
                  ,"EXPRESION.val= new  Primitivo( false.lexval ) ")
        
        }
        |'caracter'                                             {$$ = new Primitivo(new Tipo(tipos.CARACTER), $1.replace(/\'/g,""), @1.first_line, @1.first_column);
           new ReporteGramatica("EXPRESION->   caracter  "
                  ,"EXPRESION.val= new  Primitivo( caracter.lexval ) ")
        
        } 
        |'cadena'                                               {$$ = new Primitivo(new Tipo(tipos.STRING), $1.replace(/\"/g,""), @1.first_line, @1.first_column);
           new ReporteGramatica("EXPRESION->   cadena  "
                  ,"EXPRESION.val= new  Primitivo( cadena.lexval ) ")
        
        
        }
        |EXPRESION '.' 'toLowercase' '(' ')'                    {$$ = new ToLower($1, @1.first_line, @1.first_column);
           new ReporteGramatica("EXPRESION->   EXPRESION . toLowecase()  "
                  ,"EXPRESION.val= new  toLowecase( EXPRESION.val ) ")
        
        }  
        |EXPRESION '.' 'toUppercase' '(' ')'                    {$$ = new ToUpper($1, @1.first_line, @1.first_column);
         new ReporteGramatica("EXPRESION->   EXPRESION . toUppercase()  "
                  ,"EXPRESION.val= new  toUppercase( EXPRESION.val ) ")
        
        } 
        |EXPRESION '.' 'length' '(' ')'                         {$$ = new Length($1, @1.first_line, @1.first_column);
        
        new ReporteGramatica("EXPRESION->   EXPRESION . length()  "
                  ,"EXPRESION.val= new  length( EXPRESION.val ) ")
        }
        |EXPRESION '.'  'caracterOfPosition' '(' 'EXPRESION' ')'   {$$ = new CaracterOFposition($1,$5, @1.first_line, @1.first_column);
        
          new ReporteGramatica("EXPRESION->   EXPRESION . CaracterOFposition()  "
                  ,"EXPRESION.val= new  CaracterOFposition( EXPRESION.val ) ")
        }
        |EXPRESION '.'  'subString' '(' EXPRESION ',' EXPRESION ')'   {$$ = new Substring($1, $5, $7, @1.first_line, @1.first_column);
        
         new ReporteGramatica("EXPRESION->   EXPRESION . Substring(EXPRESION,EXPRESION)  "
                  ,"EXPRESION.val= new  Substring( EXPRESION.val,EXPRESION.val ) ")
        
        
        }
        
        //Llamar metodos y funciones
        |llamar
        |'[' LISTA_EXPRESION ']'                                {$$ = new Primitivo(new Tipo(tipos.ARREGLO), $2, @1.first_line, @1.first_column);
         new ReporteGramatica("EXPRESION->   [LISTA_EXPRESION]  "
                  ,"EXPRESION.val= new  Primitivo( LISTA_EXPRESION.val ) ")
        
        
        }
        |'identifier' '[' EXPRESION ']'                         {$$ = new Vector($1, $3, @1.first_line, @1.first_column);
        
           new ReporteGramatica("EXPRESION-> identifier  [EXPRESION]  "
                  ,"EXPRESION.val= new  Vector( identifier.lexval,EXPRESION.val ) ")
        
        
        }
        |'identifier' '[' EXPRESION ':' EXPRESION ']' 
        | EXPRESION '#'
        |'(' EXPRESION ')'                                      {$$=$2;
        
        new ReporteGramatica("EXPRESION->   (EXPRESION)  "
                  ,"EXPRESION.val= EXPRESION.val ")
        
        }
        // |'identifier' '.' 'identifier'
        
      
        //Distintas funciones nativas
        |TIPO '.' 'parse' '(' EXPRESION ')'     {$$ = new Nativas_Diferentes($1, $5, @1.first_line, @1.first_column);
        
        new ReporteGramatica("EXPRESION-> TIPO . parse (EXPRESION)  "
                  ,"EXPRESION.val= new  Nativas_Diferentes( TIPO.val,EXPRESION.val ) ")
        
        
        }
        |'toInt' '(' EXPRESION  ')'             {$$ = new ToInt($3, @1.first_line, @1.first_column);
        
         new ReporteGramatica("EXPRESION-> toInt (EXPRESION)  "
                  ,"EXPRESION.val= new  ToInt( EXPRESION.val ) ")
        
        }
        |'toDouble' '(' EXPRESION ')'           {$$ = new ToDouble($3, @1.first_line, @1.first_column);
        
        new ReporteGramatica("EXPRESION-> ToDouble (EXPRESION)  "
                  ,"EXPRESION.val= new  ToDouble( EXPRESION.val ) ")
        
        }
        |'string' '(' EXPRESION ')'             {$$ = new ConverString($3, @1.first_line, @1.first_column); 
        new ReporteGramatica("EXPRESION-> string (EXPRESION)  "
                  ,"EXPRESION.val= new  ConverString( EXPRESION.val ) ")
        
        }
        |'typeof' '(' EXPRESION ')'             {$$ = new TypeOf($3, @1.first_line, @1.first_column);
        new ReporteGramatica("EXPRESION-> TypeOf (EXPRESION)  "
                  ,"EXPRESION.val= new  TypeOf( EXPRESION.val ) ")
        
        }
        |'log10'  '(' EXPRESION ')'             {$$ = new Log($3, @1.first_line, @1.first_column);
        
        new ReporteGramatica("EXPRESION-> Log (EXPRESION)  "
                  ,"EXPRESION.val= new  Log( EXPRESION.val ) ")
        }
        |'identifier'                           {$$ = new Identificador($1, @1.first_line, @1.first_column);
        
        new ReporteGramatica("EXPRESION-> Identifier "
                  ,"EXPRESION.val= new  Identificador( identifier.lexval ) ")
        }
        |EXPRESION  LISTA_EXPRESION_PTO2        {$$ = new Obtener_struct($1, $2, @1.first_line, @1.first_column);

          new ReporteGramatica("EXPRESION-> EXPRESION  LISTA_EXPRESION_PTO2"
                  ,"EXPRESION.val= new  Obtener_struct( EXPRESION.val,LISTA_EXPRESION_PTO2.val ) "
        
        
        
        
        }
//int a = id.id.id  
;
  LISTA_EXPRESION_PTO2
    :LISTA_EXPRESION_PTO2 '.' OPCION_PTO2    { $$ = $1; $1.push($3);
    
         new ReporteGramatica("LISTA_EXPRESION_PTO2->LISTA_EXPRESION_PTO2 OPCION_PTO2"
          ,"LISTA_EXPRESION_PTO2=new Array(OPCION_PTO2) ----LISTA_EXPRESION_PTO2.push(OPCION_PTO.val)");
    
    }
    |'.' OPCION_PTO2                    { $$ = []; $$.push($2);
    
    
    new ReporteGramatica("LISTA_EXPRESION_PTO2-> . OPCION_PTO2"
     ,"LISTA_EXPRESION_PTO2.val=[OPCION_PTO2.val]");
    
    }
;  

OPCION_PTO2:    
    |'identifier'                     {$$ =$1;
      new ReporteGramatica("OPCION_PTO2->  identifier"
    ,"OPCION_PTO2.val=identifier.lexval");
    
    }
    |'identifier' '[' EXPRESION']'    {$$ =$1;
    
    
     new ReporteGramatica("OPCION_PTO->  identifier [EXPRESION]"
    ,"OPCION_PTO.val=identifier.lexval+EXPRESION.val");
    }

  
  
  
  ;
TIPO
    :double     {$$ = new Tipo(tipos.DECIMAL);
     new ReporteGramatica("TIPO-> double "
                  ,"TIPO.val= new  Tipo( double.lexval ) ")
    
    }
    |String     {$$ = new Tipo(tipos.STRING);
    new ReporteGramatica("TIPO-> double "
                  ,"TIPO.val= new  Tipo( double.lexval ) ")
    
    }
    |int        {$$ = new Tipo(tipos.ENTERO);
    
    new ReporteGramatica("TIPO-> int "
                  ,"TIPO.val= new  Tipo( int.lexval ) ")
    }
    |boolean    {$$ = new Tipo(tipos.BOOLEANO);
    new ReporteGramatica("TIPO-> boolean "
                  ,"TIPO.val= new  Tipo( boolean.lexval ) ")
    }
    |char       {$$ = new Tipo(tipos.CARACTER);
    new ReporteGramatica("TIPO-> char "
                  ,"TIPO.val= new  Tipo( char.lexval ) ")
    }
    |void       {$$ = new Tipo(tipos.VOID);
    
    new ReporteGramatica("TIPO-> void "
                  ,"TIPO.val= new  Tipo( void.lexval ) ")
    }
;
