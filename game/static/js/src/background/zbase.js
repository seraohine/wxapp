class WxGameBackground{
    constructor(root){
       this.root = root;
       this.$background = $(`<div>游戏界面</div>`);


       this.hide();
       this.root.$wx_game.append(this.$background);

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
