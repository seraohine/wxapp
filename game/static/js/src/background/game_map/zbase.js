class GameMap extends WxGameObject{
    constructor(background){
        super();
        this.background = background;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.background.width;
        this.ctx.canvas.height =  this.background.height;
        this.background.$background.append(this.$canvas);
    }
    start(){
    }
    update(){
        this.render();
    }
    render(){
    this.ctx.fillStyle = "rgba(0,0,0,0.6)";
    this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}
