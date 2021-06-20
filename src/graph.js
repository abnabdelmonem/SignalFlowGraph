class node{
    constructor(id,x,y){
        this.id = id;
        this.x = x;
        this.y = y;
    }
    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2, false);
        ctx.fill()
        //text part
        ctx.beginPath();
        ctx.font = "13px Arial";
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Y'+this.id, this.x, this.y+4);
        ctx.fill();
    }
}
class edge{
    constructor(firstNode,secoundNode,gain){
        this.firstNode = firstNode;
        this.secoundNode = secoundNode;
        this.gain = gain;
    }
}
export{node};
export{edge};