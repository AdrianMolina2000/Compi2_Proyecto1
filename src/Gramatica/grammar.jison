
%{ 
    const {Tree} = require('../Simbols/Tree');
    const {Tipo, tipos, esEntero} = require('../other/tipo');
    const {Primitivo} = require('../Expresiones/Primitivo');
    const {Identificador} = require('../Expresiones/Identificador');
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

    //Instrucciones
    const {Print} = require('../Instrucciones/Print');
    const {Declaracion, defal} = require('../Instrucciones/Declaracion');
    const {Asignacion} = require('../Instrucciones/Asignacion');
%}

%lex

%options case-sensitive
no  ([\"]*)

stringliteral (\"[^"]*\")
identifier ([a-zA-Z_])[a-zA-Z0-9_]*


caracter (\'[^☼]\')
%%  

\s+                 {}
[ \t\r\n\f]         {}
\n                  {}                 
"/""/".*            {}
[/][*][^*/]*[*][/]  {}

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
"log"                return 'log'

[0-9]+("."[0-9]+)?\b  return 'numero';

"struct"              return 'struct'
{identifier}          return 'identifier'

<<EOF>>	              return 'EOF'
/lex
%left 'else'
%left '||'
%left '&&' ,'&','^','#','?' ,'.'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-'
%left '*' '/' '%' 'identifier'
%right '!'
%left UMENOS

%start INICIO

%%


INICIO : LISTA_INSTRUCCIONES EOF { $$ = new Tree($1); return $$; } ;

// INICIO : INSTRUCCIONES EOF { $$ = new Tree($1); return $$; } ;

// INSTRUCCIONES
//             :INSTRUCCIONES INSTRUCCION  {$$ = $1; $1.push($2);}
//             |INSTRUCCION                {$$ =[$1];}
// ;

// INSTRUCCION  
//     :TIPO 'identifier' '(' Verificar_params ')' '{' LISTA_INSTRUCCIONES '}' 
//     |'void' 'identifier' '(' Verificar_params ')' '{' LISTA_INSTRUCCIONES '}' 
//     |'void' 'main' '(' Verificar_params ')' '{' LISTA_INSTRUCCIONES '}' 
//     | DECLARACION ';'
    //| error ';' {console.log(yytext+"error sintactico") }
// ;

Verificar_params
    :PARAMETROS
    |
;

PARAMETROS
    :PARAMETROS ',' TIPO 'identifier'
    |TIPO 'identifier'
;

LISTA_INSTRUCCIONES
    :LISTA_INSTRUCCIONES ListaIns   {$$ = $1; $1.push($2);}
    |ListaIns                       {$$ =[$1];}
;

ListaIns
    :PRINT ';'                      {$$ = $1;}    
    |DECLARACION ';'
    |ASIGNACION ';' 
    |LLAMAR ';' 
    |IF
    |SWITCH
    |'break' ';'
    |WHILE
    |DO ';'
    |FOR
    |'identifier' 'decremento' ';'
    |'identifier' 'incremento' ';'
    | RETURN ';'
    |'identifier' '.' 'pop' '(' ')'
    |'identifier' '.' 'push' '(' EXPRESION ')'
    |STRUCT ';' 
    | error ';' {console.log(yytext+"error sintactico") }


;

ListaIns2
    :PRINT ';'                  {$$ = $1;}  
    |DECLARACION ';'
    |ASIGNACION ';' 
    |LLAMAR ';' 
    |SWITCH
    |'break' ';'
    |WHILE
    |DO ';'
    |FOR
    |'identifier' 'incremento' ';'
    |'identifier' 'decremento' ';'
    |RETURN ';'
    |'identifier' '.' 'pop' '(' ')'
    |'identifier' '.' 'push' '(' EXPRESION ')'
    |STRUCT ';'

;

PRINT
    :'print' '(' LISTA_EXPRESION ')'    {$$ = new Print($3, @1.first_line, @1.first_column,1); }
    |'println' '(' LISTA_EXPRESION ')'  {$$ = new Print($3, @1.first_line, @1.first_column,2); console.log("normaaaaaaaal")}
    |'printf' '(' LISTA_EXPRESION ')'
;

LISTA_EXPRESION
    :LISTA_EXPRESION ',' EXPRESION      {$$ = $1; $1.push($3);}
    |EXPRESION                          {$$ = []; $$.push($1);}
;

DECLARACION
    :TIPO 'identifier' '=' EXPRESION            {$$ = new Declaracion($1, $2, $4, @1.first_line, @1.first_column);}
    |TIPO LISTA_ID                              {$$ = new Declaracion($1, $2, defal($1), @1.first_line, @1.first_column);}
    |TIPO '[' ']' 'identifier' '=' EXPRESION
    |'identifier' 'identifier' '=' EXPRESION 
;

LISTA_ID
    :LISTA_ID ',' 'identifier'      {$$ = $1; $1.push($3);}
    |'identifier'                   {$$ = []; $$.push($1);}
;

ASIGNACION
    :'identifier' '=' EXPRESION     {$$ = new Asignacion($1, $3, @1.first_line, @1.first_column);}
    |'identifier' '.' 'identifier' '=' EXPRESION
    |'identifier' '.' 'identifier' '.' 'identifier' '=' EXPRESION
    |'identifier' '.' 'identifier' '.' 'identifier' '.' 'identifier' '=' EXPRESION
    |'identifier' '.' 'identifier' '.' 'identifier' '.' 'identifier' '.' 'identifier' '=' EXPRESION   
    |'identifier' '[' EXPRESION ']' '=' EXPRESION
;

LLAMAR:
     'identifier' '(' LISTA_EXPRESION ')'
     |'identifier' '(' ')'
;        

PARAMETROS_LLAMADA
    :PARAMETROS_LLAMADA ',' EXPRESION
    |EXPRESION
;

IF
    :'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}'
    |'if' '(' EXPRESION ')' ListaIns2
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' '{' LISTA_INSTRUCCIONES '}'
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' IF
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' ListaIns2
    |'if' '(' EXPRESION ')' ListaIns2 'else' ListaIns2
;

SWITCH  
    :'switch' '(' EXPRESION ')' '{' CASE_LIST DEFAULT_LIST '}' 
    |'switch' '(' EXPRESION ')' '{' CASE_LIST '}'  
    |'switch' '(' EXPRESION ')' '{' DEFAULT_LIST '}'  
;

CASE_LIST
    :CASE_LIST 'case' EXPRESION ':' LISTA_INSTRUCCIONES
    |'case' EXPRESION ':' LISTA_INSTRUCCIONES
;

DEFAULT_LIST
    :'default' ':' LISTA_INSTRUCCIONES
;

WHILE
    :'while' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}'
;

DO
    :'do' '{'  LISTA_INSTRUCCIONES '}' 'while' '(' EXPRESION ')' ';'
;

FOR
    :'for' 'identifier' 'in' EXPRESION '{' LISTA_INSTRUCCIONES '}'
    |'for' '(' forVar ';' EXPRESION ';' for_increment ')' '{' LISTA_INSTRUCCIONES '}'
;

forVar
    :TIPO 'identifier' '=' EXPRESION
    |'identifier' '=' EXPRESION 
;

for_increment
    :'identifier' 'incremento' 	            					    
	|'identifier' 'decremento' 	            	 
    |'identifier' ':' EXPRESION
;

RETURN 
    :'return' EXPRESION
    |'return'
;

STRUCT:
    'struct' 'identifier' '{' Lista_declaracion '}'
;

Lista_declaracion:
                Lista_declaracion ',' OPCION_DECLARACIO_Struct 'identifier' 
                |OPCION_DECLARACIO_Struct 'identifier' 
;


OPCION_DECLARACIO_Struct
                        :TIPO 
                        |'identifier'
                        | TIPO  '[' ']'
;


EXPRESION 
        //Aritmeticas
        :'-' EXPRESION %prec UMENOS     {$$ = new Aritmetica(null, $2, '-', @1.first_line, @1.first_column);}	    
        |EXPRESION '+' EXPRESION        {$$ = new Aritmetica($1, $3, '+', @1.first_line, @1.first_column);}	
        |EXPRESION '-' EXPRESION        {$$ = new Aritmetica($1, $3, '-', @1.first_line, @1.first_column);}
        |EXPRESION '*' EXPRESION        {$$ = new Aritmetica($1, $3, '*', @1.first_line, @1.first_column);}	
        |EXPRESION '/' EXPRESION        {$$ = new Aritmetica($1, $3, '/', @1.first_line, @1.first_column);}	
        |EXPRESION '%' EXPRESION        {$$ = new Aritmetica($1, $3, '%', @1.first_line, @1.first_column);}	
        
        //Nativas Aritmeticas
        |'sin'  '(' EXPRESION ')'
        |'cos' '(' EXPRESION ')'
        |'tan' '(' EXPRESION ')'
        |'pow' '(' EXPRESION ',' 'EXPRESION' ')'
        |'sqrt' '(' EXPRESION ')'

        //Relacionales
        |EXPRESION '==' EXPRESION       {$$ = new Relacional($1, $3, '==', @1.first_line, @1.first_column);}
        |EXPRESION '!=' EXPRESION       {$$ = new Relacional($1, $3, '!=', @1.first_line, @1.first_column);}
        |EXPRESION '>=' EXPRESION       {$$ = new Relacional($1, $3, '>=', @1.first_line, @1.first_column);}
        |EXPRESION '>'  EXPRESION       {$$ = new Relacional($1, $3, '>', @1.first_line, @1.first_column);}	
        |EXPRESION '<=' EXPRESION       {$$ = new Relacional($1, $3, '<=', @1.first_line, @1.first_column);}	
        |EXPRESION '<'  EXPRESION       {$$ = new Relacional($1, $3, '<', @1.first_line, @1.first_column);}	 
        
        //Logicas
        |'!' EXPRESION	     
        |EXPRESION '&&' EXPRESION       {$$ = new Logico($1, $3, '&&', @1.first_line, @1.first_column);}
        |EXPRESION '||' EXPRESION       {$$ = new Logico($1, $3, '||', @1.first_line, @1.first_column);}

        //Cadenas
        |EXPRESION '&' EXPRESION        {$$ = new Aritmetica($1, $3, '&', @1.first_line, @1.first_column);}
        |EXPRESION '^' EXPRESION        {$$ = new Aritmetica($1, $3, '^', @1.first_line, @1.first_column);}
        
        //Operador Ternario
        |EXPRESION '?' EXPRESION ':' EXPRESION

        //Primitivos
        |'null'    
        |'numero'                   {$$ = new Primitivo(new Tipo(esEntero(Number($1))), Number($1), @1.first_line, @1.first_column);} 
        |'true'                     {$$ = new Primitivo(new Tipo(tipos.BOOLEANO), true, @1.first_line, @1.first_column);}
        |'false'                    {$$ = new Primitivo(new Tipo(tipos.BOOLEANO), false, @1.first_line, @1.first_column);}
        |'caracter'                 {$$ = new Primitivo(new Tipo(tipos.CARACTER), $1.replace(/\'/g,""), @1.first_line, @1.first_column);} 
        |'cadena'                   {$$ = new Primitivo(new Tipo(tipos.STRING), $1.replace(/\"/g,""), @1.first_line, @1.first_column);}
        |EXPRESION '.' 'toLowercase' '(' ')'     {$$ = new ToLower($1, @1.first_line, @1.first_column);}  
        |EXPRESION '.' 'toUppercase' '(' ')'     {$$ = new ToUpper($1, @1.first_line, @1.first_column);} 
        |EXPRESION '.' 'length' '(' ')'          {$$ = new Length($1, @1.first_line, @1.first_column);}
        |EXPRESION '.'  'caracterOfPosition' '(' 'numero' ')'  {$$ = new CaracterOFposition($1,$5, @1.first_line, @1.first_column);}
        |EXPRESION '.'  'subString' '(' numero ',' numero ')'  {$$ = new Substring($1,$5,$7, @1.first_line, @1.first_column);}
        
        //Llamar metodos y funciones
        |LLAMAR
        |'[' LISTA_EXPRESION ']'                        {$$ = new Primitivo(new Tipo(tipos.ARREGLO), $2, @1.first_line, @1.first_column);}
        |'identifier' '[' EXPRESION ']'
        |'identifier' '[' EXPRESION ':' EXPRESION ']'
        | EXPRESION '#'
        |'(' EXPRESION ')'                                      {$$=$2;}
        // |'identifier' '.' 'identifier'
        

        //Distintas funciones nativas
        |TIPO '.' 'parse' '(' EXPRESION ')' 
        |'toInt' '(' EXPRESION  ')'         {$$ = new ToInt($3, @1.first_line, @1.first_column);}
        |'toDouble' '(' EXPRESION ')'       {$$ = new ToDouble($3, @1.first_line, @1.first_column);}
        |'string' '(' EXPRESION ')'         {$$ = new ConverString($3, @1.first_line, @1.first_column); console.log("adentrooooooo")}
        |'typeof' '(' EXPRESION ')'  
        |'log' 'numero' '(' ')'       

        |'identifier' '.' 'pop' '(' ')'
        |'identifier'                       {$$ = new Identificador($1, @1.first_line, @1.first_column);}
;

TIPO
    :double     {$$ = new Tipo(tipos.DECIMAL);}
    |String     {$$ = new Tipo(tipos.STRING);}
    |int        {$$ = new Tipo(tipos.ENTERO);}
    |boolean    {$$ = new Tipo(tipos.BOOLEANO);}
    |char       {$$ = new Tipo(tipos.CARACTER);}
;


