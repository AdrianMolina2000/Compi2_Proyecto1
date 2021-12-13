
%{ 
    const {Tree} = require('../Simbols/Tree');
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

    //Instrucciones
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
    const {DeclaracionArray} = require('../Instrucciones/DeclaracionArray');
    const {Asignacion} = require('../Instrucciones/Asignacion');
    const {InDecrement} = require('../Expresiones/InDecrement');
    const {AddLista} = require('../Instrucciones/AddLista');
    const {Pop} = require('../Instrucciones/pop');
    const {For} = require('../Instrucciones/For');
    const {ForIn} = require('../Instrucciones/ForIn');
    const {Struct} = require('../Instrucciones/Struct');
    const {DeclaracionMetodo} = require('../Instrucciones/DeclaracionMetodo');
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
"log10"                return 'log10'

[0-9]+("."[0-9]+)?\b  return 'numero';

"struct"                return 'struct'
([a-zA-Z])[a-zA-Z0-9_]* return 'identifier';




<<EOF>>	              return 'EOF'
/lex
%left 'else'
%left '||'
%left '&&' ,'&','^','#','?'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-'
%left '*' '/' '%' 'identifier' '.'
%right '!'
%left UMENOS

%start INICIO

%%


// INICIO : LISTA_INSTRUCCIONES EOF { $$ = new Tree($1); return $$; } ;

INICIO : INSTRUCCIONES EOF { $$ = new Tree($1); return $$; } ;

INSTRUCCIONES
            :INSTRUCCIONES INSTRUCCION  {$$ = $1; $1.push($2);}
            |INSTRUCCION                {$$ =[$1];}
;

INSTRUCCION  
    :TIPO 'identifier' '(' Verificar_params ')' '{' LISTA_INSTRUCCIONES '}'     {$$ = new DeclaracionMetodo($1 ,$2, $4, $7, @1.first_line, @1.first_column);}
    |DECLARACION ';'                                                            {$$ = $1;}
    |llamada
;

Verificar_params
    :PARAMETROS     {$$ = $1}
    |               {$$ = []}
;

PARAMETROS
    :PARAMETROS ',' TIPO 'identifier'   {$$ = $1; $$.push(new Declaracion($3, $4, null,@1.first_line, @1.first_column));}
    |TIPO 'identifier'                  {$$ = []; $$.push(new Declaracion($1, $2, null,@1.first_line, @1.first_column));} 
;

LISTA_INSTRUCCIONES
    :LISTA_INSTRUCCIONES ListaIns   {$$ = $1; $1.push($2);}
    |ListaIns                       {$$ =[$1];}
;

llamada
    :llamar ';'                          {$$ = $1;}
;

llamar
    :'identifier' '(' parametros_llamada ')'    {$$ = new LlamadaMetodo($1, $3, @1.first_line, @1.first_column);}
    |'identifier' '(' ')'                       {$$ = new LlamadaMetodo($1, [], @1.first_line, @1.first_column);}
;

parametros_llamada
    :parametros_llamada ',' EXPRESION   { $$ = $1; $$.push($3);}
    |EXPRESION                          { $$ = []; $$.push($1);}
;

ListaIns
    :PRINT ';'                                  {$$ = $1;}    
    |DECLARACION ';'                            {$$ = $1;}
    |ASIGNACION ';'                             {$$ = $1;}
    |IF                                         {$$ = $1;}  
    |SWITCH                                      {$$ = $1;}  
    |'break' ';'                                {$$ = new Break(@1.first_line, @1.first_column);}
    |WHILE                                      {$$ = $1;}  
    |DO ';'                                     {$$ = $1;}  
    |FOR          
    |'identifier' 'decremento' ';'              {$$ = new InDecrement($1, "--", @1.first_line, @1.first_column);}
    |'identifier' 'incremento' ';'              {$$ = new InDecrement($1, "++", @1.first_line, @1.first_column);}
    | RETURN ';'                                {$$ = $1;}  
    |'identifier' '.' 'pop' '(' ')'             {$$ = new Pop($1, @1.first_line, @1.first_column);} 
    |'identifier' '.' 'push' '(' EXPRESION ')'  {$$ = new AddLista($1, $5, @1.first_line, @1.first_column);} 
    |STRUCT ';'                                   {$$ = $1;}  
    |'continue' ';'                             {$$ = new Continue(@1.first_line, @1.first_column);}
    |llamada                                    {$$ = $1}
    | error ';'                                 {console.log(yytext+"error sintactico") }


;
ListaIns2
    :PRINT ';'                                  {$$ = $1;}  
    |DECLARACION ';'                            {$$ = $1;}
    |ASIGNACION ';'                             {$$ = $1;}
    |SWITCH                                     {$$ = $1;}  
    |'break' ';'                                {$$ = new Break(@1.first_line, @1.first_column);} 
    |WHILE
    |DO ';'                                     {$$ = $1;}
    |FOR
    |'identifier' 'incremento' ';'              {$$ = new InDecrement($1, "++", @1.first_line, @1.first_column);}
    |'identifier' 'decremento' ';'              {$$ = new InDecrement($1, "--", @1.first_line, @1.first_column);}
    |RETURN ';'                                 {$$ = $1;}  
    |'identifier' '.' 'pop' '(' ')'             {$$ = new Pop($1, @1.first_line, @1.first_column);} 
    |'identifier' '.' 'push' '(' EXPRESION ')'  {$$ = new AddLista($1, $5, @1.first_line, @1.first_column);}
    |'continue' ';'                             {$$ = new Continue(@1.first_line, @1.first_column);}
    |STRUCT ';'                                 {$$ = $1;}  
    |llamada                                    {$$ = $1;}
    | error ';'                                 {console.log(yytext+"error sintactico") }

;


PRINT
    :'print' '(' LISTA_EXPRESION ')'    {$$ = new Print($3, @1.first_line, @1.first_column,1); }
    |'println' '(' LISTA_EXPRESION ')'  {$$ = new Print($3, @1.first_line, @1.first_column,2); }
    |'printf' '(' LISTA_EXPRESION ')'
;

LISTA_EXPRESION
    :LISTA_EXPRESION ',' EXPRESION      {$$ = $1; $1.push($3);}
    |EXPRESION                          {$$ = []; $$.push($1);}
;


DECLARACION
    :TIPO 'identifier' '=' EXPRESION            {$$ = new Declaracion($1, [$2], $4, @1.first_line, @1.first_column);}
    |TIPO LISTA_ID                              {$$ = new Declaracion($1, $2, defal($1), @1.first_line, @1.first_column);}
    |TIPO '[' ']' 'identifier' '=' EXPRESION    {$$ = new DeclaracionArray($1, $4, $6, @1.first_line, @1.first_column);}
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
    |'identifier' '[' EXPRESION ']' '=' EXPRESION   {$$ = new AsignacionVector($1, $3, $6, @1.first_line, @1.first_column);} 
;

/*string alv="abcdefgh";

print(alv);*/

    

PARAMETROS_LLAMADA
    :PARAMETROS_LLAMADA ',' EXPRESION       { $$ = $1; $$.push($3);}
    |EXPRESION                              { $$ = []; $$.push($1);}
;

IF
    :'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}'                                     {$$ = new If($3, $6, [], @1.first_line, @1.first_column);}
    |'if' '(' EXPRESION ')' ListaIns2                                                       {$$ = new If_unico($3, $5,[], null,1, @1.first_line, @1.first_column); console.log("suuuu1");}
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' '{' LISTA_INSTRUCCIONES '}'  {$$ = new If($3, $6, $10, @1.first_line, @1.first_column);}
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' IF                           {$$ = new If($3, $6, [$9], @1.first_line, @1.first_column);}
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' ListaIns2                    {$$ = new If_unico($3,null, $6, $9,2, @1.first_line, @1.first_column);}
    |'if' '(' EXPRESION ')' ListaIns2 'else' ListaIns2                                      {$$ = new If_unico($3,$5,[],$7,1,@1.first_line, @1.first_column); console.log("suuuu");}
;

SWITCH  
    :'switch' '(' EXPRESION ')' '{' CASE_LIST DEFAULT_LIST '}'      {$$ = new Switch($3, $6, $7, @1.first_line, @1.first_column);}
    |'switch' '(' EXPRESION ')' '{' CASE_LIST '}'                   {$$ = new Switch($3, $6, null, @1.first_line, @1.first_column);}
    |'switch' '(' EXPRESION ')' '{' DEFAULT_LIST '}'                {$$ = new Switch($3, null, $6, @1.first_line, @1.first_column);}
;

CASE_LIST
    :CASE_LIST 'case' EXPRESION ':' LISTA_INSTRUCCIONES             {$$ = $1; $$.push(new Case($3, $5, @1.first_line, @1.first_column));}
    |'case' EXPRESION ':' LISTA_INSTRUCCIONES                       {$$ = []; $$.push(new Case($2, $4, @1.first_line, @1.first_column));}
;

DEFAULT_LIST
    :'default' ':' LISTA_INSTRUCCIONES      {$$ = $3}
;

WHILE
    :'while' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}'          {$$ = new While($3, $6, @1.first_line, @1.first_column);}
