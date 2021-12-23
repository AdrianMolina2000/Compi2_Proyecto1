# Quetzal OCL2

## Organización de Lenguajes y compiladores 2

## Manual Tecnico
## Recorrer Instrucciones
####  Este  mapeo , es de suma importancia para que el programa corra  como tal ,porque lo que hara este programa es recorrer todas las instrucciones que el usuario  quiera ejecutar.
 ![efe](https://github.com/Juandi22001/Predicas/blob/master/images_compi/tecnico1.JPG?raw=true)
---
## Clase Abstracta Nodo
 ####  Esta clase abstracta ,  es quiza la mas importante de todo del proyecto  ya que  este contiene 3 metodos abstracos que son de suma importancia , para el desarollo del proyecto  estos son:
    GetNodo(),execute(),get3d()
 
 ![efe](https://github.com/Juandi22001/Predicas/blob/master/images_compi/tecnico2.JPG?raw=true)
---
## Clase Declaracion 
 ####  En esta clase  es utilizada para la creación de variables   es decir que en esta clase , todas las variables que el analizador vaya reconociendo   poco  a poco y asi este las metera directamente en la tabla de simbolos.
  
 
 ![efe](https://github.com/Juandi22001/Predicas/blob/master/images_compi/tecnico4.JPG?raw=true)




---
## Clase Simbols 
 ####  La clase Simbols es de suma importancia para el proyecto , ya que en esta clase es donde se basa practicamente la tabla de simbolos   ya que en esta clase estan contenido todos los parametros nescesarios para la creación de dicha tabla .
 
 ![efe](https://github.com/Juandi22001/Predicas/blob/master/images_compi/tecnico4.JPG?raw=true)





---
## Clase Main 
 ####  En esta clase, basicamente lo que se hace es ir recorriendo cada instruccion que este contenida en el metodo main y recorrerla y asi   aplicar su metodo execute() 
 
 ![efe](https://github.com/Juandi22001/Predicas/blob/master/images_compi/tecnico5.JPG?raw=true)





---
## Clase Exepcion 
 ####  La clase exepcion es similar a la de simbols solo que esta  clase  fue implementada  para poder crear todos los errores ya sean semanticos , lexicos o sintacticos.
 
 ![efe](https://github.com/Juandi22001/Predicas/blob/master/images_compi/tecnico6.JPG?raw=true)



---
## Clase tipos 
 ####  En esta clase ,  estan contenidos todos los tipos  de valores que  existen en el  proyecto. Entre ellos estan :
    ENTERO,DECIMAL,NUMERO,CARACTER, STRING,BOOLEANO,ARREGLO,VOID,METODO,FUNCION,VARIABLE,STRUCTS,NULO
 
 ![efe](https://github.com/Juandi22001/Predicas/blob/master/images_compi/tecnico7.JPG?raw=true)



---

## Funcion  Graph Simbols
 ####  Esta función   lo unico que  hace es crear un objeto HTML para   luego mostrar la tabla de simbolos en formato HTML 
 
 ![efe](https://github.com/Juandi22001/Predicas/blob/master/images_compi/tecnico8.JPG?raw=true)



---

## Clase Nodo AST
 #### Esta clase fue implementada , para poder crear el  arbol AST  , ya que en esta clase estan contenido todo lo nescesario para la creación del mismo . 
 
 ![efe](https://github.com/Juandi22001/Predicas/blob/master/images_compi/tecnico9.JPG?raw=true)



---
## Gramatica
#### Se hizo uso de una gramatica ascendente en este proyecto dicha gramatica es presentada acontinuación 

---


    INICIO : INSTRUCCIONES EOF 
   


    
    INSTRUCCIONES
    INSTRUCCIONES INSTRUCCION  
    |INSTRUCCION                
            
    INSTRUCCION  
    :TIPO 'identifier' '(' Verificar_params ')' '{' LISTA_INSTRUCCIONES '}'    
    
    
    


    |   TIPO  'main'  '(' Verificar_params ')' 
    |DECLARACION ';'                                                            {$$ = $1;
    
    | TIPO  
    |llamada


    



    |PRINT
    | STRUCT 

    | error 



    Verificar_params
    :PARAMETROS    
    
    }
    |             
    
    
    }


    PARAMETROS
    :PARAMETROS ',' OPCION_PARAMETROS   
    
    }
    |OPCION_PARAMETROS           


    OPCION_PARAMETROS:
    TIPO 'identifier'   
    |TIPO  '[' ']' 'identifier'  
    | 'identifier'  'identifier' 




    LISTA_INSTRUCCIONES
    :LISTA_INSTRUCCIONES ListaIns   
    |ListaIns                   
    


    llamada
    :llamar ';'                        
    }


    llamar
    :'identifier' '(' parametros_llamada ')'    
    }
    |'identifier' '(' ')'                       
    
    }

    |'graficar_ts' '(' ')'


    parametros_llamada
    :parametros_llamada ',' EXPRESION  
    
    }
    |EXPRESION                          
    
    }


    ListaIns
    :PRINT ';'                                 
    
    
    
    }    
    |DECLARACION ';'                       
    
    
    }
    |ASIGNACION ';'                       
    
    }
    |IF                                
    }  
    |SWITCH                            
    
    }  
    |'break' ';'                        ");
    
    }
    |WHILE                           
    
    }  
    |DO ';'                  
    
    }  
    |FOR       
    
    }
    |'identifier' 'decremento' ';'              


    
    
    
    }
    |'identifier' 'incremento' ';'             
    
    }
    | RETURN ';'                               
    
    
   
    
    }  
    |'identifier' '.' 'pop' '(' ')'     ';'       
    
    } 
    |'identifier' '.' 'push' '(' EXPRESION ')' ';' 
    
    
    } 
    |STRUCT ';'                                 
    
    }  
    |'continue' ';'                           
    }
    |llamada                                 
    
    }
    | error 




