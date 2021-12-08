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

//declaracion metodos y funciones
INSTRUCCION  
        :TIPO 'identifier' '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '}' 
        |TIPO 'identifier' '(' ')' '{' LISTA_INSTRUCCIONES '}' 
        |'void' 'identifier' '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '}' 
        |'void' 'identifier' '(' ')' '{' LISTA_INSTRUCCIONES '}' 
        
        |'void' 'main' '(' PARAMETROS ')' '{' LISTA_INSTRUCCIONES '}' 
        | DECLARACION ';'
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
    |DECLARACION_ARREGLO ';'
    |SWITCH
    |FOR
    |WHILE
    |DO
    |STRUCT ';'
    | OPERACIONES_ARR
    | RETURN ';'
    | break ';'
    | increment_decrement ';'
;

// FUNCIONES PRINT
PRINT
    :'print' '(' LISTA_EXPRESION ')'
    |'println' '(' LISTA_EXPRESION ')'

// No Revisadoo
    |'printf' '(' LISTA_EXPRESION ')'
;

// 2, a, 2+2
LISTA_EXPRESION
    :LISTA_EXPRESION ',' EXPRESION
    |EXPRESION
;

DECLARACION:
    TIPO 'identifier' '=' EXPRESION 
    |TIPO LISTA_ID
;

// ID1, ID2, ID3
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
;

//Metodos y funciones
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
    |'if' '(' EXPRESION ')' ListaIns
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' '{' LISTA_INSTRUCCIONES '}'
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' IF
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' listaIns
    
//    // |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' ListaIns
    //   |'if' '(' EXPRESION ')' ListaIns  else ListaIns
  
 ;











FOR:
'for' 'identifier' 'in' EXPRESION '{' LISTA_INSTRUCCIONES '}'
| 'for' 'identifier' 'in' 'identifier' '[' 'digito' ':' 'digito' ']' '{' LISTA_INSTRUCCIONES '}'
| 'for' '(' TIPO 'identifier' '=' EXPRESION ';' EXPRESION ';' increment_decrement ')' '{' LISTA_INSTRUCCIONES '}'

;
RETURN :
'return' EXPRESION
;
//
OPERACIONES_ARR:
'identifier' '.' 'pop' '(' EXPRESION ')'
| 'identifier' '.' 'push' '(' EXPRESION ')'

;



STRUCT:
    'struct' 'identifier' '{' Lista_declaracion '}'
;

Lista_declaracion:
                Lista_declaracion ',' OPCION_DECLARACIO_Struct 'identifier' 
                |OPCION_DECLARACIO_Struct 'identifier' 
;


OPCION_DECLARACIO_Struct:
                        TIPO 
                        |'identifier'
;

DECLARACION_ARREGLO:
TIPO  '[' ']'  LISTA_ID '=' EXPRESION  
;






/*
lo voy a dejar asi con esa opcion de llave porque ptm no se  ambiguedad culera
*/




DO:
'do' '{'  LISTA_INSTRUCCIONES '}' 'while' '(' EXPRESION ')' ';'
;
WHILE:
'while' '('  EXPRESION ')' '{' LISTA_INSTRUCCIONES '}'
;

/*PUSE LISTAiNS2 PORQUE SINO TIRA AMBIGUEDAD POR EL IF */
SWITCH:
   'switch' '(' EXPRESION ')' '{'   caseList defaultList  '}' 
  | 'switch' '(' EXPRESION ')' '{'   caseList   '}'  
  |'switch' '(' EXPRESION ')' '{'    defaultlist  '}'  
  ;

caseList:
caseList 'case' EXPRESION ':' LISTA_INSTRUCCIONES
| 'case' EXPRESION ':' LISTA_INSTRUCCIONES
;
defaultList:
'default' ':' LISTA_INSTRUCCIONES
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
        
        //Fors
       

        //Llamar metodos y funciones
      |LLAMAR
      |'identifier'

       //manooooooooooooooooooooooooooooo 

        //Distintas funciones nativas
        |TIPO '.' 'parse' '(' EXPRESION ')'
        |'toInt' '(' EXPRESION  ')' 
        |'toDouble' '(' EXPRESION ')' 
        |'string' '(' EXPRESION ')' 
        |'typeof' '(' EXPRESION ')'         


        //NO REVISADAS
        |EXPRESION '#'
        |'['  LISTA_EXPRESION ']'
                   
          
     
          
        |'(' EXPRESION ')'   
          
        //NO REVISADAS
        |'identifier' '.' 'pop' '(' EXPRESION ')'
        
;
 
       
TIPO
    :double
    |String
    |int
    |boolean
    |char
;

increment_decrement:
        |'identifier' 'incremento'
        |'identifier' 'decremento'

;
