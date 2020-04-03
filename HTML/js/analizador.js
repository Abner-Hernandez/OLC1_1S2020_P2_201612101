var errores_lexicos = [];
var list = [];
var tabs = [];
var aux_sen = [];
var type_data = ["int", "double", "char", "bool", "string"];
var traduccion = "";
var aux_traduccion = "";
var panic_mode_var = false;

//Prueba
//lexer_analize("int dvar_1,dsi, dswq = + 5 * - 3 + 6; °");
//print_all_elements(errores_lexicos[0].lexema);
//print_all_elements(list);
//parser();


function print_word(word)
{
	document.write("<b>" + word + "</b><br><br>");
}

// analisis lexico
function lexer_analize()
{
    var entry = document.getElementById("traducir").value;
    var row = 0;
    var column = 0;
    var size_entry = entry.length;
    var letters = "azAZ";
    var num_a = letters.charCodeAt(0);
    var num_z = letters.charCodeAt(1);
    var num_A = letters.charCodeAt(2);
    var num_Z = letters.charCodeAt(3);
    var bool_id = false;
    var numero = false;
    var commentary;

    //Set defaults vars
    errores_lexicos = [];
    list = [];
    tabs = [];
    aux_sen = [];
    traduccion = "";
    aux_traduccion = "";
    panic_mode_var = false;

    var id = "";
    
    for(var i = 0; i < entry.length; i++)
    {
        var initial = i;
        if(entry.charAt(i) == ' ')
        {
            if(bool_id || numero)
            {
                bool_id = false;
                numero = false
                id = "id".concat(id);
                id = id.concat("id");    
                list.push(id);
                id = "";
            }
        	i++;
        }
        
        //buscar simbolos unarios
        switch (entry.charAt(i)) 
        {
            case ';':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push(id);
                    id = "";
                }
                list.push(";");
                i++;
                break;
            case ':':
                list.push(":");
                i++;
                break;
            case '{':
                list.push("{");
                i++;
                break;
            case ',':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push(id);
                    id = "";
                }
                list.push(",");
                i++;
                break;
            case '}':
                list.push("}");
                i++;
                break;
            case '(':
                list.push("(");
                i++;
                break;
            case ')':
                list.push(")");
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                   
                    list.push(id);
                    id = "";
                }
            	i++;
                break;
            case '=':
                if(compare_string(entry.substr(i, size_entry), "=="))
                {
                    list.push("==");
                    i = i + 2;
                    column = column +2;
                }
                else
                {
                    list.push("=");
                    i++;
                }
                break;
            case '+':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push(id);
                    id = "";
                }
                if(compare_string(entry.substr(i, size_entry), "++"))
                {
                    list.push("++");
                    i = i + 2;
                }
                else
                {
                    list.push("+");
                    i++
                }
                break;
            case '-':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push(id);
                    id = "";
                }
                if(compare_string(entry.substr(i, size_entry), "--"))
                {
                    list.push("--");
                    i = i + 2;
                }
                else
                {
                    list.push("-");
                    i++
                }                break;
            case '*':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push(id);
                    id = "";
                }
                list.push("*");
                i++;
                break;
            case '/':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push(id);
                    id = "";
                }
                //busca comentarios
                if(compare_string(entry.substr(i, size_entry), "//"))
                {
                    commentary = "#";
                    for(var j = i ; j < size_entry ; j++)
                    {
                        if(compare_string(entry.substr(j, size_entry), "\r\n"))
                        {
                            row++;
                            column = 0;
                            i = j+2;
                            break;
                        }
                        commentary = commentary.concat(entry.charAt(j));
                    }
                    list.push(commentary);
                }else if(compare_string(entry.substr(i, size_entry), "/*"))
                {
                    commentary = "\"\"\"";
                    for(var j = i ; j < size_entry ; j++)
                    {
                        if(compare_string(entry.substr(j, size_entry), "\r\n"))
                        {
                            row++;
                            column = 0;
                            i = i + 2;
                        }else if(compare_string(entry.substr(j, size_entry), "*/"))
                        {
                            i = j + 2;
                            break;
                        }
                        commentary = commentary.concat(entry.charAt(j));
                    }
                    commentary = "\"\"\"";
                    list.push(commentary);
                }
                //cadena distinta de comentario
                else
                {
                    list.push("/");
                    i++;
                }
            break;
            case 'f':
                if(compare_string(entry.substr(i, size_entry), "for"))
                {
                    list.push("for");
                    i = i + 3;
                }
                break;
            case 'i':
                if(compare_string(entry.substr(i, size_entry), "int"))
                {
                    list.push("int");
                    i = i + 3;
                }else if(compare_string(entry.substr(i, size_entry), "if"))
                {
                    list.push("if");
                    i = i + 3;
                }
                break;
            case 'e':
                if(compare_string(entry.substr(i, size_entry), "else"))
                {
                    list.push("else");
                    i = i + 4;
                }
                break;
            case 'v':
                if(compare_string(entry.substr(i, size_entry), "void"))
                {
                    list.push("void");
                    i = i + 4;
                }
                break;
            case 's':
                if(compare_string(entry.substr(i, size_entry), "switch"))
                {
                    list.push("switch");
                    i = i + 6;
                }else if(compare_string(entry.substr(i, size_entry), "string"))
                {
                    list.push("string");
                    i = i + 6;
                }
                break;
            case 'c':
                if(compare_string(entry.substr(i, size_entry), "case"))
                {
                    list.push("case");
                    i = i + 4;
                }else if(compare_string(entry.substr(i, size_entry), "char"))
                {
                    list.push("char");
                    i = i + 4;
                }else if(compare_string(entry.substr(i, size_entry), "Console.Write"))
                {
                    list.push("Console.Write");
                    i = i + 13;
                }else if(compare_string(entry.substr(i, size_entry), "continue"))
                {
                    list.push("continue");
                    i = i + 8;
                }
                break;
            case 'w':
                if(compare_string(entry.substr(i, size_entry), "while"))
                {
                    list.push("while");
                    i = i + 5;
                }
                break;
            case 'r':
                if(compare_string(entry.substr(i, size_entry), "return"))
                {
                    list.push("return");
                    i = i + 6;
                }
                break;
            case 'b':
                if(compare_string(entry.substr(i, size_entry), "break"))
                {
                    list.push("break");
                    i = i + 5;
                }else if(compare_string(entry.substr(i, size_entry), "bool"))
                {
                    list.push("bool");
                    i = i + 4;
                }
                break;
            case '&':
                if(compare_string(entry.substr(i, size_entry), "&&"))
                {
                    list.push("&&");
                    i = i + 2;
                }
                break;
            case '&':
                if(compare_string(entry.substr(i, size_entry), "||"))
                {
                    list.push("return");
                    i = i + 6;
                }
                break;
            case '!':
                if(compare_string(entry.substr(i, size_entry), "!="))
                {
                    list.push("!=");
                    i = i + 2;
                }else
                {
                    list.push("!");
                    i++;
                }
                break;
            case '"':
                if(compare_string(entry.substr(i, size_entry), "<="))
                {
                    list.push("<=");
                    i = i + 2;
                }else
                    list.push("<");
                break;
            case '"':
                if(compare_string(entry.substr(i, size_entry), ">="))
                {
                    list.push(">=");
                    i = i + 2;
                }else
                    list.push(">");
                break;
            case 'd':
                if(compare_string(entry.substr(i, size_entry), "double"))
                {
                    list.push("double");
                    i = i + 6;
                }else if(compare_string(entry.substr(i, size_entry), "default"))
                {
                    list.push("default");
                    i = i + 7;
                }
                break;
            case 'm':
                if(compare_string(entry.substr(i, size_entry), "main"))
                {
                    list.push("main");
                    i = i + 4;
                }
                break;
            }

            if(initial == i)
            {
                var ac = entry.charAt(i); // caracter actual
                if(ac.charCodeAt(0) >= num_a && ac.charCodeAt(0) <= num_z && numero == false)
                {
                    bool_id = true;
                    id = id.concat(entry.charAt(i));
                    
                }else if(ac.charCodeAt(0) >= num_A && ac.charCodeAt(0) <= num_Z && numero == false)
                {
                    bool_id = true;
                    id = id.concat(entry.charAt(i));

                }else if(ac >= 0 && ac <= 9)
                {
                    if(numero == false && bool_id == false)
                        numero = true;

                    id = id.concat(entry.charAt(i));
                }else if(ac == "_" && numero == false)
                {
                    bool_id = true;
                    id = id.concat(entry.charAt(i));

                }else
                {
                    var new_lex_error = {lexema: ac, fila: row, columna: column};
                    errores_lexicos.push(new_lex_error);
                }
                column++;
            }else
            {
                column = column + (i -initial) + 1;
                i--;
            }
    }
    parser();
}

