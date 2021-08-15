
Module.onRuntimeInitialized = _ => {
   const param = [[2, 5], [3, 7]];
   dag_gen = new Module.DAGGenerator();
   exp_eval = new Module.ExpressionEvaluation();
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
   match_exp.compute_expressions(0);
   expressions = dag_gen.expressions;

   //display question
   var question = "Evaluate the expression<br/>" + expressions.get(0) + "<br/>when ";
   for (var i = 0; i < dag_gen.num_nodes; i++) {
      if (content.get(i).charCodeAt(0) >= 97 && content.get(i).charCodeAt(0) <= 122)
         question = question + content.get(i) + " = " + values.get(i) + " , ";
   }
   document.getElementById("question_area").innerHTML = question;

   //compute values
   exp_eval.init();
   answer = exp_eval.evaluate(0);
   values = dag_gen.values;
   order_of_evaluation = exp_eval.order_of_evaluation;
   //graph building starts
   build_graph(num_vars, num_nodes, content, adj);

   document.getElementById("btn_check").onclick = function check_ans() {
      var student_answer = parseInt(document.getElementById("student_answer").value);
      if (student_answer !== 0 && student_answer !== 1)
         document.getElementById("result_area").innerHTML = "This is not boolean value";
      else {
         if (answer == student_answer)
            document.getElementById("result_area").innerHTML = "CORRECT";
         else
            document.getElementById("result_area").innerHTML = "WRONG";
      }
   }
   var ptr = 0;
   document.getElementById("btn_visualize").onclick = function visualize() {
      var node = order_of_evaluation.get(ptr);
      cy.getElementById(node).data("name", values.get(node));
      cy.getElementById(node).style("background-color", "blue")
      ptr++;
      if (ptr == num_nodes)
         document.getElementById("btn_visualize").disabled=true;
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