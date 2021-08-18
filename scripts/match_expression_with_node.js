Module.onRuntimeInitialized = _ => {
    const param = [[2, 5], [3, 7]];
    dag_gen = new Module.DAGGenerator();
    match_exp = new Module.MatchExpression();

    //take input from user
    num_vars = param[0][0];
    num_nodes = param[0][1];

    //generate the dag and fetch their values
    dag_gen.num_nodes = num_nodes;
    dag_gen.num_vars = num_vars;
    dag_gen.do_all_tasks();
    var content = dag_gen.content;
    var j = 0;
    while (content.get(j) != null) {
        if (content.get(j) === "=>")
            content.set(j, "⇒");
        else if (content.get(j) === "<=>")
            content.set(j, "⇔");
        j++;
    }
    num_nodes = dag_gen.num_nodes;

    values = dag_gen.values;
    adj = dag_gen.adj;
    depth = dag_gen.depth;

    //compute the expression
    match_exp.init();
    match_exp.preprocessing();
    exp_to_display = match_exp.exp_to_display;
    document.getElementById("question_area").innerHTML = "Match each expression with their respective nodes <br/>";
    build_graph(num_vars, num_nodes, content, adj);
    add_slots();

    function add_slots() {
        var resp = "";
        for (var i = 0; i < exp_to_display.size(); i++) {
            var cur = document.createElement("div");

            var it_num = document.createElement("input");
            it_num.setAttribute("type", "input");
            it_num.setAttribute("disabled", "true");
            it_num.setAttribute("value", exp_to_display.get(i));
            it_num.style.width = "80%";

            var node_id = document.createElement("input");
            node_id.setAttribute("type", "input");
            node_id.style.width = "20%";

            cur.appendChild(it_num);
            cur.appendChild(node_id);

            document.getElementById("response_area").append(cur);
        }
    }

    document.getElementById("btn_check").onclick = function check() {
        for (var i = 0; i < exp_to_display.size(); i++) {
            match_exp.add_response(parseInt((document.getElementById("response_area").children[i]).children[1].value));
        }
        match_exp.check();
        for(var i=0;i<match_exp.wrong_response.size();i++)
        {
            console.log(match_exp.wrong_response.get(i));
        }
    }

    function build_graph(num_vars, num_nodes, content, adj) {

        cy = cytoscape({

            container: document.getElementById('cy'), // container to render in
            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'color': 'white',
                        'label': 'data(name)',
                        'width': '40px',
                        'height': '40px',
                        'text-valign': 'center',
                        'text-halign': 'center'
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': 'blue',
                        'target-arrow-color': 'blue',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'unbundled-bezier',
                        'control-point-weight': '0.5',
                        'control-point-distance': '0',

                    }
                }
            ],

        });

        var arr = new Array(num_nodes).fill(0);
        x_coor = dag_gen.x_coor;
        y_coor = dag_gen.y_coor;
        edge_carvature = dag_gen.edge_carvature;

        //add nodes
        for (var i = 0; i < num_nodes; i++) {
            cy.add([
                { group: 'nodes', data: { id: i, name: content.get(i) }, position: { x: 100 * (x_coor.get(i) + 1), y: 100 * (y_coor.get(i) + 1) } }
            ]);
        }
        arr = null;

        //add edges
        for (var i = 0; i < num_nodes; i++) {
            var j = 0;
            while (adj.get(i).get(j) != null) {
                var tar = adj.get(i).get(j);
                cy.add([
                    { group: 'edges', data: { id: i + 't' + tar, source: i, target: tar } }
                ]);
                if (content.get(i) == "~") {
                    cy.getElementById(i + 't' + tar).style("line-color", "#000");
                    cy.getElementById(i + 't' + tar).style("target-arrow-color", "#000");
                }
                else if (j == 0) {
                    cy.getElementById(i + 't' + tar).style("line-color", "red");
                    cy.getElementById(i + 't' + tar).style("target-arrow-color", "red");
                }

                //bend edges if they pass through nodes
                cy.getElementById(i + 't' + tar).style("control-point-weight", "0.5");
                cy.getElementById(i + 't' + tar).style("control-point-distance", -20 * edge_carvature.get(i).get(j));

                j++;
            }
        }
    }
};