ListaIns2
    :PRINT ';'                                 
    
    
    
    
    }    
    |DECLARACION ';'                          
    
    
    }
    |ASIGNACION ';'                            
    }
  
    |SWITCH                                 
    
    }  
    |'break' ';'                              
    
    }
    |WHILE                               
    
    }  
    |DO ';'                                  
    }  
    |FOR        
    
    }
    |'identifier' 'decremento' ';'             

    
    
    
    }
    |'identifier' 'incremento' ';'             
    
    }
    | RETURN ';'                               
    
    }  
    |'identifier' '.' 'pop' '(' ')'       ';'     
    
    } 
    |'identifier' '.' 'push' '(' EXPRESION ')' ';' 
    
    } 
    |STRUCT ';'                                  
    |'continue' ';'                             
    }
    |llamada                                
    
    }
         | error

;


PRINT
    :'print' '(' LISTA_EXPRESION ')'   
    
    }
    |'println' '(' LISTA_EXPRESION ')'  


     }
    |'printf' '(' LISTA_EXPRESION ')'
;

LISTA_EXPRESION
    :LISTA_EXPRESION ',' EXPRESION     
    
    }
    |EXPRESION                          
;


DECLARACION
    :TIPO 'identifier' '=' EXPRESION          
    |TIPO LISTA_ID                          
    
    |TIPO '[' ']' 'identifier' '=' EXPRESION   
    
    |TIPO '[' ']' 'identifier'                

    
    |'identifier' 'identifier' '=' llamar       
    
    
;

LISTA_ID
    :LISTA_ID ',' 'identifier'     
    
    
    |'identifier'                   
    }
;

ASIGNACION
    
    :'identifier' '=' EXPRESION   
    
    
    
    }
    |'identifier' '.' LISTA_EXPRESION_PTO '=' EXPRESION 
    
    }
    |'identifier' '[' EXPRESION ']' '=' EXPRESION  
    
    } 
;



  LISTA_EXPRESION_PTO:
  LISTA_EXPRESION_PTO OPCION_PTO    
  
  
  }
    | OPCION_PTO                   
    }
  
  ;  
  OPCION_PTO
  :'.' 'identifier'                ;
  
  
  }
  |'identifier'                    
  }
  |'identifier' '[' EXPRESION']'  
  
  
  
  ;

PARAMETROS_LLAMADA
    :PARAMETROS_LLAMADA ',' EXPRESION    
    
    
    
    } 
    |EXPRESION                            
    
    
    };

IF
    :'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}'                                 
    
    
    }
    |'if' '(' EXPRESION ')' ListaIns2                                                      
    }
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' '{' LISTA_INSTRUCCIONES '}' 
    
    }
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' IF                          
    
    }
    |'if' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}' 'else' ListaIns2                    
    }
    |'if' '(' EXPRESION ')' ListaIns2 'else' ListaIns2                                     
    
    
    }
;

SWITCH  
    :'switch' '(' EXPRESION ')' '{' CASE_LIST DEFAULT_LIST '}'    
    
    
    }
    |'switch' '(' EXPRESION ')' '{' CASE_LIST '}'                
    
    }
    |'switch' '(' EXPRESION ')' '{' DEFAULT_LIST '}'              
    }
;

CASE_LIST
    :CASE_LIST 'case' EXPRESION ':' LISTA_INSTRUCCIONES            
    }
    
    }
    |'case' EXPRESION ':' LISTA_INSTRUCCIONES                      
    
    }
;

DEFAULT_LIST
    :'default' ':' LISTA_INSTRUCCIONES      
;

WHILE
    :'while' '(' EXPRESION ')' '{' LISTA_INSTRUCCIONES '}'        
    
;

DO
    :'do' '{'  LISTA_INSTRUCCIONES '}' 'while' '(' EXPRESION ')'   
    
    
    
    }
;

FOR
    :'for' forIn 'in' EXPRESION '{' LISTA_INSTRUCCIONES '}'                            
    
    }
    |'for' '(' forVar ';' EXPRESION ';' for_increment ')' '{' LISTA_INSTRUCCIONES '}'   
    
    
    
    }
