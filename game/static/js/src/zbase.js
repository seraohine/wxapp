class WxGame{
    constructor(id){
       this.id = id;
       this.$wx_game = $('#'+id);
       this.menu = new WxGameMenu(this);
    }
}
