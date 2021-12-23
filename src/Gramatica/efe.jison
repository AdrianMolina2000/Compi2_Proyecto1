/*

int var1 = 10;
int var2 = 20;
double punteoBasicas = 0.0;
double declaracion, asignacion, aritmeticas, relacionales, logicas;

int dimension = 3;

void main(){
    double val1 = 0.0;
    double val2 = 0.0;
    double val3 = 0.0;
    double a = 0.0;
    double b = 0;

    println("El valor defecto de declacion es 0 = " & declaracion);
    println("El valor defecto de asignacion es 0 =" & asignacion & "y de aritmeticas 0 = " & aritmeticas);
    print("Probando ");
    println("Manejo de Entornos");


    int var1 = 5*5;
    println("El valor de var1 es" & var1);  //25
    
    var2 = 40;

    println("Declaraciones = "&declaracion);
    println("Asignaciones = "&asignacion);

    val1 = 7 - (5 + 10 * (20 / 5 - 2 + 4 * (5 + 2 * 3)) - 8 * 3 % 2) + 50 * (6 * 2); //142.0
    val2 = pow(2,4) - 9 * (8 - 6 * (pow(3,2) - 6 * 5 - 7 * (9 + pow(7,3)) + 10) - 5 ) + 8 * (36 / 6 - 5 * ( 2 * 3)); //-133853.0
    val3 = (pow(8,3) * pow(8,2) - sqrt(4) + tan(12) + sin(60) + 2) / 3; //10922.353109816746
    double val4 = val1 - val2 + val3; //El resultado es 144917.35310981676

    print(val1);
    print(val2);
    print(val3);
    print(val4);

    int resultado = toInt(val4);  //144917
    if(resultado == 144917){
        println("Aritmeticas 100");
        aritmeticas = 1;
    }

    String String_3;
    String String_4;
    int int2_;
 
    int2_ = 45;
    int2_ = int2_ - 1; 
    
    print(((2>5)<=(22==22))||((12>5)==(20>=19)));
    print((((200>52)<=(212==32))==((52>54)<=(22==22)))||((12>5)==(20>=19)));

    String String_5 = "Calificacion "^3; 
    String pruebasNativas = "ComPiLaDoReS2 TesT";

    println("Cadena 5" & " = " & String_5); //Calificacion Calificacion Calificacion 
    println(pruebasNativas.subString(0,12).toUppercase()&" "&pruebasNativas.caracterOfPosition(12)&" "&pruebasNativas.subString(14,pruebasNativas.length()).toLowercase());  // COMPILADORES 2 test
    }

*/