//comparar cadenas
function compare_string(org, cmp)
{
    if(org.length < cmp.length)
        return false;
    else if(org.substr(0, cmp.length) == cmp)
        return true;
}

//analisis sintactico
function parser()
{
    //select method
    //verificar asignacion o funcion
    if(verificate_type(list[0]) && panic_mode_var == false)
    {
    	if(list[2] == "=" || list[2] == ";" || list[2] == ",")
        {
            analice_declaration();
            if(panic_mode_var)
                continue;
            //print_word(aux_traduccion);
            for(var i = 0 ; i < tabs.length ; i++)
            {
                add_tabs(aux_traduccion);
            }
            concat_traduccion(aux_traduccion);
            aux_traduccion = "";
            document.getElementById("traducido").value = traduccion;
        }
    }
    
}

//function para analizar una asignacion
function analice_declaration()
{
    list.shift();
    var list_vars = [];

    for(var i = 0 ; i < list.length ; i++)
    {
        var next = list.shift();
        i = -1;
        if(verificate_id(next))
        {

            if(next.charAt(0) >= 0 && next.charAt(0) <= 9)
            {
                //Es un numero no identificador
                panic_mode_var = true;
                return;
            }

        	next = get_id(next);
            list_vars.push(next)
            var next2 = list.shift();
            if(compare_string(next2, ";"))
            {
                //fin assignacion
                for(var j = 0; j < list_vars.length; j++)
                {
                    concat_traduccion_aux("\r\nvar ");
                    concat_traduccion_aux(list_vars.shift());
                    j = -1;
                }
                return;
            }
            else if(compare_string(next2, ","))
            {
                continue;
            }
            else if(compare_string(next2, "="))
            {
                //asignar
                var number = get_unario_number();
                if(panic_mode_var)
                    return;
                var next = list.shift();
                if(compare_string(next, ";"))
                {
                    //concatenar number asignado
                    for(var j = 0; j < list_vars.length; j++)
                    {
                        concat_traduccion_aux("\r\nvar ");
                        concat_traduccion_aux(list_vars.shift());
                        concat_traduccion_aux(" = ");
                        concat_traduccion_aux(number);    
                        j = -1;                        
                    }
                    return;
                }else
                {
                    list.unshift(next);
                    set_unario_number(number);
                    
                    //llamar a operacion
                    var description = verificate_operation();

                    if(panic_mode_var)
                        return;
                        
                    for(var j = 0; j < list_vars.length; j++)
                    {
                        concat_traduccion_aux("\r\nvar ");
                        concat_traduccion_aux(list_vars.shift());
                        concat_traduccion_aux(" = ");
                        concat_traduccion_aux(description);
                        j = -1; 
                    }
                    return;
                }
            }
        }else
        {
            panic_mode_var = true;
            return;
        }
        
    }

}

