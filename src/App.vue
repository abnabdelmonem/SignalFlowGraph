<template>
  <v-app
    :style="{
      backgroundImage: 'url(' + require('@/assets/f.jpg') + ')',
      backgroundSize: 'cover',
    }"
  >
    <v-app-bar app color="white" style="height: 50px" dark>
      <v-toolbar-title class="text-uppercase teal--text">
        <span class="font-weight-light cyan--text">Single Flow Graph </span>
        <span>analysis</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- set nodes -->

      <v-dialog v-model="dialog" persistent max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark v-bind="attrs"  color="red lighten-5" v-on="on" small class="cyan--text" @click="NewNodes()">
            New
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline"> Set Number of Nodes </v-card-title>
          <v-card-actions>
            <v-select
              :items="values"
              label="Nodes number"
              v-model="NumNodes"
              required
              @click="valuesetter()"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="Nodesetter();dialog = false">
              Set
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <v-main>
      <v-row>
        <v-col>
          <v-card
            elevation="24"
            outlined
            shaped
          >
            <canvas id="myCanvas" width="1000px" height="600px"> </canvas>
          </v-card>
        </v-col>
        <v-col>
          <v-row>
            <!--  add branches-->
            <v-dialog v-model="dialogbra" persistent max-width="400px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" color="teal" small dark>
                  Add New Branch
                </v-btn>
              </template>
              <v-card width="400px">
                <v-card-title class="headline"> Add New Branch </v-card-title>
                <v-card-actions>
                  <v-col>
             <!-- select from node-->   
             <v-form ref="form" v-model="form"  > 
               
                  
             <v-select
              :items="Nodesname"
              label="From node"
              item-text="name"
              item-value="id"
              v-model="Fromnode"
              required
            ></v-select>
             <!-- select to node-->   
             <v-select
              :items="Nodesname"
              label="To node"
              item-text="name"
              item-value="id"
              v-model="Tonode"
              required
            ></v-select>
             <!-- set branch gain-->   
            <v-text-field
              name="Gain"
              label="Branch gain"
              v-model="gain"
              :rules="inputRules" 
            ></v-text-field>
            <v-row>
                  <v-spacer></v-spacer>
                  <v-btn color="teal" :disabled="!form" small dark @click="dialogbra = false;Addbranch()" text>
                    Add 
                  </v-btn>
                  <v-btn color="teal" small dark @click="dialogbra = false" text>
                    Cancel 
                  </v-btn> 
                  </v-row> </v-form></v-col>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn color="teal" small dark @click="analysis()">Analyis</v-btn>
            
          </v-row>
    <!--- solution --->
          <v-row>
            <span class="font-weight-bold cyan--text">Solution </span></v-row
          >
          <v-row>
            <v-card
              elevation="24"
              outlined
            >


               <v-list >
                 <!-- tranfer fun-->
                <v-list-item>
                  <v-list-item-title class="cyan--text">The transefer function : {{TF}}</v-list-item-title>
                </v-list-item>
                <!-- forward paths and thier gains-->
                <v-list-group
                  :value="true"
                  sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-title>Forward Paths :</v-list-item-title>
                  </template>
                    <v-list-item
                      v-for="([], i) in forwardPaths"
                      :key="i"
                      link
                    >
                      <v-list-item-content>
                       <v-list-item-subtitle>P{{i+1}} = {{forwardPathsNodes[i]}}</v-list-item-subtitle>
                       <v-list-item-subtitle> Gain = {{forwardPaths[i].gain}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-group>
                  <!-- loops and thier gains-->
                <v-list-group
                  :value="true"
                  sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-title>Loops :</v-list-item-title>
                  </template>
                    <v-list-item
                      v-for="([], i) in loops"
                      :key="i"
                      link
                    >
                      <v-list-item-content>
                       <v-list-item-subtitle>L{{i}} = {{loopsPathsNodes[i]}}</v-list-item-subtitle>
                       <v-list-item-subtitle> Gain = {{loops[i].gain}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <!-- non touching loops -->
                <v-list-group
                  :value="true"
                  sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-title>Non-Touching Loops :</v-list-item-title>
                  </template>
                    <v-list-item
                      v-for="([], i) in nonTouchingLoops"
                      :key="i"
                      link
                    > 
                      <v-list-item-content>
                       <v-list-item-subtitle>{{nonTouchingLoops[i].length}} non-touching loops : {{nonTouchingPathsNodes[i]}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                </v-list-group>
               <v-list-group
                  :value="true"
                  sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-title><v-icon small>mdi-triangle</v-icon><sub>s</sub></v-list-item-title>
                  </template>
                    <v-list-item
                      v-for="([], i) in deltas"
                      :key="i"
                      link
                    > 
                      <v-list-item-content>
                       <v-list-item-subtitle class="text-teal"><v-icon small color="teal">mdi-triangle</v-icon><sub>{{i+1}}</sub>  = {{deltas[i]}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                 <!--total delta-->
                <v-list-item > 
                  <v-list-item-title>  <v-icon  color="cyan" small>mdi-triangle</v-icon> = {{totaldelta}}</v-list-item-title>
                </v-list-item>
              </v-list>
            
            </v-card
          ></v-row>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import {node} from "./graph.js";
import {edge} from "./graph.js";
import {graph} from "./index.js";

export default {
  name: "App",
  
  data: () => ({
    dialog: true,//dialoge to set nodes
    dialogbra: false,//dialoge to add new branch
    NumNodes: 2,//number of nodes selected
    Nodesname:[],//names of nodes selected
    Fromnode:0,
    Tonode:1,
    gain:1,//gain of the new branch 
    values: [2], // option of nodes number
    nodeToDraw: [],//array of nodes save id,x,y
    canvas:null,//drawing stuff
    ctx:null,//drawing too
    edges:[],//array of edges v1,v2,gain save every edge (use in analysis)
    forwardPaths: [],//[ [ [0,1,2,3,4,5,6,7],50] , [ [0,1,3,4,5,6,7],40] , [ [0,1,6,7],100] ],//should be changed
    forwardPathsNodes: [],//array of strings of forward path
    loops: [],//[ [ [0,1,2,3,4,5],25] , [ [0,1,3,4,5,6],30] ],
    nonTouchingLoops:[],// [ [0,1],[0,2],[0,3],[2,3,4],[3,4,5,7] ],
    loopsPathsNodes: [],
    nonTouchingPathsNodes: [],
    TF:0,
    //delta
    deltas:[],
    totaldelta:0,
    //rules
    inputRules: [
        v => !!v || 'This field is required',
      ],
      form: false,
  }),
  methods: {
    /**Convert the array of nodes -of forward paths and loops- into string to show */
    setPathsNodes(paths , pathNodes) {
      for (var i = 0 ; i < paths.length ; i++){
        var nodes ='Y';
        for (var j = 0 ; j < paths[i].nodes.length ; j++){
          nodes += paths[i].nodes[j];
          if (j+1 != paths[i].nodes.length)
            nodes +=' to Y';
        }
        pathNodes.push(nodes);
      }
      
    },
    /**Convert the NonTouchingLoops into string to show */
    showNonTouchingLoops() {
      for (var i = 0 ; i < this.nonTouchingLoops.length ; i++){
        var nonTouching ='L';
        for (var j = 0 ; j < this.nonTouchingLoops[i].length ; j++){
          nonTouching += this.nonTouchingLoops[i][j];
          if (j+1 != this.nonTouchingLoops[i].length)
            nonTouching +=' L';
        }
        this.nonTouchingPathsNodes.push(nonTouching);
      }
    },
    /**set number of nodes options */
    valuesetter() {
      for (let i = 3; i <= 15; i++) {
        this.values.push(i);
      }
    },
    /**set nodes names & draw them */
    Nodesetter(){
      let ctx = this.canvas.getContext("2d");
      var centerY = this.canvas.height/2;
      var centerX = this.canvas.width/this.NumNodes;
      for (let i = 0; i < this.NumNodes; i++) {
        this.Nodesname.push({name:"Y"+i.toString(),id:i});
        var myNode = new node(i, centerX+i*60, centerY)
        myNode.draw(ctx);
        this.nodeToDraw.push(myNode);
      }
    },
    /**to start again */
    NewNodes(){
      this.values=[2];
      this.Nodesname=[];
      this.nodeToDraw = [];
      this.edges = [];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);//clear canvs
    },
    /**add edge to list of edges
     * draw that edge and update canvas
     */
    Addbranch(){
      var temp = new edge(this.Fromnode,this.Tonode,parseFloat(this.gain));
      let flag = 1;
      for(let i = 0; i < this.edges.length; i++){//handle multiple gains for same edge
        var temp2 = this.edges[i];
        if(temp.firstNode == temp2.firstNode && temp.secoundNode == temp2.secoundNode ){//check for same edge 
          temp2.gain = temp2.gain + temp.gain;
          this.edges[i].gain = temp2.gain;
          flag = 0;
          break;
        }
      }
      if(flag == 1){
        this.edges.push(temp);
      }
      this.drawEdge(this.Fromnode,this.Tonode,temp.gain);
      this.updateCanvas();
    },
    //draw a given edge with its first & secound node IDs and the text(gain) above the edge
    drawEdge(id1,id2,text){
      let ctx = this.canvas.getContext("2d");
      var node1 = this.nodeToDraw[id1];
      var node2 = this.nodeToDraw[id2];
      let state = node2.id - node1.id ;// +ve values means forward path -ve values means backword
      if(state == 1){ //direct pass and consecutive nodes
        let x1 = node1.x + 15;
        let y1 = node1.y;
        let x2 = node2.x - 15;
        let y2 = node2.y;
        this.drawLine(x1,y1,x2,y2,ctx);
        this.drawArrowHead((x2+x1)/2 + 5,y1,ctx,1,text);//draw arrow in the middle of the line
      }
      else if(state > 0){ //direct pass but not consecutive nodes
        let x = (node2.x + node1.x)/2;
        let y = node1.y;
        let r = x - node1.x;
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.arc(x, y, r, 0, Math.PI, true);//draw half circle anti-clock wise
        ctx.stroke();
        this.drawArrowHead(x,y-r,ctx,1,text);
      }
      else if(state < 0){ //feedback
        let x = (node2.x + node1.x)/2;
        let y = node1.y;
        let r = x - node2.x;
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.arc(x, y, r, 0, Math.PI, false);//draw half circle clock wise
        ctx.stroke();
        this.drawArrowHead(x,y+r,ctx,0,text);
      }
      else{//feedback to the same node
        let x = node1.x;
        let y = node1.y - 15;
        let r = 15;
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.arc(x, y, r, 0, Math.PI*2, true);//draw full circle
        ctx.stroke();
        node1.draw(ctx);//render the node to adjust the look
        this.drawArrowHead(x,y-r,ctx,2,text);
      }
    },
    drawArrowHead(x,y,ctx,direction,text){//direction 1 for forward, 0 for feedback and 2 for feedback to the same node
      let angle;
      if(direction == 1){
        angle = 225;
      }
      else{
        angle = 315;
      }
      //draw the arrow as triangle
      ctx.beginPath();
      ctx.moveTo(x,y);
      let x2 = x + Math.cos(Math.PI * angle / 180) * 7.5;
      let y2 = y + Math.sin(Math.PI * angle / 180) * 7.5;
      ctx.lineTo(x2,y2);
      ctx.lineTo(x2,y2 + Math.sqrt(2)*7.5);
      ctx.lineTo(x,y);
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.fill();
      //display gain
      ctx.beginPath();
      ctx.font = "15px Arial";
      ctx.textAlign = 'center';
      ctx.fillStyle = 'black';
      if(direction == 1){//froward
        ctx.fillText(text, x-5, y-15);
      }
      else if(direction == 0){ //feedback
        ctx.fillText(text, x+5, y+15);
      }
      else{//feedback to same node
        ctx.fillText(text, x, y-10);
      }
    },
    //draw straigth line
    drawLine(x1,y1,x2,y2,ctx){
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    },
    //re-draw the canvas to render the text above arrows
    updateCanvas(){
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for(let i = 0; i < this.nodeToDraw.length; i++){
        var temp = this.nodeToDraw[i];
        temp.draw(this.ctx);
      }
      for(let i = 0; i < this.edges.length; i++){
        if(this.edges[i].gain != 0){
          var temp1 = this.edges[i];
          this.drawEdge(temp1.firstNode,temp1.secoundNode,temp1.gain);
        }
      }
    },
    /*
     * it removes zero gain edges from the "edges" array to make it ready 
     * for the analysis & add brackets to the multiple gain*/
    analysis(){
      var g= new graph();
      g.createNodes(this.NumNodes);
      for(var i=0;i<this.edges.length;i++){
        g.addEdge(this.edges[i].firstNode,this.edges[i].secoundNode,this.edges[i].gain);
      }
       g.setOutputNode(this.NumNodes-1);
       g.find_all_forward_paths(0);
       g.find_all_loops();
       g.find_all_nontouching_loops();
       console.log(g.nonTouchingLoops)
       console.log(g.nodes)
       console.log(g.loops)
       this.forwardPaths=g.forwardPaths;
       this.loops=g.loops;
       this.nonTouchingLoops=g.nonTouchingLoops
       this.totaldelta=g.delta();
       this.deltas=g.deltas();
       this.TF=g.transf_fun();
       this.setPathsNodes(g.forwardPaths , this.forwardPathsNodes);
       this.setPathsNodes(this.loops , this.loopsPathsNodes);
       this.showNonTouchingLoops();
    },
  },
  mounted() {
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");

  },

};
</script>