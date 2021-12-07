%lex

%options case-sensitive
no  ([\"]*)
digito [0-9]+
decimal {digito}("."{digito})?
stringliteral (\"[^"]*\")
identifier ([a-zA-Z_])[a-zA-Z0-9_]*

caracter (\'[^☼]\')
%%  

\s+ 
[ \t\r\n\f]         {}
\n                  {}                 
"/""/".*            {}
[/][*][^*/]*[*][/]  {}

{digito}              return 'digito'
{decimal}             return 'decimal' 
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
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
","                   return ','
"++"                  return 'incremento'
"--"                  return 'decremento'
"*"                   return '*'
"#"                   return '#'
"<"                   return '<'
">"                   return '>'
"<="                  return '<='
">="                  return '>='
"=="                  return '=='
"!="                  return '!='
"||"                  return '||'
"&&"                  return '&&'
"!"                   return '!'
"="                   return '='
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
"for"                  return 'for'
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
"pop"                  return 'pop'
"push"              return 'push'



"struct"              return 'struct'
{identifier}          return 'identifier'

<<EOF>>	              return 'EOF'
/lex
%left 'else'
%left '||'
%left '&&' ,'&','^','#','?'
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
            :INSTRUCCIONES INSTRUCCION  {$1.push($2); $$ = $1;}
            |INSTRUCCION                {$$ =[$1];}
;

//declaracion metodos
INSTRUCCION  
        :'function' 'identifier' '(' PARAMETROS ')' '{' ListaIns '}' 
        |'void' 'identifier' '(' PARAMETROS ')' '{' ListaIns '}' 
        |'void' 'main' '(' PARAMETROS ')' '{' ListaIns '}' 
;


PARAMETROS
        :ListaIDS
        |
;

ListaIDS
    :ListaIDS ',' 'identifier'
    |'identifier'
;

ListaIDSpto
    :ListaIDSpto '.' 'identifier'
    |'identifier'
;

ListaIns
    :PRINT
    |IF
    |METODO_EXP
    |SWITCH
    |FOR
    |WHILE
    |DO
    |DECLARACION ';'
    |ASIGNACION ';' 
    |DECLARACION_ARREGLO ';'
    |STRUCT ';'
    | OPERACIONES_ARR
    | RETURN ';'
    
    
;
FOR:
'for' 'identifier' 'in' EXPRESION '{' ListaIns '}'
| 'for' 'identifier' 'in' 'identifier' '[' 'digito' ':' 'digito' ']' '{' ListaIns '}'
| 'for' '(' TIPO 'identifier' '=' EXPRESION ';' EXPRESION ';' EXPRESION ')' '{' ListaIns '}'

;
RETURN :
'return' EXPRESION
;
OPERACIONES_ARR:
'identifier' '.' 'pop' '(' EXPRESION ')'
| 'identifier' '.' 'push' '(' EXPRESION ')'

;

DECLARACION:
    TIPO ListaIDS OPCION_ASIGNACION
;


OPCION_ASIGNACION:
'=' EXPRESION 
| 
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
TIPO  '[' ']'  ListaIDS '=' EXPRESION  ';' 
;

ASIGNACION:
'identifier' '='  EXPRESION
LListaIDSpto '='  EXPRESION
;



IF
    :'if' '(' EXPRESION ')' '{'  ListaIns '}'
    |'if' '(' EXPRESION ')' ListaIns 
    |'if' '(' EXPRESION ')' '{' ListaIns '}' 'else' '{' ListaIns '}'
    |'if' '(' EXPRESION ')' '{' ListaIns '}' 'else' ListaIns
;

DO:
'do' '{'  ListaIns'}' 'while' '(' EXPRESION ')' ';'
;
WHILE:
'while' '('  EXPRESION ')' '{' ListaIns '}'
;

/*PUSE LISTAiNS2 PORQUE SINO TIRA AMBIGUEDAD POR EL IF */
SWITCH:
   'switch' '(' EXPRESION ')' '{'   caseList defaultList  '}' 
  | 'switch' '(' EXPRESION ')' '{'   caseList   '}'  
  |'switch' '(' EXPRESION ')' '{'    defaultlist  '}'  
  ;

caseList:
caseList 'case' EXPRESION ':' ListaIns
| 'case' EXPRESION ':' ListaIns
;
defaultList:
'default' ':' ListaIns
;
PRINT:  'print'  '(' LISTA_EXPRESION ')' ';'
| 'println'  '(' LISTA_EXPRESION ')' ';'
| 'printf' '(' LISTA_EXPRESION ')' ';'
;






LISTA_EXPRESION:
LISTA_EXPRESION ',' EXPRESION
|EXPRESION
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
        |EXPRESION '>' EXPRESION   
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
        |'digito'    
        |'decimal'  
        |'true'    
        |'false'    
        |'caracter'  
        |'cadena'  
        
        //Fors
        |'identifier' 'incremento'
        |'identifier' 'decremento'




        |EXPRESION '#'
        |'['  LISTA_EXPRESION ']'
                   
          
        |NATIVAS_DISTINTAS
     
        | METODO_EXP  
          
        |'(' EXPRESION ')'   
          
       
        | CONVERT
    

;
 
       
        





CONVERT:
         'toInt'  '(' EXPRESION  ')' 
          | 'toDouble'  '(' EXPRESION  ')' 
          | 'String'  '(' EXPRESION  ')' 
          | 'typeof'  '(' EXPRESION  ')'         

;          

NATIVAS_DISTINTAS :
TIPO '.' 'parse' '(' EXPRESION')'

;

 METODO_EXP:

   'identifier' '('L_exp  ')'
  |'identifier' '(' ')'
  |'identifier' 
 

  ;        

L_exp: L_exp ','  EXPRESION
  |EXPRESION
  ;



TIPO:
double
|String
|int
|boolean
|char
;