//funcion analizar operacion
function verificate_operation()
{
    var description = "";
    
    for(var i = 0 ; i < list.length ; i++)
    {
        var number = get_unario_number();
        description = description.concat(number);
        var operator = list.shift();
        
        if(operator.charAt(0) == "+" || operator.charAt(0) == "-" || operator.charAt(0) == "*" ||operator.charAt(0) == "/")
        {
            description = description.concat(operator);
            var number2 = get_unario_number();
            if(panic_mode_var)
                return;
            set_unario_number(number2);
            i = 0;
            continue;

        }else if(operator.charAt(0) == ";")
        {
            return description;
        }
    }

}

function concat_traduccion(element)
{
    traduccion = traduccion.concat(element);
}

function concat_traduccion_aux(element)
{
    aux_traduccion = aux_traduccion.concat(element);
}

function verificate_id(actual_id)
{
	if(actual_id.length < 5)
		return false;
	if(actual_id.substr(0,2) == "id" && actual_id.substr(actual_id.length-2, 2) == "id")
    	return true;
}

function get_id(actual_id)
{
	if(actual_id.length < 5)
		return false;
	if(actual_id.substr(0,2) == "id" && actual_id.substr(actual_id.length-2, 2) == "id")
    	return actual_id.substr(2, actual_id.length-4);
}

function panic_mode()
{

}

function get_unario_number()
{
    var simbol = list.shift();
    if(simbol == "+" || simbol == "-")
    {
        var number = list.shift();
        if(verificate_id(number))
        {
        	number = get_id(number);
            simbol = simbol.concat(number);
            return simbol;
        }else
        {
            panic_mode_var = true;
            return;
        }
    }else if(verificate_id(simbol))
        return get_id(simbol);
    else
    {
        panic_mode_var = true;
        return;
    }
}

function set_unario_number(number)
{
    var simbol = number.charAt(0);
    if(simbol == "+" || simbol == "-")
    {
        number = number.substr(1, number.length -1);
        number = number.concat("id");
        number = ("id").concat(number);
        list.unshift(number);
        list.unshift(simbol);
    }else
    {
        number = number.concat("id");
        number = ("id").concat(number);
        list.unshift(number);
    }

}


function print_all_elements(lista)
{
	for(var i = 0 ; i < lista.length ; i++)
    	print_word(lista[i]);
}

function verificate_type(type_v)
{
    for(var i = 0 ; i < type_data.length ; i++)
        if(compare_string(type_data[i], type_v))
            return true;
    return false;
}

function add_tabs(cadena)
{
    for(var i = 0; i < cadena.length ; i++)
    {
        if(cadena.substr(i,2) == "\r\n")
        {
            var first = cadena.substr(0,i);
            first = first.concat("\r\n\t");
            cadena = first.concat(cadena.substr(i+2, cadena.length -1));
        }
    }
}