;

DO
    :'do' '{'  LISTA_INSTRUCCIONES '}' 'while' '(' EXPRESION ')'    {$$ = new DoWhile($7, $3, @1.first_line, @1.first_column); console.log("adentro de mi amigo do")}
;

FOR
    :'for' forIn 'in' EXPRESION '{' LISTA_INSTRUCCIONES '}'                             {$$ = new ForIn($2, $4, $6, @1.first_line, @1.first_column);}
    |'for' '(' forVar ';' EXPRESION ';' for_increment ')' '{' LISTA_INSTRUCCIONES '}'   {$$ = new For($3, $5, $7, $10, @1.first_line, @1.first_column);}
;

forIn
    :'identifier'                       {$$ = new Declaracion(new Tipo(tipos.STRING), [$1], defal(new Tipo(tipos.STRING)), @1.first_line, @1.first_column);}
;


forVar
    :TIPO 'identifier' '=' EXPRESION    {$$ = new Declaracion($1, $2, $4, @1.first_line, @1.first_column);}
    |'identifier' '=' EXPRESION         {$$ = new Asignacion($1, $3, @1.first_line, @1.first_column);}
;

for_increment
    :'identifier' 'incremento' 	        {$$ = new InDecrement($1, "++", @1.first_line, @1.first_column);}   					    
	|'identifier' 'decremento'          {$$ = new InDecrement($1, "--", @1.first_line, @1.first_column);}
    |'identifier' '=' EXPRESION         {$$ = new Asignacion($1, $3, @1.first_line, @1.first_column);}        	 
