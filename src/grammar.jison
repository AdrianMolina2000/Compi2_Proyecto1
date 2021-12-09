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
"lenght"              return 'lenght'
"toUppercase"         return 'toUppercase'
"toLowercase"         return 'toLowercase'
"toInt"               return 'toInt'
"toDouble"            return 'toDouble'
"String"              return 'String'
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
%left '*' '/' '%'
%right '!'
%left UMENOS

%start INICIO

%%


INICIO : INSTRUCCIONES EOF {   console.log("ya");return $$; } ;

INSTRUCCIONES
            :INSTRUCCIONES INSTRUCCION  {$$ = $1; $1.push($2);}
            |INSTRUCCION                {$$ =[$1];}
;

INSTRUCCION  
    :TIPO 'identifier' '(' Verificar_params ')' '{' LISTA_INSTRUCCIONES '}' 
    |'void' 'identifier' '(' Verificar_params ')' '{' LISTA_INSTRUCCIONES '}' 
    |'void' 'main' '(' Verificar_params ')' '{' LISTA_INSTRUCCIONES '}' 
    | DECLARACION ';'
;

Verificar_params
    :PARAMETROS
    |
;

PARAMETROS
    :PARAMETROS ',' TIPO 'identifier'
    |TIPO 'identifier'
;

LISTA_INSTRUCCIONES
    :LISTA_INSTRUCCIONES ListaIns
    |ListaIns
;

ListaIns
    :PRINT ';'
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

;

ListaIns2
    :PRINT ';'
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
    :'print' '(' LISTA_EXPRESION ')'
    |'println' '(' LISTA_EXPRESION ')'
    |'printf' '(' LISTA_EXPRESION ')'
;

LISTA_EXPRESION
    :LISTA_EXPRESION ',' EXPRESION
    |EXPRESION
;

DECLARACION
    :TIPO 'identifier' '=' EXPRESION 
    |TIPO LISTA_ID
    |TIPO '[' ']' 'identifier' '=' EXPRESION
    |'identifier' 'identifier' '=' EXPRESION 
;

LISTA_ID
    :LISTA_ID ',' 'identifier'
    |'identifier'
;

ASIGNACION
    :'identifier' '=' EXPRESION
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
        :'-' EXPRESION %prec UMENOS	    
        |EXPRESION '+' EXPRESION      
        |EXPRESION '-' EXPRESION    
        |EXPRESION '*' EXPRESION    
        |EXPRESION '/' EXPRESION    
        |EXPRESION '%' EXPRESION    
        
        //Nativas Aritmeticas
        |'sin'  '(' EXPRESION ')'
        |'cos' '(' EXPRESION ')'
        |'tan' '(' EXPRESION ')'
        |'pow' '(' EXPRESION ',' 'EXPRESION' ')'
        |'sqrt' '(' EXPRESION ')'

        //Relacionales
        |EXPRESION '==' EXPRESION   
        |EXPRESION '!=' EXPRESION   
        |EXPRESION '>=' EXPRESION    
        |EXPRESION '>'  EXPRESION   
        |EXPRESION '<=' EXPRESION   
        |EXPRESION '<' EXPRESION    
        
        //Logicas
        |'!' EXPRESION	     
        |EXPRESION '&&' EXPRESION  
        |EXPRESION '||' EXPRESION  

        //Cadenas
        |EXPRESION '&' EXPRESION
        |EXPRESION '^' EXPRESION 
        |'identifier' '.' 'caracterOfPosition' '(' EXPRESION ')'
        |'identifier' '.' 'subString' '(' EXPRESION ',' EXPRESION ')'
        |'identifier' '.' 'lenght' '(' ')'
        |'identifier' '.' 'toUppercase' '(' ')'
        |'identifier' '.' 'toLowercase' '(' ')'
        
        //Operador Ternario
        |EXPRESION '?' EXPRESION ':' EXPRESION

        //Primitivos
        |'null'    
        |'numero'  
        |'true'    
        |'false'    
        |'caracter'  
        |'cadena'  
        
        //Llamar metodos y funciones
        |LLAMAR
        |'identifier'
        |'[' LISTA_EXPRESION ']'
        |'identifier' '[' EXPRESION ']'
        |'identifier' '[' EXPRESION ':' EXPRESION ']'
        |EXPRESION '#'
        |'(' EXPRESION ')'   
        |'identifier' '.' 'identifier'
        

        //Distintas funciones nativas
        |TIPO '.' 'parse' '(' EXPRESION ')'
        |'toInt' '(' EXPRESION  ')' 
        |'toDouble' '(' EXPRESION ')' 
        |'string' '(' EXPRESION ')' 
        |'typeof' '(' EXPRESION ')'  
        |'log' 'numero' '(' ')'       

        |'identifier' '.' 'pop' '(' ')'
      
;
       
TIPO
    :double
    |String
    |int
    |boolean
    |char
;


