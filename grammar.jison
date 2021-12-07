%lex

%options case-sensitive
no  ([\"]*)
digito [0-9]+
decimal {digito}("."{digito})?
stringliteral (\"[^"]*\")
identifier ([a-zA-Z_])[a-zA-Z0-9_]*
referencia {identifier}("."{identifier})?
caracter (\'[^☼]\')
%%  

\s+ 
[ \t\r\n\f]   {}
\n                  {}                 
"/""/".*       {}
[/][*][^*/]*[*][/] {}

{digito}              return 'digito'
{decimal}             return 'decimal' 
{caracter}            return 'caracter'
{stringliteral}       return 'cadena'
{referencia}       return 'referencia'
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
"parse"              return 'parse'
"*"                   return '*'

"%"                   return '%'
"."                   return '.'
":"                   return ':'
";"                   return ';'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
","                   return ','
"++"                  return 'incremento'
"--"                  return 'decremento'
"*"                   return '*'
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
"null"                 return 'null'
"new"                 return 'new'
"void"                return 'void'
"main"                return 'main'
"false"               return 'false'
"print"               return 'print'
"println"             return 'println'
"printf"             return 'printf'
"if"                  return 'if'
"else"                return 'else'
"main"                return 'main'
"break"               return 'break'
"while"               return 'while'
"bool"                return 'bool'
"switch"              return 'switch'
"case"                return 'case'
"default"                return 'default'
"break"               return 'break'
"do"                  return 'do'
"return"              return 'return'


"struct"              return 'struct'
{identifier}          return 'identifier'

<<EOF>>	          return 'EOF'
/lex
%left 'else'
%left '||'
%left '&&'
%left '==', '!='
%left '>=', '<=', '<', '>'
%left '+' '-'
%left '*' '/'
%right '!'
%left UMENOS

%start INICIO

%%


INICIO : INSTRUCCIONES EOF {   console.log("ya");return $$; } ;

INSTRUCCIONES:INSTRUCCIONES INSTRUCCION { $1.push($2); $$ = $1;  }
              |INSTRUCCION    {$$ =[$1];}
              ;
//declaracion metodos
INSTRUCCION  : 'function' 'identifier' '(' PARAMETROS ')' '{'   ListaIns     '}' 
|  'void' 'identifier' '(' PARAMETROS ')' '{'   ListaIns     '}' 
|  'void' 'main' '(' PARAMETROS ')' '{'   ListaIns     '}' 
   



;
PARAMETROS:ListaIDS
|
;

ListaIDS  :
ListaIDS ',' 'identifier'
| 'identifier'






;

ListaIns:

 PRINT
 | IF
 | METODO_EXP
 | SWITCH
 | WHILE
 | DO
 | DECLARACION
 | ASIGNACION
 |DECLARACION_ARREGLO
 | STRUCT


;
ListaIns2:

 PRINT
 
 | METODO_EXP
 | SWITCH
 | WHILE
 | DO
 | DECLARACION  ';' 
 | ASIGNACION
 | DECLARACION_ARREGLO
 | STRUCT
;
DECLARACION:
TIPO ListaIDS OPCION_ASIGNACION

;
OPCION_ASIGNACION:
'=' EXPRESION 
| 
;
STRUCT:
'struct' 'identifier' '{' '}'

;

Lista_declaracion:
Lista_declaracion  DECLARACION
| DECLARACION ';'


;
DECLARACION_ARREGLO:
TIPO  '[' ']'  ListaIDS '=' EXPRESION  ';' 
/*
struct Rectangulo{
    int base,
    int altura
};
*/

;

ASIGNACION:
'identifier' '='  EXPRESION
;
IF: 'if' '(' EXPRESION ')' '{'  ListaIns '}'

| 'if' '(' EXPRESION ')'   ListaIns 
|'if' '(' EXPRESION ')' '{'  ListaIns '}' 'else'  '{'  ListaIns '}'
| 'if' '(' EXPRESION ')' '{'  ListaIns '}' 'else' IF
| 'if' '(' EXPRESION ')' '{'  ListaIns '}' 'else'  ListaIns2


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
PRINT:  'print'  '(' EXPRESION ')' ';'
| 'println'  '(' EXPRESION ')' ';'
| 'printf' '(' EXPRESION_F ')' ';'
;
 EXPRESION_F :  EXPRESION ',' EXPRESION 




;
LISTA_EXPRESION:
LISTA_EXPRESION ',' EXPRESION
|EXPRESION
;
EXPRESION :  '-' EXPRESION %prec UMENOS	     

          | '!' EXPRESION	     
           
          |'['  EXPRESION ']'
  
          | EXPRESION '+' EXPRESION      

          | EXPRESION '-' EXPRESION    
          | EXPRESION '*' EXPRESION    
          | EXPRESION '/' EXPRESION    
          
         
          | EXPRESION '<' EXPRESION    
          | EXPRESION '>' EXPRESION   
          | EXPRESION '>=' EXPRESION    
          | EXPRESION '<=' EXPRESION   
          | EXPRESION '==' EXPRESION   
          | EXPRESION '!=' EXPRESION   
          | EXPRESION '||' EXPRESION  
         
          | EXPRESION '&&' EXPRESION  
          |NATIVAS_DISTINTAS
          | NATIVAS
          | METODO_EXP  
          
          |'(' EXPRESION ')'   
          |'decimal'    
         
          |'true'    
          |'false'    
          |'cadena'  
          |'null'   
             
          |'digito'    
          |'caracter'  
          | 'stringliteral' 
          | referencia
          | CONVERT
          | 'caracterOfPosition' '(' EXPRESION  ')'
          | 'subString' '(' EXPRESION  ')'
          | 'lenght' '('   ')'
          | 'toUppercase' '(' EXPRESION  ')'
          | 'toLowercase'  '(' EXPRESION  ')' 
          | identifier 'incremento'
          | identifier 'decremento'
      
       
        


          
        

          ;

CONVERT:
         'toInt'  '(' EXPRESION  ')' 
          | 'toDouble'  '(' EXPRESION  ')' 
          | 'String'  '(' EXPRESION  ')' 
          | 'typeof'  '(' EXPRESION  ')'         

;          

NATIVAS:
           'sin' '(' EXPRESION ')'
          | 'cos' '(' EXPRESION ')'
          | 'tan' '(' EXPRESION ')'
          | 'sqrt' '(' EXPRESION ')'
          | 'pow' '(' digito ',' 'digito'  ')'

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