;

forIn
    :'identifier'                     
    }
;


forVar
    :TIPO 'identifier' '=' EXPRESION    
    
    }
    |'identifier' '=' EXPRESION      
;

for_increment
    :'identifier' 'incremento' 	        
    
    }   					    
	|'identifier' 'decremento'         
    
    }
    |'identifier' '=' EXPRESION        
    }        	 
;

RETURN 
    :'return' EXPRESION       
    
    }
    |'return'                 
    }
;

STRUCT
    :'struct' 'identifier' '{' Lista_declaracion '}'   
    
    } 
;

Lista_declaracion
                :Lista_declaracion ',' OPCION_DECLARACIO_Struct     
                
                }
                |OPCION_DECLARACIO_Struct                     

OPCION_DECLARACIO_Struct
                        :TIPO 'identifier'             
                         
                        }
                        |'identifier'  'identifier'    
                        
                        }
                        | TIPO  '[' ']' 'identifier'   
                        
                        }
;

EXPRESION 
        //Aritmeticas
        :'-' EXPRESION %prec UMENOS     
        
        }	    
        |EXPRESION '+' EXPRESION       
        
        }	
        |EXPRESION '-' EXPRESION       
        |EXPRESION '*' EXPRESION       
        }	
        |EXPRESION '/' EXPRESION       
        
        }	
        |EXPRESION '%' EXPRESION        
        
        }	
        
         
        //Nativas Aritmeticas
        |'sin'  '(' EXPRESION ')'                
        
        
        }
        |'cos' '(' EXPRESION ')'                    
        
        
        }
        |'tan' '(' EXPRESION ')'                   
        }
        |'pow' '(' EXPRESION ',' 'EXPRESION' ')'   
        
        }
        |'sqrt' '(' EXPRESION ')'              
        


        //Relacionales
        |EXPRESION '==' EXPRESION      
        
        
        |EXPRESION '!=' EXPRESION       
        
        
        
        |EXPRESION '>=' EXPRESION      
        
        |EXPRESION '>'  EXPRESION      
        }
        |EXPRESION '<=' EXPRESION    
        
        }	
        |EXPRESION '<'  EXPRESION      
        }	 
        
        //Logicas
        |'!' EXPRESION	                
        
        }	
        |EXPRESION '&&' EXPRESION      
        }
        |EXPRESION '||' EXPRESION      
        
        
        }

        //Cadenas
        |EXPRESION '&' EXPRESION        
        
        }
        |EXPRESION '^' EXPRESION      
        
        
        }
        
        //Operador Ternario
        |EXPRESION '?' EXPRESION ':' EXPRESION  
        
        
        }




        //Primitivos
       
        |'numero'                                              
        
        
         |'null'                                               
        
        
        |'true'                                                
        
        |'false'                                            
        
        
        |'caracter'                                           
        
        
        |'cadena'                                               
        
        
        }
        |EXPRESION '.' 'toLowercase' '(' ')'                    
        }  
        |EXPRESION '.' 'toUppercase' '(' ')'                  
        
        } 
        |EXPRESION '.' 'length' '(' ')'                         
        }
        |EXPRESION '.'  'caracterOfPosition' '(' 'EXPRESION' ')'  
        }
        |EXPRESION '.'  'subString' '(' EXPRESION ',' EXPRESION ')'  
        
        
        }
        
        //Llamar metodos y funciones
        |llamar
        |'[' LISTA_EXPRESION ']'                               
        
        
        }
         |'['  ']'                               
        
        
        }
        |'identifier' '[' EXPRESION ']'                         
        
        
        }
        |'identifier' '[' EXPRESION ':' EXPRESION ']' 
        | EXPRESION '#'
        |'(' EXPRESION ')'                                   
        }
        // |'identifier' '.' 'identifier'
        
      
        //Distintas funciones nativas
        |TIPO '.' 'parse' '(' EXPRESION ')'    
        
        }
        |'toInt' '(' EXPRESION  ')'             
        }
        |'toDouble' '(' EXPRESION ')'         
        }
        |'string' '(' EXPRESION ')'           
        
        }
        |'typeof' '(' EXPRESION ')'            
        
        }
        |'log10'  '(' EXPRESION ')'             
        |'identifier'                          
        |EXPRESION  LISTA_EXPRESION_PTO2       
        
        
        }
//int a = id.id.id  
;
  LISTA_EXPRESION_PTO2
    :LISTA_EXPRESION_PTO2 '.' OPCION_PTO2   STA_EXPRESION_PTO2.push(OPCION_PTO.val)");
    
    }
    |'.' OPCION_PTO2                 
;  

OPCION_PTO2:    
    |'identifier'                    
    
    }
    |'identifier' '[' EXPRESION']'    
    }

  
  
  
  ;
TIPO
    :double    
    }
    |String    
    
    }
    |int       
    }
    |boolean  
    }
    |char      
    }
    |void      
    }
;

---


 