;

RETURN 
    :'return' EXPRESION         {$$ = new Retorno($2, @1.first_line, @1.first_column);}
    |'return'                   {$$ = new Retorno(null, @1.first_line, @1.first_column);}
;

STRUCT:
    'struct' 'identifier' '{' Lista_declaracion '}'   {$$ = new Struct($2,$4, @1.first_line, @1.first_column);} 
;

Lista_declaracion:
                Lista_declaracion ',' OPCION_DECLARACIO_Struct      {$$ = $1; $1.push($3);}
                |OPCION_DECLARACIO_Struct                           {$$ = []; $$.push($1);}
;



OPCION_DECLARACIO_Struct
                        :TIPO 'identifier'{$$ = new Declaracion($1, [$2], defal($1), @1.first_line, @1.first_column);}
                        |'identifier'  'identifier' 
                        | TIPO   '[' ']' 'identifier'  {$$ = new DeclaracionArray($1, $4, $6, @1.first_line, @1.first_column);}
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
        |'sin'  '(' EXPRESION ')'                   {$$ = new Seno($3, @1.first_line, @1.first_column);}
        |'cos' '(' EXPRESION ')'                    {$$ = new Cos($3, @1.first_line, @1.first_column);}
        |'tan' '(' EXPRESION ')'                    {$$ = new Tan($3, @1.first_line, @1.first_column);}
        |'pow' '(' EXPRESION ',' 'EXPRESION' ')'    {$$ = new Pow($3,$5, @1.first_line, @1.first_column);}
        |'sqrt' '(' EXPRESION ')'                   {$$ = new Sqrt($3, @1.first_line, @1.first_column);}


        //Relacionales
        |EXPRESION '==' EXPRESION       {$$ = new Relacional($1, $3, '==', @1.first_line, @1.first_column);}
        |EXPRESION '!=' EXPRESION       {$$ = new Relacional($1, $3, '!=', @1.first_line, @1.first_column);}
        |EXPRESION '>=' EXPRESION       {$$ = new Relacional($1, $3, '>=', @1.first_line, @1.first_column);}
        |EXPRESION '>'  EXPRESION       {$$ = new Relacional($1, $3, '>', @1.first_line, @1.first_column);}	
        |EXPRESION '<=' EXPRESION       {$$ = new Relacional($1, $3, '<=', @1.first_line, @1.first_column);}	
        |EXPRESION '<'  EXPRESION       {$$ = new Relacional($1, $3, '<', @1.first_line, @1.first_column);}	 
        
        //Logicas
        |'!' EXPRESION	                {$$ = new Logico(null, $2, '!', @1.first_line, @1.first_column);}	
        |EXPRESION '&&' EXPRESION       {$$ = new Logico($1, $3, '&&', @1.first_line, @1.first_column);}
        |EXPRESION '||' EXPRESION       {$$ = new Logico($1, $3, '||', @1.first_line, @1.first_column);}

        //Cadenas
        |EXPRESION '&' EXPRESION        {$$ = new Aritmetica($1, $3, '&', @1.first_line, @1.first_column);}
        |EXPRESION '^' EXPRESION        {$$ = new Aritmetica($1, $3, '^', @1.first_line, @1.first_column);}
        
        //Operador Ternario
        |EXPRESION '?' EXPRESION ':' EXPRESION  {$$ = new Ternario($1, $3, $5, @1.first_line, @1.first_column);}

        //Primitivos
        |'null'    
        |'numero'                                               {$$ = new Primitivo(new Tipo(esEntero(Number($1))), Number($1), @1.first_line, @1.first_column);} 
        |'true'                                                 {$$ = new Primitivo(new Tipo(tipos.BOOLEANO), true, @1.first_line, @1.first_column);}
        |'false'                                                {$$ = new Primitivo(new Tipo(tipos.BOOLEANO), false, @1.first_line, @1.first_column);}
        |'caracter'                                             {$$ = new Primitivo(new Tipo(tipos.CARACTER), $1.replace(/\'/g,""), @1.first_line, @1.first_column);} 
        |'cadena'                                               {$$ = new Primitivo(new Tipo(tipos.STRING), $1.replace(/\"/g,""), @1.first_line, @1.first_column);}
        |EXPRESION '.' 'toLowercase' '(' ')'                    {$$ = new ToLower($1, @1.first_line, @1.first_column);}  
        |EXPRESION '.' 'toUppercase' '(' ')'                    {$$ = new ToUpper($1, @1.first_line, @1.first_column);} 
        |EXPRESION '.' 'length' '(' ')'                         {$$ = new Length($1, @1.first_line, @1.first_column);}
        |EXPRESION '.'  'caracterOfPosition' '(' 'EXPRESION' ')'   {$$ = new CaracterOFposition($1,$5, @1.first_line, @1.first_column); console.log("adentro de caracterofposition")}
        |EXPRESION '.'  'subString' '(' EXPRESION ',' EXPRESION ')'   {$$ = new Substring($1, $5, $7, @1.first_line, @1.first_column);}
        
        //Llamar metodos y funciones
        |llamar
        |'[' LISTA_EXPRESION ']'                                {$$ = new Primitivo(new Tipo(tipos.ARREGLO), $2, @1.first_line, @1.first_column);}
        |'identifier' '[' EXPRESION ']'                         {$$ = new Vector($1, $3, @1.first_line, @1.first_column);}
        |'identifier' '[' EXPRESION ':' EXPRESION ']'
        | EXPRESION '#'
        |'(' EXPRESION ')'                                      {$$=$2;}
        // |'identifier' '.' 'identifier'
        


        //Distintas funciones nativas
        |TIPO '.' 'parse' '(' EXPRESION ')'     {$$ = new Nativas_Diferentes($1, $5, @1.first_line, @1.first_column);}
        |'toInt' '(' EXPRESION  ')'             {$$ = new ToInt($3, @1.first_line, @1.first_column);}
        |'toDouble' '(' EXPRESION ')'           {$$ = new ToDouble($3, @1.first_line, @1.first_column);}
        |'string' '(' EXPRESION ')'             {$$ = new ConverString($3, @1.first_line, @1.first_column); }
        |'typeof' '(' EXPRESION ')'             {$$ = new TypeOf($3, @1.first_line, @1.first_column);}
        |'log10'  '(' EXPRESION ')'             {$$ = new Log($3, @1.first_line, @1.first_column);console.log("adentro del log papa")}
        |'identifier'                           {$$ = new Identificador($1, @1.first_line, @1.first_column);}
;

TIPO
    :double     {$$ = new Tipo(tipos.DECIMAL);}
    |String     {$$ = new Tipo(tipos.STRING);}
    |int        {$$ = new Tipo(tipos.ENTERO);}
    |boolean    {$$ = new Tipo(tipos.BOOLEANO);}
    |char       {$$ = new Tipo(tipos.CARACTER);}
    |void       {$$ = new Tipo(tipos.VOID);}
;


