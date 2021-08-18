Module.onRuntimeInitialized = _ => {
    //declare all variables
    var grid_size, grid;
    var cross_gen, CSPify;
    function addBox(type) {
        var element = document.createElement("input");
        element.setAttribute("type", "text");
        element.setAttribute("value", "");

        if (type === '#') {
            element.setAttribute("disabled", "disabled");
            element.style.cssText = `
              background-color:black;
               width:30px; 
               height:30px;
             `;
        }
        else {
            element.style.cssText = `
              background-color:white;
               width:30px;
               height:30px; 
             `;
        }
        document.getElementById("crossword_area").append(element);
    }
    document.getElementById("crossword_area").innerHTML = "";
    cross_gen = new Module.CrosswordGenerator();
    //take input from user
    cross_gen.grid_size = 9;
    grid_size = cross_gen.grid_size;
    //generate grid
    cross_gen.do_all_tasks();
    grid = cross_gen.grid;
    CSPify = new Module.CSPify();
    CSPify.do_all_tasks();

    var num = document.createElement("span");
    num.style.display = "inline-block";
    num.style.width = "20px";
    document.getElementById("crossword_area").append(num);

    for (var i = 1; i <= grid_size; i++) {
        var num = document.createElement("span");
        num.style.display = "inline-block";
        num.style.width = "30px";
        num.innerHTML = i;
        // if(i==grid_size)
        // num.innerHTML+="<br/>";
        document.getElementById("crossword_area").append(num);
    }

    document.getElementById("crossword_area").innerHTML += "<br/>";

    for (var i = 1; i <= grid_size; i++) {
        var num = document.createElement("span");
        num.innerHTML = i;
        document.getElementById("crossword_area").append(num);

        for (var j = 1; j <= grid_size; j++) {
            if (grid.get(i).get(j) != 35)
                addBox('.');
            else
                addBox('#');
        }
        document.getElementById("crossword_area").innerHTML = document.getElementById("crossword_area").innerHTML + "<br/>";
    }
    document.getElementById("question_area").setAttribute("style", "visiblity:visible");

    document.getElementById("add_node").onclick = function add_node() {
        var list_elem = document.createElement("li");
        var row_text = document.createElement("input");
        row_text.setAttribute("type", "text");
        row_text.setAttribute("value", "");
        row_text.setAttribute("style", "width:20px");
        list_elem.append(row_text);

        var column_text = document.createElement("input");
        column_text.setAttribute("type", "text");
        column_text.setAttribute("value", "");
        column_text.setAttribute("style", "width:20px");
        list_elem.append(column_text);

        var direction_text = document.createElement("input");
        direction_text.setAttribute("type", "text");
        direction_text.setAttribute("value", "");
        direction_text.setAttribute("style", "width:20px");
        list_elem.append(direction_text);

        var delete_button = document.createElement("button");
        delete_button.textContent = "delete";
        list_elem.append(delete_button);
        delete_button.onclick = function deletefromlist() {
            delete_button.parentElement.parentElement.removeChild(delete_button.parentElement);
        }

        list_elem.setAttribute("style", "padding:10px");
        document.getElementById("nodes_list").append(list_elem);
    }
    document.getElementById("btn_check").onclick = function check() {
        var findCrosswordNode = new Module.FindCrosswordNodes();

        var ol = document.getElementById("nodes_list");
        for (var i = 0; i < ol.children.length;) {
            var row = parseInt(ol.children[i].children[0].value), col = parseInt(ol.children[i].children[1].value);
            findCrosswordNode.add_node(row, col, (ol.children[i].children[2].value).charCodeAt(0));
            i++;
        }

        var ans = findCrosswordNode.check();
        var wrong_nodes = findCrosswordNode.wrong_nodes;
        var missed_nodes = findCrosswordNode.missed_nodes;
        var correct_nodes = findCrosswordNode.correct_nodes;
        var result_area = document.getElementById("result_area");
        for (var i = 0; i < correct_nodes.size(); i++) {
            result_area.innerHTML += "You marked correctly : " + correct_nodes.get(i).first.first + "-" + correct_nodes.get(i).first.second + "-" + String.fromCharCode(correct_nodes.get(i).second) + "<br/>";
        }
        for (var i = 0; i < wrong_nodes.size(); i++) {
            result_area.innerHTML += "You marked wrong : " + wrong_nodes.get(i).first.first + "-" + wrong_nodes.get(i).first.second + "-" + String.fromCharCode(wrong_nodes.get(i).second) + "<br/>";
        }
        for (var i = 0; i < missed_nodes.size(); i++) {
            result_area.innerHTML += "You missed : " + missed_nodes.get(i).first.first + "-" + missed_nodes.get(i).first.second + "-" + String.fromCharCode(missed_nodes.get(i).second) + "<br/>";
        }
    }
};