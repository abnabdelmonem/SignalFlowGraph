class edge{
    /**
     * 
     * @param {*int} to 
     * @param {*double} gain 
     */
    constructor(to,gain){
    this.toNode = to ; 
    this.gain = gain ;
    }
}
class node{
    
    constructor(){
        this.edges = [];
    }
    /**
     * adding a new edge to a vertex
     * @param {edge} edge 
     */
    addEdge(edge){
       this.edges.push(edge);
    }
}
class forwardPath{
    constructor(){
        this.nodes = []; // just numbers of nodes.
        this.gain = 1; // initial gain
    }
}
class loop{
    constructor(){
        this.nodes = []; // just numbers of nodes.
        this.gain = 1; // initial gain
    }
}
class graph{
    constructor(){
        this.nodes = [];
        this.forwardPaths = [];
        this.loops = [];
        this.visited = [];
        this.c = 0 ; // output node
        this.nonTouchingLoops =[];
    }
    /**
     * Create nodes and add them to the nodes array.
     * @param {*int} size number of graph nodes. 
     */
    createNodes(size){
        for(var i = 0;i<size;i++){
            var a = new node();
            this.nodes.push(a);
         }
    }
    addEdge(from,to,gain){
        this.nodes[from].addEdge(new edge(to,gain));
    }
    setOutputNode(c){
        this.c =  c ;
    }
    /**
     * Getting all forward paths from node r to node c. 
     * @param {*int} r index of input node. 
     */
    find_all_forward_paths(r){
         // set the visited array to false initially.
        this.visited = new Array(this.nodes.length).fill(false);
        var path = new forwardPath();
       this.dfs(r,path);
           
    }
    /**
     * Depth-First-Search for getting forward paths.
     * @param {*int} r index of input node.  
     * @param {*forwardPath} path forward_path to be constructed. 
     */
    dfs(r,path){
      if(r == this.c){
        path.nodes.push(r);
        var p = new forwardPath() ;
        p = JSON.parse(JSON.stringify(path));
        this.forwardPaths.push(p);
        return ; // end of the forward path.
      }
      this.visited[r] = true;
      path.nodes.push(r);
     // var a = this.visited ;
      for(var i =0;i<this.nodes[r].edges.length;i++){
              var e = this.nodes[r].edges[i] ;
              if(!this.visited[e.toNode]){
                var pp = new forwardPath() ;
                pp = JSON.parse(JSON.stringify(path));
                pp.gain = pp.gain * e.gain;
                this.dfs(e.toNode,pp);
            }
      }
    this.visited[r] = false ;
    path.nodes.pop();
    return ;
    }

        /**
     * Method to get intersection between arrays.
     * @param {*LIST} a1 first list.  
     * @param {*LIST} a2 second list. 
     */
    getArraysIntersection(a1,a2){
        return  a1.filter(function(n) { return a2.indexOf(n) !== -1;});
    }
    
    /*
    This method adds the indices of all combinations of N non-touching loops to the array nontouching_loops.
    The indices match those in the loops array of the graph.
    */
    find_all_nontouching_loops(){
        var list= this.loops;
        var len=this.loops.length;
        var innerRes=[];
        var concatHolder=[];    
        var result=[];        
        var intersection;
        
        for(var i=2;i<=len;i++){
            for(var j=0;j<len-1;j++){
                intersection=list[j].nodes;
                concatHolder=intersection;
                var counter=1; 
                innerRes=[]
                for(var k=j+1;k<len;k++){
                        
                    intersection =this.getArraysIntersection(concatHolder,list[k].nodes)
                    if(intersection.length==0){
                        if(!innerRes.includes(j)){
                        innerRes.push(j);
                        }
                        innerRes.push(k); 
                        counter++;  
                        concatHolder=concatHolder.concat(list[k].nodes)
                    }
                    if(counter==i){
                        result.push(innerRes);
                        intersection=list[j].nodes;
                        innerRes=[]
                        concatHolder=[]
                        counter=1; 
                    }
                }
            }
        }   
        this.nonTouchingLoops=result;
    }
    
