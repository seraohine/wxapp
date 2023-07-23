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
