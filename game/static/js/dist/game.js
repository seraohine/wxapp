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
class WxGame{
    constructor(id){
       this.id = id;
       this.$wx_game = $('#'+id);
       this.menu = new WxGameMenu(this);
       this.background = new WxGameBackground(this);

        this.start();
    }

    start(){

    }
}
