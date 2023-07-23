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
let WX_GAME_OBJECT = [];

class WxGameObject{
    constructor(){
        WX_GAME_OBJECT.push(this);
        this.has_called_start = false;   //是否执行过start函数
        this.timedelta = 0;       //当前帧举例上一帧的时间间隔
    }
    start(){
                    //在第一镇帧执行
    }
    update(){
                    //每一帧都会执行
    }
    on_destroy(){
                    //被销毁前执行一次
    }
    destroy(){          //销毁该物体
        this.on_destroy();

        for(let i = 0;i < WX_GAME_OBJECT.length;i++){
            if(WX_GAME_OBJECT[i] === this){
                WX_GAME_OBJECT.splice(i,1);
                break;
            }
        }
    }
}
let last_timestamp;
let WX_GAME_ANIMATION =  function(timestamp){
    for(let i = 0;i<WX_GAME_OBJECT.length;i++){
    let obj = WX_GAME_OBJECT[i];
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.timedelta = obj.timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(WX_GAME_ANIMATION);
}

requestAnimationFrame(WX_GAME_ANIMATION);
class WxGameBackground{
    constructor(root){
       this.root = root;
       this.$background = $(`<div class="wx_game_background"></div>`);


      // this.hide();
       this.root.$wx_game.append(this.$background);
       this.width = this.$background.width();
       this.height= this.$background.height();
       this.game_map = new GameMap(this);
       this.start();
    }
    start(){

    }
    hide(){
    this.$background.hide(); //关闭游戏界面
    }
    show(){
    this.$background.show(); //打开游戏界面
    }
}
class WxGameMenu{
    constructor(root){
        this.root = root;
        this.$menu = $(`
<div class = "wx_game_menu">
   <div class="wx_game_menu_field">
         <div class = "wx_game_menu_field_item wx_game_menu_field_item_single_mode"> 单人模式 </div><br>
         <div class = "wx_game_menu_field_item wx_game_menu_field_item_multi_mode">多人模式 </div><br>
         <div class = "wx_game_menu_field_item wx_game_menu_field_item_settings">设置</div>
   </div>
</div>
`);

    this.root.$wx_game.append(this.$menu);
    this.$single_mode = this.$menu.find('.wx_game_menu_field_item_single_mode');
    this.$multi_mode = this.$menu.find('.wx_game_menu_field_item_multi_mode');
    this.$settings = this.$menu.find('.wx_game_menu_field_item_settings');
   
    this.start();
    }
    start(){
    this.add_listening_events();
    }
    add_listening_events(){
    let outer = this;
    this.$single_mode.click(function(){
        outer.hide();
        outer.root.background.show();
    });
    this.$multi_mode.click(function(){
       console.log("click multi");
    });
    this.$settings.click(function(){
       console.log("click settings");
    });
    }

    show(){
     this.$menu.show();           //打开menu界面
    }
    hide(){
     this.$menu.hide();           //关闭menu界面
    }









}
export class WxGame{
    constructor(id){
       this.id = id;
       this.$wx_game = $('#'+id);
      // this.menu = new WxGameMenu(this);
       this.background = new WxGameBackground(this);
       this.start();
    }

    start(){

    }
}
