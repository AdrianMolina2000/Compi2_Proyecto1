Skip to content
Search or jump to…
Pull requests
Issues
Marketplace
Explore
 
@Juandi22001 
harias25
/
olc2-diciembre-2021
Public
Code
Issues
Pull requests
Actions
Projects
Wiki
Security
Insights
olc2-diciembre-2021/Proyecto 1/Archivos Entrada/graficar_ts.java /
@harias25
harias25 carga archivos finales
Latest commit 089b79d 2 days ago
 History
 1 contributor
70 lines (50 sloc)  1.06 KB
  
 /***************** GRAFICAR TS*******************/
    int x = 10;
    String y = "Hola compi2";
    boolean z = true;
    int[] arreglo = [1,2,3,4,5];
    boolean[] arreglo2 = [true, false];

struct t = {
    String nombre,
    int edad
};

struct x2 = {
    String personaje,
    boolean booleano
};

void main(){
   graficar_ts(); //Grafica sin hola

    int hola = 20;
    graficar_ts(); //Grafica con hola
    funcion1();
    funcion2(1, "2", true);
    funcion3();
    StructBasico();
    
}


void StructBasico(){
    t persona = persona("Calificacion",25);
    println(persona);

    persona.nombre = "Cambio";
    persona.edad = 40;

    println(persona);


    persona = null;
    println(persona);

}


void funcion1() {
    graficar_ts(); //Grafica global
}

void funcion2(int param1, String param2, boolean param3) {
    graficar_ts(); //Grafica global + 3 parametros
}

void funcion3(){
    int x = 10;
    int y = 10;
    int z = 20;
    graficar_ts();//Grafica global + 3 variables
}


/*
    5 tablas de simbolos
    "Calificacion", 25
    "Cambio", 40
    null
*/
© 


/*

===================================================== 
===========FUNCIONES RECURSIVAS====================== 
===================================================== 
 
==============FACTORIAL============================== 
1307674368000 
===============ACKERMAN============================== 
9 
===============HANOI================================= 
Mover de  1  a  3 
Mover de  1 a  3 
Mover de  3  a  3 
Mover de  1 a  3 
Mover de  3  a  3 
Mover de  3 a  3 
Mover de  3  a  3 
Mover de  1 a  3 
Mover de  2  a  3 
Mover de  2 a  3 
Mover de  3  a  3 
Mover de  2 a  3 
Mover de  2  a  3 
Mover de  2 a  3 
Mover de  2  a  3
*/