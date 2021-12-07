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
"/""/".*       {'comentarioUni'}
[/][*][^*/]*[*][/] {return 'comentario'}

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


INICIO : LISTA EOF {   console.log($$);return $$; } 
| comentario
| comentarioUni
;


LISTA:
LISTA 'cadena' {        $$=$1; $1.push($2); }
|'cadena' { $$ = [$1]; } 
;