    ////////////////////////////////////////////////
   /**
     * Getting all loops in the graph
     */
    find_all_loops(){
        // set the visited array to false initially.
       this.visited = new Array(this.nodes.length).fill(false); 
       this.dfsLoops();    
   }
   /**
     * Depth-First-Search for getting all loops
     */
    dfsLoops(){
        var lastLoopNodeIndex = null;
        for (var k = 0; k < this.nodes.length;k++){
            var startingNodeIndex = k;
            for(var i = k;i<this.nodes.length;i++){
                var currentNode = this.nodes[i];
                for (var j = 0; j < currentNode.edges.length ; j++){
                    var cycle = new loop();
                    lastLoopNodeIndex = null;
                    var destination = currentNode.edges[j].toNode;
                    if (destination == startingNodeIndex){
                        lastLoopNodeIndex = i;
                    }
                    if (lastLoopNodeIndex != null){
                        this.dfsModified(startingNodeIndex,cycle,lastLoopNodeIndex,startingNodeIndex);
                    }
                }
                
            }
            this.visited[k] = true;
        }

      return ;
      }
      
      

     /**
     * Depth-First-Search modified for getting a loop
     * @param {*int} r index of input node.  
     * @param {*forwardPath} path forward_path to be constructed. 
     * @param {*int} f index of node that has a backwards edge towards start of loop
     * @param {*int} start index of start of loop
     */
    dfsModified(r,path,f,start){
        if(r == f){
          path.nodes.push(r);
          path.nodes.push(start);
          var p = new forwardPath() ;
          p = JSON.parse(JSON.stringify(path));
          for(var i =0;i<this.nodes[r].edges.length;i++){
            var currentEdge = this.nodes[r].edges[i] ;
            if (currentEdge.toNode == start){
                p.gain = p.gain * currentEdge.gain;
                break;
            }
        } 
          this.loops.push(p);
          return ; // end of the forward path.
        }
        this.visited[r] = true;
        path.nodes.push(r);
        for(var j = 0;j<this.nodes[r].edges.length;j++){
                var e = this.nodes[r].edges[j] ;
                if(!this.visited[e.toNode]){
                  var pp = new forwardPath() ;
                  pp = JSON.parse(JSON.stringify(path));
                  pp.gain = pp.gain * e.gain;
                  this.dfsModified(e.toNode,pp,f,start);
              }
        }
      this.visited[r] = false ;
      path.nodes.pop();
      return ;
      }
    ///////////////////////////////////////////////////////////
     transf_fun() {
        var t_f = 0.0;
        var ds=this.deltas();
        var d = this.delta();
      for (var i = 0; i <  this.forwardPaths.length; i++) {
        t_f +=   this.forwardPaths[i].gain * ds[i];
      }
      return t_f/d;
    }
    
     delta() {
        var delta = 1;
      for (var z = 0; z <  this.loops.length; z++) {
        delta -=  this.loops[z].gain;
      }
      for (var i = 0; i <  this.nonTouchingLoops.length; i++) {
        var m = 1;
        for (var j = 0; j <  this.nonTouchingLoops[i].length; j++) {
          m *=  this.loops[  this.nonTouchingLoops[i][j] ].gain;
        }
        m *= Math.pow(-1,  this.nonTouchingLoops[i].length);
        delta += m;
      }
      return delta;
    }
    
     deltas() {
        var deltas = [];
    deltas.length =  this.forwardPaths.length;
      for (var i = 0; i < deltas.length; i++) {
        deltas[i] = 1;
        for (var j = 0; j < this.loops.length; j++) {
          if (this.not_mutual( this.forwardPaths[i].nodes,  this.loops[j].nodes)) deltas[i] -=  this.loops[j].gain;
        }
        if (deltas[i] == 1) continue;
        for (var k = 0; k <  this.nonTouchingLoops.length; k++) {
          var m = 1;
          for (var f = 0; f <  this.nonTouchingLoops[k].length; f++) {
            var flag = false;
            if (!this.not_mutual( this.forwardPaths[i].nodes,  this.loops[ this.nonTouchingLoops[k][f]].nodes)) {
              flag = true;
              break;
            }
            m *=  this.loops[ this.nonTouchingLoops[k][f]].gain;
          }
          m *= Math.pow(-1,  this.nonTouchingLoops[k].length);
          if (!flag) deltas[i] += m;
        }
      }
      return deltas;
    }
    
     not_mutual(a1, a2) {
      return this.getArraysIntersection(a1, a2).length == 0;
    }
}


export{ graph};

