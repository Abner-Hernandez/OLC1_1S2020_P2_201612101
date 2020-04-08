var reqs_id = 0;

function removeElement(ev) {
  var button = ev.target;
  var field = button.previousSibling;
  var div = button.parentElement;
  div.removeChild(button);
  div.removeChild(field);
}

function add() {
  reqs_id++; // increment reqs_id to get a unique ID for the new element

  //create textbox
  var input = document.createElement('textarea');
  input.type = "text";
  input.setAttribute("class", "w3-input w3-border");
  input.setAttribute('id', 'reqt' + reqs_id);
  input.setAttribute('value', reqs_id);
  input.setAttribute('style', "width:97%");
  var reqs = document.getElementById("reqs");
  //style="width:100%"
  //create analize
  var analize = document.createElement('button');
  analize.setAttribute('id', 'reqsa' + reqs_id);
  analize.setAttribute("type", "button");
  analize.setAttribute("class", "btn btn-info");
  analize.setAttribute('style', "width:49%");
  analize.onclick = function() {
    document.getElementById('reqss' + reqs_id).value = "data";
  };
  analize.innerHTML = "analize";

  //create remove button
  var remove = document.createElement('button');
  remove.setAttribute('id', 'reqsr' + reqs_id);
  remove.setAttribute("type", "button");
  remove.setAttribute("class", "btn btn-danger");
  remove.setAttribute('style', "width:49%");
  remove.onclick = function() {
  reqs.removeChild(input);
  reqs.removeChild(analize);
  reqs.removeChild(remove);
  reqs_id--;
  };

  remove.innerHTML = "Remove";

  //append elements
  reqs.appendChild(input);
  reqs.appendChild(analize);
  reqs.appendChild(remove);
}

var errores_lexicos = [];
var errores_sintacticos = [];
var list = [];
var tabs = [];
var type_data = ["int", "double", "char", "bool", "string"];
var traduccion = "";
var aux_traduccion = "";
var panic_mode_var = false;
var method_main = false;
var method_s = false;
var method_main_f = false;
var oper_relationals = ["<", ">", "<=", ">=", "==", "!="];
var traduccion_without_do = "";
var bucle = [];
var is_method = false;
var html_code = "";
var etiquetas_html = [];

