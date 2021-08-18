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

    find_arc = new Module.FindMissingArc();
    find_arc.choose_arc();
    for (var i = 0; i < find_arc.arcs_to_display.size(); i++) {
        var cur = find_arc.arcs_to_display.get(i).first.first.first + "-" + find_arc.arcs_to_display.get(i).first.first.second + "-" + String.fromCharCode(find_arc.arcs_to_display.get(i).first.second) + " ";
        cur += find_arc.arcs_to_display.get(i).second.first.first + "-" + find_arc.arcs_to_display.get(i).second.first.second + "-" + String.fromCharCode(find_arc.arcs_to_display.get(i).second.second);
        cur += "<br/>";
        document.getElementById("question_area").innerHTML += cur;
    }

    document.getElementById("btn_check").onclick = function check() {
        var fx = parseInt(document.getElementById("fx").value);
        var fy = parseInt(document.getElementById("fy").value);
        var fdir = parseInt(document.getElementById("fdir").value.charCodeAt(0));
        var sx = parseInt(document.getElementById("sx").value);
        var sy = parseInt(document.getElementById("sy").value);
        var sdir = parseInt(document.getElementById("sdir").value.charCodeAt(0));
        var res = find_arc.check(fx, fy, fdir, sx, sy, sdir);
        alert(res);
    }
};