// analisis lexico
function lexer_analize(entry)
{
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
    method_main_f = false;;

    //Set defaults vars
    errores_lexicos = [];
    list = [];
    tabs = [];
    traduccion = "";
    aux_traduccion = "";
    panic_mode_var = false;
    method_main = false;
    method_s = false;
    bucle = [];
    is_method = false;
    errores_sintacticos = [];
    html_code = "";

    var id = "";
    
    for(var i = 0; i < entry.length; i++)
    {
        var initial = i;

        if(entry.charAt(i) == ' ' || entry.charAt(i) == '\t')
        {
            if(bool_id || numero)
            {
                bool_id = false;
                numero = false
                id = "id".concat(id);
                id = id.concat("id");    
                list.push({lexeme:id, row_l: row, column_l: column});
                id = "";
            }
        	i++;
        }else if(entry.charAt(i) == '\n')
        {
            if(bool_id || numero)
            {
                bool_id = false;
                numero = false
                id = "id".concat(id);
                id = id.concat("id");    
                list.push({lexeme:id, row_l: row, column_l: column});
                id = "";
            }
            i++;
            row++;
            column = 0;
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
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                list.push({lexeme: ";", row_l: row, column_l: column});
                i++;
                break;
            case ':':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                list.push({lexeme: ":", row_l: row, column_l: column});
                i++;
                break;
            case '{':
                list.push({lexeme: "{", row_l: row, column_l: column});
                i++;
                break;
            case ',':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                list.push({lexeme: ",", row_l: row, column_l: column});
                i++;
                break;
            case '}':
                list.push({lexeme: "}", row_l: row, column_l: column});
                i++;
                break;
            case '(':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                list.push({lexeme: "(", row_l: row, column_l: column});
                i++;
                break;
            case ')':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                   
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                list.push({lexeme: ")", row_l: row, column_l: column});
            	i++;
                break;
            case '=':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                   
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                if(compare_string(entry.substr(i, size_entry), "=="))
                {
                    list.push({lexeme: "==", row_l: row, column_l: column});
                    i = i + 2;
                    column = column +2;
                }
                else
                {
                    list.push({lexeme: "=", row_l: row, column_l: column});
                    i++;
                }
                break;
            case '<':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                   
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                if(compare_string(entry.substr(i, size_entry), "<="))
                {
                    list.push({lexeme: "<=", row_l: row, column_l: column});
                    i = i + 2;
                    column = column +2;
                }
                else
                {
                    list.push({lexeme: "<", row_l: row, column_l: column});
                    i++;
                }
                break;
            case '>':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                   
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                if(compare_string(entry.substr(i, size_entry), ">="))
                {
                    list.push({lexeme: ">=", row_l: row, column_l: column});
                    i = i + 2;
                    column = column +2;
                }
                else
                {
                    list.push({lexeme: ">", row_l: row, column_l: column});
                    i++;
                }
                break;
            case '|':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                   
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                if(compare_string(entry.substr(i, size_entry), "||"))
                {
                    list.push({lexeme: "||", row_l: row, column_l: column});
                    i = i + 2;
                    column = column +2;
                }
                else
                {
                    var new_lex_error = {lexema: ac, fila: row, columna: column};
                    errores_lexicos.push(new_lex_error);
                }
                break;
            case '+':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                if(compare_string(entry.substr(i, size_entry), "++"))
                {
                    list.push({lexeme: "++", row_l: row, column_l: column});
                    i = i + 2;
                }
                else
                {
                    list.push({lexeme: "+", row_l: row, column_l: column});
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
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                if(compare_string(entry.substr(i, size_entry), "--"))
                {
                    list.push({lexeme: "--", row_l: row, column_l: column});
                    i = i + 2;
                }
                else
                {
                    list.push({lexeme: "-", row_l: row, column_l: column});
                    i++
                }                break;
            case '*':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                list.push({lexeme: "*", row_l: row, column_l: column});
                i++;
                break;
            case '/':
                if(bool_id || numero)
                {
                    bool_id = false;
                    numero = false
                    id = "id".concat(id);
                    id = id.concat("id");                     
                    list.push({lexeme: id, row_l: row, column_l: column});
                    id = "";
                }
                //busca comentarios
                if(compare_string(entry.substr(i, size_entry), "//"))
                {
                    commentary = "#";
                    for(var j = i ; j < size_entry ; j++)
                    {
                        if(entry.charAt(j) == '\n')
                        {
                            row++;
                            column = 0;
                            i = j+2;
                            break;
                        }
                        commentary = commentary.concat(entry.charAt(j));
                    }
                    //list.push(commentary);
                }else if(compare_string(entry.substr(i, size_entry), "/*"))
                {
                    commentary = "\"\"\"";
                    for(var j = i ; j < size_entry ; j++)
                    {
                        if(entry.charAt(j) == '\n')
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
                    //list.push(commentary);
                }
                //cadena distinta de comentario
                else
                {
                    list.push({lexeme: "/", row_l: row, column_l: column});
                    i++;
                }
            break;
            case 'f':
                if(compare_string(entry.substr(i, size_entry), "for"))
                {
                    list.push({lexeme: "for", row_l: row, column_l: column});
                    i = i + 3;
                }
                break;
            case 'i':
                if(compare_string(entry.substr(i, size_entry), "int"))
                {
                    list.push({lexeme: "int", row_l: row, column_l: column});
                    i = i + 3;
                }else if(compare_string(entry.substr(i, size_entry), "if"))
                {
                    list.push({lexeme: "if", row_l: row, column_l: column});
                    i = i + 2;
                }
                break;
            case 'e':
                if(compare_string(entry.substr(i, size_entry), "else"))
                {
                    list.push({lexeme: "else", row_l: row, column_l: column});
                    i = i + 4;
                }
                break;
            case 'v':
                if(compare_string(entry.substr(i, size_entry), "void"))
                {
                    list.push({lexeme: "void", row_l: row, column_l: column});
                    i = i + 4;
                }
                break;
            case 's':
                if(compare_string(entry.substr(i, size_entry), "switch"))
                {
                    list.push({lexeme: "switch", row_l: row, column_l: column});
                    i = i + 6;
                }else if(compare_string(entry.substr(i, size_entry), "string"))
                {
                    list.push({lexeme: "string", row_l: row, column_l: column});
                    i = i + 6;
                }
                break;
            case 'c':
                if(compare_string(entry.substr(i, size_entry), "case"))
                {
                    list.push({lexeme: "case", row_l: row, column_l: column});
                    i = i + 4;
                }else if(compare_string(entry.substr(i, size_entry), "char"))
                {
                    list.push({lexeme: "char", row_l: row, column_l: column});
                    i = i + 4;
                }else if(compare_string(entry.substr(i, size_entry), "continue"))
                {
                    list.push({lexeme: "continue", row_l: row, column_l: column});
                    i = i + 8;
                }
                break;
            case 'C':
                if(compare_string(entry.substr(i, size_entry), "Console.Write"))
                {
                    list.push({lexeme: "Console.Write", row_l: row, column_l: column});
                    i = i + 13;
                }
                break;
            case 'w':
                if(compare_string(entry.substr(i, size_entry), "while"))
                {
                    list.push({lexeme: "while", row_l: row, column_l: column});
                    i = i + 5;
                }
                break;
            case 'r':
                if(compare_string(entry.substr(i, size_entry), "return"))
                {
                    list.push({lexeme: "return", row_l: row, column_l: column});
                    i = i + 6;
                }
                break;
            case 'b':
                if(compare_string(entry.substr(i, size_entry), "break"))
                {
                    list.push({lexeme: "break", row_l: row, column_l: column});
                    i = i + 5;
                }else if(compare_string(entry.substr(i, size_entry), "bool"))
                {
                    list.push({lexeme: "bool", row_l: row, column_l: column});
                    i = i + 4;
                }
                break;
            case '&':
                if(compare_string(entry.substr(i, size_entry), "&&"))
                {
                    list.push({lexeme: "&&", row_l: row, column_l: column});
                    i = i + 2;
                }
                break;
            case '!':
                if(compare_string(entry.substr(i, size_entry), "!="))
                {
                    list.push({lexeme: "!=", row_l: row, column_l: column});
                    i = i + 2;
                }else
                {
                    list.push({lexeme: "!", row_l: row, column_l: column});
                    i++;
                }
                break;
            case '"':
                i++;
                for(var j = i ; j < size_entry ; j++)
                {
                    if(entry.charAt(j) == '"')
                    {
                        var desp = j - i + 2;
                        var insert_v = entry.substr(i-1, desp);
                        insert_v = insert_v.concat("id");
                        insert_v = "id".concat(insert_v);
                        list.push({lexeme: insert_v, row_l: row, column_l: column});
                        i = i + desp - 1;
                        break;
                    }if(entry.charAt(j) == '\n')
                    {
                        row++;
                        column = 0;
                        i = j+2;
                    }
                }
                break;
            case '\'':
                i++;
                for(var j = i ; j < size_entry ; j++)
                {
                    if(entry.charAt(j) == '\'')
                    {
                        var desp = j - i + 2;
                        var insert_v = entry.substr(i-1, desp);

                        if(insert_v.length > 3)
                        {
                            //este es un codigo html
                            html_code += entry.substr(i, desp - 2);
                        }

                        insert_v = insert_v.concat("id");
                        insert_v = "id".concat(insert_v);
                        list.push({lexeme: insert_v, row_l: row, column_l: column});
                        i = i + desp - 1;
                        break;
                    }if(compare_string(entry.substr(j, size_entry), "\r\n"))
                    {
                        row++;
                        column = 0;
                        i = j+2;
                    }
                }
            case 'd':
                if(compare_string(entry.substr(i, size_entry), "double"))
                {
                    list.push({lexeme: "double", row_l: row, column_l: column});
                    i = i + 6;
                }else if(compare_string(entry.substr(i, size_entry), "default"))
                {
                    list.push({lexeme: "default", row_l: row, column_l: column});
                    i = i + 7;
                }else if(compare_string(entry.substr(i, size_entry), "do"))
                {
                    list.push({lexeme: "do", row_l: row, column_l: column});
                    i = i + 2;
                }
                break;
            case 'm':
                if(compare_string(entry.substr(i, size_entry), "main"))
                {
                    list.push({lexeme: "main", row_l: row, column_l: column});
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
    get_html_to_json();
    var obj = JSON.parse(make_json());
    document.getElementById("traducido").value = traduccion;
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
    for(var d = 0 ; d < list.length ; d++)
    {
        if(verificate_type(list[0].lexeme) && panic_mode_var == false)
        {
            if(list[2].lexeme == "=" || list[2].lexeme == ";" || list[2].lexeme == ",")
            {
                analice_declaration();
                if(panic_mode_var)
                    continue;
                //print_word(aux_traduccion);
                for(var i = 0 ; i < tabs.length ; i++)
                {
                    aux_traduccion = add_tabs(aux_traduccion);
                }
                concat_traduccion(aux_traduccion);
                aux_traduccion = "";
                document.getElementById("traducido").value = traduccion;
            }else if(list[2].lexeme == "(" && method_s == false)
            {
                //Se define una funcion
                verificate_function();
                if(panic_mode_var)
                    continue;
                concat_traduccion(aux_traduccion);
                aux_traduccion = "";
                method_s = true;
                if(list[0].lexeme != "{")
                {
                    panic_mode_var = true;
                    continue;
                }else
                    list.shift();
            }
            d = -1;
        }else if (list[0].lexeme == "void" && panic_mode_var == false && method_s == false)
        {
            // se termina la indentacion sacar un elemento de tabs

            if(list[1].lexeme == "main" && method_main_f == false)
            {
                //definicion del metodo main
                method_main = true;
                verificate_function();
                tabs.push("main");
            }
            else
                verificate_function();
            if(panic_mode_var)
                continue;
            concat_traduccion(aux_traduccion);
            aux_traduccion = "";
            method_s = true;
            if(list[0].lexeme != "{")
            {
                panic_mode_var = true;
                continue;
            }else
                list.shift();
            
            is_method = true;

            d = -1;
        }else if (list[0].lexeme == "if" && panic_mode_var == false && method_s == true)
        {
            //function if
            sent_if();
            if(panic_mode_var)
                continue;

            if(list[0].lexeme != "{")
            {
                panic_mode_var = true;
                continue;
            }else
                    list.shift();
            concat_traduccion(aux_traduccion);
            aux_traduccion = "";

            d = -1;
        }else if (list[0].lexeme == "switch" && panic_mode_var == false && method_s == true)
        {
            //function switch
            sent_switch();
            if(panic_mode_var)
                continue;

            if(list[0].lexeme != "}")
            {
                panic_mode_var = true;
                continue;
            }else
                list.shift();

            concat_traduccion(aux_traduccion);
            aux_traduccion = "";
            
            d = -1;
        }
        else if (list[0].lexeme == "for" && panic_mode_var == false && method_s == true)
        {
            //function for
            sent_for();
            if(panic_mode_var)
                continue;

            if(list[0].lexeme != "{")
            {
                panic_mode_var = true;
                continue;
            }else
                list.shift();
            
            if(sent_do == false)
                concat_traduccion(aux_traduccion);
            aux_traduccion = "";
            bucle.push("for");

            d = -1;
        }
        else if (list[0].lexeme == "while" && panic_mode_var == false && method_s == true)
        {
            //function while
            sent_while();
            if(panic_mode_var)
                continue;

            if(list[0].lexeme != "{")
            {
                panic_mode_var = true;
                continue;
            }else
                list.shift();
            
            concat_traduccion(aux_traduccion);
            bucle.push("while");
            aux_traduccion = "";
            buble.push("while");

            d = -1;
        }
        else if (list[0].lexeme == "do" && panic_mode_var == false && method_s == true)
        {
            //function do while
            traduccion_without_do += traduccion;
            list.shift();

            if(list[0].lexeme != "{")
            {
                panic_mode_var = true;
                continue;
            }else
                list.shift();

            concat_traduccion_aux("\r\nwhile True:")
            tabs.push("do_while");
            bucle.push("do_while");
            sent_do = true;

            d = -1;
        }
        else if (list[0].lexeme == "return" && panic_mode_var == false )
        {
            //return
            sent_return(is_method);
            d = -1;
        }
        else if (list[0].lexeme == "continue" && panic_mode_var == false && bucle.length > 0)
        {
            //continue
            sent_continue();
            d = -1;
        }
        else if (list[0].lexeme == "break" && panic_mode_var == false && bucle.length > 0)
        {
            //break
            sent_break();
            d = -1;
        }
        else if (list[0].lexeme == "Console.Write" && panic_mode_var == false && method_s == true)
        {
            //sentencia imprimir
            var consolew = console_write();
            concat_traduccion(consolew);
            d = -1;
        }
        else if (list[0].lexeme == "}" && panic_mode_var == false && method_s == true)
        {
            // se termina la indentacion sacar un elemento de tabs
            list.shift(); 
            if(tabs[tabs.length -1].lexeme == "funcion" ||  tabs[tabs.length -1].lexeme == "main")
                method_s = false;
            else if(tabs[tabs.length - 1].lexeme == "do_while")
            {

                if(list[0].lexeme != "while")
                {
                    panic_mode_var = true;
                    continue;
                }else
                    list.shift();

                if(list[0].lexeme != "(")
                {
                    panic_mode_var = true;
                    continue;
                }else
                    list.shift();


                var n1 = get_unario_number();
                if(panic_mode_var)
                    continue;

                if(list[0].lexeme != "<")
                {
                    panic_mode_var = true;
                    continue;
                }else
                    list.shift();

                var n2 = get_unario_number();
                if(panic_mode_var)
                    continue;

                concat_traduccion_aux("if ");
                concat_traduccion_aux(n1);
                concat_traduccion_aux(" < ");
                concat_traduccion_aux(n2);
                if(list[0].lexeme != ")")
                {
                    panic_mode_var = true;
                    continue;
                }else
                {
                    list.shift();
                }

                if(list[0].lexeme != ";")
                {
                    panic_mode_var = true;
                    continue;
                }else
                {
                    list.shift();
                    tabs.pop();
                    concat_traduccion_aux(" :");
                    concat_traduccion_aux("\r\nbreak");
                    aux_traduccion = add_tabs(aux_traduccion);
                    continue;
                }
            }
            d = -1;
            if(tabs.length > 0);
                tabs.pop();
        }
        else if(panic_mode_var)
        {

            if(traduccion_without_do != "")
            {
                traduccion = "";
                traduccion += traduccion_without_do;
                traduccion_without_do = "";
            }

            for(var i = 0 ; i < list.length ; i++)
            {
                var actual = list.shift();
                i = -1;
                if(actual.lexeme != ";" && actual.lexeme != "")
                {
                    errores_sintacticos.push({lexeme: actual.lexeme, row_l: actual.row_l, column_l: actual.column_l, descripcion: ""});
                }
                else
                {
                    panic_mode_var = false;
                    break;
                }
            }

            d = -1;
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
        	next = get_id(next);
            if(next.lexeme.charAt(0) >= 0 && next.lexeme.charAt(0) <= 9)
            {
                //Es un numero no identificador
                panic_mode_var = true;
                return;
            }
            list_vars.push(next.lexeme)
            var next2 = list.shift();
            if(next2.lexeme == ";")
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
            else if(next2.lexeme == ",")
            {
                continue;
            }
            else if(next2.lexeme == "=")
            {
                //asignar
                var number = get_unario_number();
                if(panic_mode_var)
                    return;
                var next = list.shift();
                if(next.lexeme == ";")
                {
                    //concatenar number asignado
                    for(var j = 0; j < list_vars.length; j++)
                    {
                        concat_traduccion_aux("\r\nvar ");
                        concat_traduccion_aux(list_vars.shift());
                        concat_traduccion_aux(" = ");
                        concat_traduccion_aux(number.lexeme);    
                        j = -1;                        
                    }
                    return;
                }else
                {
                    list.unshift(next);
                    set_unario_number(number);
                    
                    //llamar a operacion
                    var description = verificate_operation(true);

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
function verificate_operation(declarations)
{
    var description = "";
    
    for(var i = 0 ; i < list.length ; i++)
    {
        var number = get_unario_number();
        description = description.concat(number.lexeme);
        var operator = list.shift();
        i = -1;
        
        if(operator.lexeme.charAt(0) == "+" || operator.lexeme.charAt(0) == "-" || operator.lexeme.charAt(0) == "*" || operator.lexeme.charAt(0) == "/")
        {
            description = description.concat(operator.lexeme);
            var number2 = get_unario_number();
            if(panic_mode_var)
                return;
            set_unario_number(number2);
            i = 0;
            continue;

        }else if(operator.lexeme.charAt(0) == ";" && declarations == true)
        {
            return description;
        }else if(declarations == false)
        {
            for(var j = 0 ; j < oper_relationals.length ; j++)
            {
                if(oper_relationals[j] == operator.lexeme)
                {
                    list.unshift(operator);
                    return description;
                }
            }
            if(operator.lexeme == "&&" || operator.lexeme == "||" || operator.charAt(0).lexeme == ")" )
            {
                list.unshift(operator);
                return description;
            }
            else
            {
                panic_mode_var = true;
                return;
            }
        }else
        {
            panic_mode_var = true;
                return;
        }
    }

}

//funcion para analizar las funciones
function verificate_function()
{
    list.shift();
    var next = list.shift();
    if(verificate_id(next))
    {
        next = get_id(next);
        if(next.lexeme.charAt(0) >= 0 && next.lexeme.charAt(0) <= 9)
        {
            //Es un numero no identificador
            panic_mode_var = true;
            return;
        }
        concat_traduccion_aux("\r\ndef ");
        concat_traduccion_aux(next.lexeme);
        if(list[0].lexeme == "(")
        {
            list.shift();
            concat_traduccion_aux("(");
        }
        else
        {
            panic_mode_var = true;
            return;
        }

        //Parametros
        //verificar si es el metodo main
        if(method_main == false)
        {
            get_parameters();
        }
        return;
    }else if(next.lexeme == "main")
    {
        concat_traduccion_aux("\r\ndef ");
        concat_traduccion_aux(next.lexeme);
        if(list[0].lexeme == "(")
        {
            list.shift();
            concat_traduccion_aux("(");
        }
        else
        {
            panic_mode_var = true;
            return;
        }
        if(list[0].lexeme == ")")
        {
            list.shift();
            concat_traduccion_aux("):");
            aux_traduccion = add_tabs(aux_traduccion);
        }else
            panic_mode_var = true;
        return;
    }
}

//funcion para verificar parametros
function get_parameters()
{
    var list_vars = [];
    var aux_cierre = list.shift();
    if(aux_cierre.lexeme == ")")
    {
        //No habian parametros
        concat_traduccion_aux("):");
        aux_traduccion = add_tabs(aux_traduccion);
        tabs.push("funcion")
        is_method = true;
        return;
    }else
    {
        list.unshift(aux_cierre);
        //Definicion de declaracion variables parametros
        for(var i = 0 ; i < list.length ; i ++)
        {
            var id_par = list.shift();
            i = -1;
            if(verificate_type(id_par.lexeme))
            {
                var aux_id_var = list.shift()
                if(verificate_id(aux_id_var))
                {
                    aux_id_var = get_id(aux_id_var);
                    if(aux_id_var.lexeme.charAt(0) >= 0 && aux_id_var.lexeme.charAt(0) <= 9)
                    {
                        //Es un numero no identificador
                        panic_mode_var = true;
                        return;
                    }
                    list_vars.push(aux_id_var.lexeme);

                    var is_another_par = list.shift();
                    if(is_another_par.lexeme == ",")
                        continue;
                    else if(is_another_par.lexeme == ")")
                    {
                        for(var j = 0 ; j < list_vars.length ; j++)
                        {
                            concat_traduccion_aux(list_vars.shift())
                            j = -1;
                            if(0 < list_vars.length)
                                concat_traduccion_aux(", ");
                        }
                        concat_traduccion_aux("):");
                        aux_traduccion = add_tabs(aux_traduccion);
                        tabs.push("funcion")
                        return;
                    }else
                    {
                        panic_mode_var = true;
                        return;
                    }
                }
            }else if(id_par.lexeme == ")")
            {
                for(var j = 0 ; j < list_vars.length ; j++)
                {
                    concat_traduccion_aux(list_vars.shift())
                    j = -1;
                    if(0 < list_vars.length)
                        concat_traduccion_aux(", ");
                }
                concat_traduccion_aux("):");
                aux_traduccion = add_tabs(aux_traduccion);
                tabs.push("funcion")
                return;
            }else
            {
                panic_mode_var = true;
                return;
            }   
        }
    }
}

//function if
function sent_if()
{
    list.shift();
    if(list[0].lexeme == "(")
    {
        list.shift();
        // definir condiciones
        concat_traduccion_aux("\r\nif ");
        verificate_conditions();
    }else
    {
        panic_mode_var = true;
        return;
    }
}

//definir condiciones
function verificate_conditions()
{
    for(var i = 0 ; i < list.length ; i++)
    {
        var is_another_con = false;
        //verificar si es logica
        if(list[0].lexeme == "!" )
        {
            //Es una operacion logica
            list.shift();
            var next = list.shift()
            i = -1;
            if(verificate_id(next))
            {
                next = get_id(next);
                concat_traduccion_aux("!")
                concat_traduccion_aux(next.lexeme);
                is_another_con = true;
            }
        }else
        {
            //todas las funciones van a ser pruebas
            var number = get_unario_number();
            if(panic_mode_var)
                return;
            else
            {
                // comprobar si es comparacion directa o hay una operacion
                var simbol = list.shift();
                i = -1;
                if(simbol.lexeme.charAt(0) == "+" || simbol.lexeme.charAt(0) == "-" || simbol.lexeme.charAt(0) == "*" || simbol.lexeme.charAt(0) == "/")
                {
                    list.unshift(simbol);
                    set_unario_number(number);
                    //ejecutar analisis de operacion
                    var op = verificate_operation(false);
                    if(panic_mode_var)
                        return;
                    concat_traduccion_aux(op);
                    
                    var op_rel = list.shift()
                    var aux_op = "";
                    for(var j = 0 ; j < oper_relationals.length ; j++)
                    {
                        if(op_rel.lexeme == oper_relationals[j])
                        {
                            aux_op = op_rel.lexeme;
                            break;
                        }
                    }
                    if(aux_op == "")
                    {
                        //tendria que venir un operador relacional
                        panic_mode_var = true;
                        return;
                    }else
                    {
                        concat_traduccion_aux(aux_op);
                        number = get_unario_number();
                        if(panic_mode_var)
                            return;

                        simbol = list.shift();
                        if(simbol.lexeme.charAt(0) == "+" || simbol.lexeme.charAt(0) == "-" || simbol.lexeme.charAt(0) == "*" || simbol.lexeme.charAt(0) == "/")
                        {
                            list.unshift(simbol);
                            set_unario_number(number);
                            //ejecutar analisis de operacion
                            var op = verificate_operation(false);
                            if(panic_mode_var)
                                return;
                            concat_traduccion_aux(op);
                        }else if(simbol.lexeme == ")")
                        {
                            //Finalizaron las condiciones
                            concat_traduccion_aux(number.lexeme);
                            return;
                        }else
                        {
                            //tendria que venir un otro operador
                            panic_mode_var = true;
                            return;
                        }
                        is_another_con = true;
                    }


                }
            }
        }

        if(is_another_con)
        {
            is_another_con = false;
            if(list[0].lexeme == "&&" || list[0].lexeme == "||")
            {
                concat_traduccion_aux(list.shift().lexeme);
                continue;

            }
            if(list[0].lexeme == ")")
            {
                list.shift();
                //Finalizaron las condiciones
                concat_traduccion_aux(" :");
                aux_traduccion = add_tabs(aux_traduccion);
                tabs.push("if")
                return;
            }else if(list[0].lexeme == "")
            {
                panic_mode_var = true;
                return;
            }
        }
        
    }

    
    //probar operaciones


    //probar condiciones simples
}

//definir switch
function sent_switch()
{
    list.shift();
    if(list[0].lexeme == "(")
    {
        list.shift();
        var number = get_unario_number();
        if(panic_mode_var)
            return;
        concat_traduccion_aux("\r\ndef switch(case, ");
        aux_traduccion = add_tabs(aux_traduccion);
        tabs.push("switch");
        //oncat_traduccion_aux(number);
        //concat_traduccion_aux("):");
        
        if(list[0].lexeme == ")")
            list.shift();
        else
        {
            panic_mode_var = true;
            return;
        }
        
        if(list[0].lexeme == "{")
            list.shift();
        else
        {
            panic_mode_var = true;
            return;
        }
        // ahora tendrian que venir lo case
        // implementar primero el print for while do while 
        var number1  = "";
        var dato = "";
        var aux_cases = "\r\n";
        var aux_cc = "";
        tabs.push("switcher");
        for(var i = 0 ; i < list.length ; i++)
        {
            var cases = "";
            if(list[0].lexeme == "case" || list[0].lexeme == "default")
            {
                cases = list.shift().lexeme;
                i = -1;
            }
            else
            {
                panic_mode_var = true;
                return;
            }

            if(cases != "default")
                number1 = get_unario_number();
            if(panic_mode_var)
                return;

            if(list[0].lexeme == ":")
                list.shift();
            else
            {
                panic_mode_var = true;
                return;
            }

            if(cases != "default")
                aux_cases = aux_cases.concat(number1.lexeme);
            else
                aux_cases = aux_cases.concat(++number1.lexeme);
            aux_cases = aux_cases.concat(": ");
            // definir cases

            if(verificate_id(list[0]))
            {
                // es una asignacion
                var aux_a = "";
                var n = get_unario_number();
                dato = n.lexeme;
                if(panic_mode_var)
                    return;

                if(list[0].lexeme == "=")
                    list.shift();
                else
                {
                    panic_mode_var = true;
                    return;
                }
                var result = get_unario_number();
                aux_a = aux_a.concat(n.lexeme);
                aux_a = aux_a.concat(" = ");
                aux_a = aux_a.concat(result.lexeme);

                if(list[0].lexeme == ";")
                    list.shift();
                else
                {
                    panic_mode_var = true;
                    return;
                }

                if(list[0].lexeme == "break")
                {
                    list.shift();
                    if(list[0].lexeme == ";")
                        list.shift();
                    else
                    {
                        panic_mode_var = true;
                        return;
                    }
                }
                if(list[0].lexeme == "case" || list[0].lexeme == "default")
                {
                    aux_a = aux_a.concat(",\r\n");
                    aux_cases = aux_cases.concat(aux_a);
                    aux_cases = add_tabs(aux_cases);
                    aux_cc = aux_cc.concat(aux_cases);
                    aux_cases = "";
                    continue;
                }else if(list[0].lexeme == "}")
                {
                    aux_cases = aux_cases.concat(aux_a);
                    aux_cases = add_tabs(aux_cases);
                    aux_cc = aux_cc.concat(aux_cases);
                    tabs.pop();
                    concat_traduccion_aux(dato);
                    var sw = "\r\nswitcher = {"
                    var ss = "\r\n}"
                    sw = add_tabs(sw);
                    ss = add_tabs(ss);
                    concat_traduccion_aux("):");
                    concat_traduccion_aux(sw);
                    concat_traduccion_aux(aux_cc);
                    concat_traduccion_aux(",");
                    concat_traduccion_aux(ss);
                    //finalizo switch
                    tabs.pop();
                    return;
                }

            }else if(list[0].lexeme == "Console.Write")
            {
                // es una asignacion
                var cw = console_write();

                if(list[0].lexeme == "break")
                {
                    list.shift();
                    if(list[0].lexeme == ";")
                        list.shift();
                    else
                    {
                        panic_mode_var = true;
                        return;
                    }
                }
                if(list[0].lexeme == "case" || list[0].lexeme == "default")
                {
                    cw = cw.concat(",\r\n");
                    //cw = "\r\n".concat(cw);
                    aux_cc = aux_cc.concat(cw);
                    continue;
                }else if(list[0].lexeme == "}")
                {
                    tabs.pop();
                    aux_cc = aux_cc.concat(cw);
                    concat_traduccion_aux(dato);
                    var sw = "\r\nswitcher = {"
                    var ss = "\r\n}"
                    sw = add_tabs(sw);
                    ss = add_tabs(ss);
                    ss = ss.substr(2, ss.length-1);
                    concat_traduccion_aux("):");
                    concat_traduccion_aux(sw);
                    aux_cc = aux_cc.substr(0, aux_cc.length-3)
                    concat_traduccion_aux(aux_cc);
                    concat_traduccion_aux(ss);
                    //finalizo switch
                    tabs.pop();
                    return;
                }
            }

        }

    }else
    {
        panic_mode_var = true;
        return;
    }
}

//definir for
function sent_for()
{
    list.shift();

    if(list[0].lexeme != "(")
    {
        panic_mode_var = true;
            return;
    }else
        list.shift();

    if(list[0].lexeme == "int")
    {
        concat_traduccion_aux("\r\nfor ");
        var n_var = get_unario_number();
        if(panic_mode_var)
            return;

        concat_traduccion_aux(n_var);
        concat_traduccion_aux(" in range(");
        
        if(list[0].lexeme == "=")
        {
            list.shift();
            var number = get_unario_number();
            if(panic_mode_var)
                return;
            
            concat_traduccion_aux(number.lexeme++);
            concat_traduccion_aux(", ");

            if(list[0].lexeme == ";")
                list.shift();
            else
            {
                panic_mode_var = true;
                return;
            }

            get_unario_number();
            if(panic_mode_var)
                return;
            if(list[0].lexeme == "<")
                list.shift();
            else
            {
                panic_mode_var = true;
                return;
            }

            var number2 = get_unario_number();
            if(panic_mode_var)
                return;
            
            concat_traduccion_aux(number2.lexeme);

            if(list[0].lexeme == ";")
                list.shift();
            else
            {
                panic_mode_var = true;
                return;
            }

            get_unario_number();
            if(panic_mode_var)
                return;

            if(list[0].lexeme == "++")
                list.shift();
            else
            {
                panic_mode_var = true;
                return;
            }


            if(list[0].lexeme == ")")
                list.shift();
            else
            {
                panic_mode_var = true;
                return;
            }

            concat_traduccion_aux("):")

            aux_traduccion = add_tabs(aux_traduccion);
            tabs.push("for");
            
        }
        else
        {
            panic_mode_var = true;
            return;
        }

    }
    else
    {
        panic_mode_var = true;
            return;
    }
}

//definir while
function sent_while()
{
    list.shift();

    if(list[0].lexeme != "(")
    {
        panic_mode_var = true;
            return;
    }else
        list.shift();

    var n1 = get_unario_number();
    if(panic_mode_var)
        return;

    if(list[0].lexeme != "<")
    {
        panic_mode_var = true;
            return;
    }else
        list.shift();

    var n2 = get_unario_number();
    if(panic_mode_var)
        return;

    concat_traduccion_aux("while ");
    concat_traduccion_aux(n1);
    concat_traduccion_aux(" < ");
    concat_traduccion_aux(n2);
    if(list[0].lexeme != ")")
    {
        panic_mode_var = true;
            return;
    }else
        list.shift();
    concat_traduccion_aux(" :");
    aux_traduccion = add_tabs(aux_traduccion);
    tabs.push("while");
    return;
}

//console write
function console_write()
{
    list.shift();
    if(list[0].lexeme != "(")
    {
        panic_mode_var = true;
            return;
    }else
    {
        list.shift();
        
        var description = "\r\nprint(";
    
        for(var i = 0 ; i < list.length ; i++)
        {
            var number = get_unario_number();
            description = description.concat(number.lexeme);
            var operator = list.shift();
            i = -1;
            
            if(operator.lexeme.charAt(0) == "+")
            {
                description = description.concat(", ");
                var number2 = get_unario_number();
                if(panic_mode_var)
                    return;
                set_unario_number(number2);
                i = 0;
                continue;
    
            }else if(operator.lexeme.charAt(0) == ")")
            {
                if(list[0].lexeme != ";")
                {
                    panic_mode_var = true;
                        return;
                }else
                    list.shift();

                break;
            }else
            {
                panic_mode_var = true;
                    return;
            }
        }
        description = description.concat(")");
        description = add_tabs(description);
        return description;
    }
}

//sentencia return
function sent_return(is_void)
{
    list.shift();

    if(list[0].lexeme == ";" && is_void)
    {
        list.shift();
            return "return";
    }else if (is_void == false)
    {
        var op = verificate_operation(true);
        if(panic_mode_var)
            return;
        concat_traduccion_aux("return ");
        concat_traduccion_aux(op);
        aux_traduccion = add_tabs(aux_traduccion);
        return
    }
}

//sentencia break
function sent_break()
{
    list.shift();

    if(list[0].lexeme != ";")
    {
        panic_mode_var = true;
            return;
    }else
    {
        list.shift();
        return "break";
    }
}

//sentencia continue
function sent_continue()
{
    list.shift();

    if(list[0].lexeme != ";")
    {
        panic_mode_var = true;
            return;
    }else
    {
        list.shift();
        return "continue";
    }
}

//Definicion de modo panico
function panic_mode()
{

}

//Las funciones siguientes son utilidades
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
	if(actual_id.lexeme.length < 5)
		return false;
	if(actual_id.lexeme.substr(0,2) == "id" && actual_id.lexeme.substr(actual_id.lexeme.length-2, 2) == "id")
        return true;
    else 
        return false;
}

function get_id(actual_id)
{
	if(actual_id.lexeme.length < 5)
		return actual_id;
    if(actual_id.lexeme.substr(0,2) == "id" && actual_id.lexeme.substr(actual_id.lexeme.length-2, 2) == "id")
    {
        actual_id.lexeme = actual_id.lexeme.substr(2, actual_id.lexeme.length-4);
        return actual_id;
    }
}

function get_unario_number()
{
    var simbol = list.shift();
    if(simbol.lexeme == "+" || simbol.lexeme == "-")
    {
        var number = list.shift();
        if(verificate_id(number))
        {
        	number = get_id(number);
            simbol.lexeme = simbol.lexeme.concat(number.lexeme);
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
    var simbol = number.lexeme.charAt(0);
    if(simbol == "+" || simbol == "-")
    {
        number.lexeme = number.lexeme.substr(1, number.lexeme.length -1);
        number.lexeme = number.concat("id");
        number.lexeme = ("id").concat(number.lexeme);
        list.unshift({lexeme: number.lexeme, row_l: number.row_l, column_l: number.column_l + 2});
        list.unshift({lexeme: simbol, row_l: number.row_l, column_l: number.column_l});
    }else
    {
        number.lexeme = number.lexeme.concat("id");
        number.lexeme = ("id").concat(number.lexeme);
        list.unshift({lexeme: number.lexeme, row_l: number.row_l, column_l: number.column_l});
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
        if(type_data[i] == type_v)
            return true;
    return false;
}

function add_tabs(cadena)
{
    if(tabs.length < 1)
        return cadena;

    var tabs_ = "";
    for(var i = 0; i < tabs.length ; i++)
    {
        tabs_ += '\t';
    }

    for(var i = 0; i < cadena.length ; i++)
    {
        if(cadena.charAt(i) == '\n')
        {
            var first = cadena.substr(0,i+1);
            first += tabs_;
            cadena = first.concat(cadena.substr(i+1, cadena.length -1));
        }
    }

    return cadena;
}

function get_html_to_json()
{
    etiquetas_html = [];
    size_html = html_code.length;
    for(var i = 0; i < html_code.length ; i++)
    {
        if(compare_string(html_code.substr(i, size_html), "<html>"))
        {
            etiquetas_html.push("<html>");
            i = i + 5;
        }
        else if(compare_string(html_code.substr(i, size_html), "<head>"))
        {
            etiquetas_html.push("<head>");
            i = i + 5;
        }
        else if(compare_string(html_code.substr(i, size_html), "<body"))
        {
            i = i + 5;
            var value = "";
            for(var j = i ; j < size_html ; j++)
            {
                if(html_code.charAt(j) == '>')
                    break;
                else if(html_code.charAt(j) == '>' )
                    continue;
                else
                    value += html_code.charAt(j);
            }

            etiquetas_html.push("<body>");
            if(value != "")
            {
                // nedd to read style
                for(var j = 0 ; j < value.length ; j++)
                {
                    if(value.substr(j, 5) == "style")
                    {
                        etiquetas_html.push("\"style\"");
                        j = j + 5;
                    }
                    else if(value.charAt(j) == '"' )
                    {
                        j++;
                        for(var k = j ; k < value.length ; k++)
                        {
                            if(value.charAt(k) == '"')
                            {
                                var desp = k - j + 2;
                                var insert_v = value.substr(j-1, desp);
                                etiquetas_html.push(insert_v);
                                i = i + k-1;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        }
        else if(compare_string(html_code.substr(i, size_html), "<div"))
        {
            i = i + 4;
            var value = "";
            for(var j = i ; j < size_html ; j++)
            {
                if(html_code.charAt(j) == '>')
                    break;
                else if(html_code.charAt(j) == '>' )
                    continue;
                else
                    value += html_code.charAt(j);
            }

            etiquetas_html.push("<div>");
            if(value != "")
            {
                // nedd to read style
                for(var j = 0 ; j < value.length ; j++)
                {
                    if(value.substr(j, 5) == "style")
                    {
                        etiquetas_html.push("\"style\"");
                        j = j + 5;
                    }
                    else if(value.charAt(j) == '"' )
                    {
                        j++;
                        for(var k = j ; k < value.length ; k++)
                        {
                            if(value.charAt(k) == '"')
                            {
                                var desp = k - j + 2;
                                var insert_v = value.substr(j-1, desp);
                                etiquetas_html.push(insert_v);
                                i = i + k-1;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        }
        else if(compare_string(html_code.substr(i, size_html), "<title>"))
        {
            etiquetas_html.push("<title>");
            i = i + 7;
            for(var j = i ; j < size_html ; j++ )
            {
                if(html_code.charAt(j) == '<')
                {
                    var text = html_code.substr(i, j-i);
                    if(text.length > 0)
                        etiquetas_html.push(add_comillas(text));
                    i = j;
                    break;
                }
            }
            if(compare_string(html_code.substr(i, size_html), "</title>"))
            {
                etiquetas_html.push("</title>");
                i = i + 7;
            }
        }
        else if(compare_string(html_code.substr(i, size_html), "</html>"))
        {
            etiquetas_html.push("</html>");
            i = i + 6;
        }
        else if(compare_string(html_code.substr(i, size_html), "<p>"))
        {
            etiquetas_html.push("<p>");
            i = i + 3;
            for(var j = i ; j < size_html ; j++ )
            {
                if(html_code.charAt(j) == '<')
                {
                    var text = html_code.substr(i, j-i);
                    if(text.length > 0)
                        etiquetas_html.push(add_comillas(text));
                    i = j;
                    break;
                }
            }
            if(compare_string(html_code.substr(i, size_html), "</p>"))
            {
                etiquetas_html.push("</p>");
                i = i + 3;
            }
        }
        else if(compare_string(html_code.substr(i, size_html), "<input>"))
        {
            etiquetas_html.push("<input>");
            i = i + 6;
        }
        else if(compare_string(html_code.substr(i, size_html), "<h1>"))
        {
            etiquetas_html.push("<h1>");
            i = i + 4;
            for(var j = i ; j < size_html ; j++ )
            {
                if(html_code.charAt(j) == '<')
                {
                    var text = html_code.substr(i, j-i);
                    if(text.length > 0)
                        etiquetas_html.push(add_comillas(text));
                    i = j;
                    break;
                }
            }
            if(compare_string(html_code.substr(i, size_html), "</h1>"))
            {
                etiquetas_html.push("</h1>");
                i = i + 4;
            }
        }
        else if(compare_string(html_code.substr(i, size_html), "<label>"))
        {
            etiquetas_html.push("<label>");
            i = i + 7;
            for(var j = i ; j < size_html ; j++ )
            {
                if(html_code.charAt(j) == '<')
                {
                    var text = html_code.substr(i, j-i);
                    if(text.length > 0)
                        etiquetas_html.push(add_comillas(text));
                    i = j;
                    break;
                }
            }
            if(compare_string(html_code.substr(i, size_html), "</label>"))
            {
                etiquetas_html.push("</label>");
                i = i + 6;
            }
        }
        else if(compare_string(html_code.substr(i, size_html), "<br>"))
        {
            etiquetas_html.push("<br>");
            i = i + 3;
        }
        else if(compare_string(html_code.substr(i, size_html), "<button>"))
        {
            etiquetas_html.push("<button>");
            i = i + 8;
            for(var j = i ; j < size_html ; j++ )
            {
                if(html_code.charAt(j) == '<')
                {
                    var text = html_code.substr(i, j-i);
                    if(text.length > 0)
                        etiquetas_html.push(add_comillas(text));
                    i = j;
                    break;
                }
            }
            if(compare_string(html_code.substr(i, size_html), "</button>"))
            {
                etiquetas_html.push("</button>");
                i = i + 8;
            }
        }
        else if(compare_string(html_code.substr(i, size_html), "</body>"))
        {
            etiquetas_html.push("</body>");
            i = i + 6;
        }
        else if(compare_string(html_code.substr(i, size_html), "</div>"))
        {
            etiquetas_html.push("</div>");
            i = i + 4;
        }
        else if(compare_string(html_code.substr(i, size_html), "</head>"))
        {
            etiquetas_html.push("</head>");
            i = i + 6;
        }            
    }
}

function make_json()
{
    tabs = [];
    tabs.push("first");
    var json = "{\r\n";
    for(var i = 0 ; i < etiquetas_html.length ; i++)
    {
        var et_actual = etiquetas_html.shift();
        i = -1;
        if(et_actual.charAt(0) == '<' && et_actual.charAt(1) != '/')
        {
            var new_element_json = "\r\n"
            new_element_json += delete_et(et_actual);
            new_element_json += ":{" 
            new_element_json = add_tabs(new_element_json);
            tabs.push(et_actual);

            if(et_actual == "<input>" || et_actual == "<br>")
            {
                tabs.pop();
                var auxd = "\r\n}";
                auxd = add_tabs(auxd);
                json += new_element_json;
                json += auxd;
                if(etiquetas_html.length > 0 && etiquetas_html[0].substr(0,2) != "</")
                    json += ",";
                continue;
            }

            if(etiquetas_html[0].charAt(0) == '"' && etiquetas_html[1].charAt(0) != '"')
            {
                var aux2 = "\r\n\"TEXTO\":";
                et_actual = etiquetas_html.shift();

                aux2 += et_actual;
                aux2 = add_tabs(aux2);

                json += new_element_json;
                json += aux2;
                if(etiquetas_html.length > 0 && etiquetas_html[0].substr(0,2) != "</")
                    json += ",";
                continue;
            }

            json += new_element_json;
        }
        else if(et_actual.charAt(0) == '<' && et_actual.charAt(1) == '/')
        {
            tabs.pop();
            var new_element_json = "\r\n}";
            if(etiquetas_html.length > 0 && etiquetas_html[0].substr(0,2) != "</")
                new_element_json += ",";
            new_element_json = add_tabs(new_element_json);
            json += new_element_json;
        }
        else if(et_actual.charAt(0) == '"')
        {
            var new_element_json = "\r\n"
            new_element_json += et_actual;
            new_element_json += ":";
            et_actual = etiquetas_html.shift();
            if(et_actual.charAt(0) == '"')
            {
                new_element_json += et_actual;
                if(etiquetas_html.length > 0 && etiquetas_html[0].substr(0,2) != "</")
                    new_element_json += ",";
            }else
                etiquetas_html.unshift(et_actual);
            new_element_json = add_tabs(new_element_json);
            json += new_element_json;
        }
    }
    json += "\r\n}"
    return json;
}

function delete_et(element)
{
    if(element.charAt(0) == '<' && element.charAt(element.length -1) == '>')
    {
        var aux = "\"";
        aux += element.substr(1, element.length -2);
        aux += "\"";
        return aux;
    }
    else
        return element;
    
}

function add_comillas(element)
{
    var aux = "\"";
    aux += element;
    aux += "\"";
    return aux;
}


