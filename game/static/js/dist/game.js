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
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(WX_GAME_ANIMATION);
}

requestAnimationFrame(WX_GAME_ANIMATION);
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
    this.ctx.fillStyle = "rgba(0,0,0,0.2)";
    this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}
class Player extends WxGameObject {
    constructor(background, x, y, radius, color, speed, is_me, life) {  //传入需要处理的参数
        super();
        this.background = background;
        this.ctx = this.background.game_map.ctx;
        //坐标
        this.x = x;
        this.y = y;

        //速度方向
        this.vx = 0;
        this.vy = 0;

        //受到伤害的速度方向和速度
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;

        this.friction = 0.9;  //摩擦力
        this.move_length = 0;  //移动距离

        this.radius = radius;  //该对象的半径
        this.color = color;  //颜色
        this.speed = speed;  //速度

        this.is_me = is_me;  //是否是玩家
        this.life = life;  //生命值

        this.eps = 0.1;  //精度

        this.cur_skill = null;  //当前选择的技能
        this.spent_time = 0;  //开局静默期
    }

    start() {
        //是自己本身
        if(this.is_me) {
            this.add_listening_events();  //通过监听函数控制
        }
        else {  //敌人
            //通过随机生成的坐标控制移动
            let tx = Math.random()*this.background.width;
            let ty = Math.random()*this.background.height;
            this.move_to(tx, ty);
        }

    }

    //监听函数，判断鼠标点击行为
    add_listening_events() { 
        let outer = this;

        if(this.life <= 0) return false;  //死亡不再接收指令

        this.background.game_map.$canvas.on("contextmenu", function() {  //截断鼠标右键显示菜单选项
            return false;
        });

        //监听鼠标移动
        this.background.game_map.$canvas.mousedown(function(e) {
            if(e.which === 3) {  //判断鼠标的键位 1是左键， 2是滚轮
                outer.move_to(e.clientX, e.clientY);  //鼠标点击移动API
            }
            else if(e.which === 1) {
                if(outer.cur_skill === "fireball") {  //发射火球
                    outer.shoot_fireball(e.clientX, e.clientY, this.color);
                }
                else if(outer.cur_skill === "go_to") {  //闪现方向
                    outer.go_to(e.clientX, e.clientY);
                }
                outer.cur_skill = null;  //清空当前的技能选择
            }
        });

        //监听键盘按键
        $(window).keydown(function(e) {
            //keycode
            if(e.which === 81) {  //按 'Q' 发射火球
                outer.cur_skill = "fireball";
                return false;
            }
            else if(e.which === 69) {  //按 'E' 闪现
                outer.cur_skill = "go_to";
                return false;
            }
        });
    }

    //发射火球
    shoot_fireball(tx, ty, color) {
        let x = this.x, y = this.y;  //发射位置为当前位置
        let radius = this.background.height*0.01;  //火球半径
        let angle = Math.atan2(ty - this.y, tx - this.x);  //计算当前位置相对鼠标点击坐标的方向角度
        let vx = Math.cos(angle), vy = Math.sin(angle);  //计算速度的方向
        let speed = this.speed*2;  //火球速度为自身移动速度的2倍数
        let move_length = this.background.height*1;  //火球移动的最大距离
        if(this.life > 0) new FireBall(this.background, this, x, y, radius, vx, vy, this.color, speed, move_length, this.background.height*0.01);  //当前对象存活才可发射火球
        //console.log("fireball", tx, ty);
        //if(this.is_me) console.log("life:", this.life);
    }

    //瞬移操作
    go_to(tx, ty) {
        this.x = tx;  //直接更新位置
        this.y = ty;
        this.move_length = 0;  //重置移动方向和距离
    }

    //计算移动的相对距离
    get_dist(x1, y1, x2, y2) { 
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx*dx + dy*dy);
    }

    //移动的方向
    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);  //计算相对位置的角度
        this.vx = Math.cos(angle), this.vy = Math.sin(angle);
    }

    //受到攻击后执行的逻辑
    is_attacked(angle, damage) {
        if(this.life <= 0) return false;  //生命值归零的对象直接忽视
        //释放粒子效果
        for(let i = 0; i < 10 + Math.random()*5; i ++){
            let x = this.x, y = this.y;
            let radius = this.radius*Math.random()*0.11;  //粒子大小半径
            let angle = Math.PI*2*Math.random();  //随机的角度
            let vx = Math.cos(angle), vy = Math.sin(angle);
            let color = this.color;  //粒子颜色
            let speed = this.speed*4;  //释放速度
            let move_length = this.radius*Math.random()*10;  //粒子释放半径
            new Particle(this.background, x, y, radius, vx, vy, color, speed, move_length);  //基于上述参数生成粒子对象
        }

        this.radius -= damage*0.65;  //受到攻击变小
        this.speed *= 0.88;  //速度减慢
        this.life -= 1;  //生命值降低

        if(this.life <= 0){  //生命值归零即为死亡
            this.destory();  //销毁该对象
            return false;
        }
        else {
            //受击的击退效果
            this.damage_x = Math.cos(angle);  //击退的方向
            this.damage_y = Math.sin(angle);
            this.damage_speed = damage*50;  //击退的速度
        }

    }

    //每一帧刷新
    update() {

        //生命值归零直接销毁对象
        if(this.life <= 0) {
            this.destory();
            return false;
        }

        //更新静默的时间
        this.spent_time += this.timedelta/1000;

        if(this.damage_speed > this.eps) {  //当前存在受击的方向和速度则先被击退
            //打断当前的移动
            this.vx = this.vy = 0;
            this.move_length = 0;

            //更改击退的位置和方向
            this.x += this.damage_x*this.damage_speed*this.timedelta/1000;
            this.y += this.damage_y*this.damage_speed*this.timedelta/1000;
            this.damage_speed *= this.friction;  //摩擦效果
        }
        else {
            if(!this.is_me) {  //人机模式下敌人的攻击规则
                if(Math.random() < 1/250.0 && this.spent_time > 3) {  //攻击频率和静默时间
                    //随机攻击当前场上存在的人
                    let player = this.background.players[Math.floor(Math.random()*this.background.players.length)];

                    //只朝玩家攻击（地狱模式QAQ）
                    //let player = this.background.players[0];

                    //发射火球
                    this.shoot_fireball(player.x, player.y, this.color);
                }
            }

            //当前移动距离为0，即到达了上一次移动的终点位置
            if(this.move_length < this.eps) {
                //重置速度和移动距离
                this.vx = this.vy = 0;
                this.move_length = 0;
                if(!this.is_me) {  //人机再随机一个坐标方向移动
                    let tx = Math.random()*this.background.width;
                    let ty = Math.random()*this.background.height;
                    this.move_to(tx, ty);
                }
            }
            else {  //移动
                let moved = Math.min(this.move_length, this.speed*this.timedelta/1000);  //这一帧的移动距离
                this.x += this.vx*moved;  //移动后的位置
                this.y += this.vy*moved;
                this.move_length -= moved;  //更新还需要移动的距离
            }
        }

        this.render();  //调用渲染函数，每一帧都要重新渲染该对象的位置，否则会消失
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);  //画圆
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}
class WxGameBackground{
    constructor(root){
       this.root = root;
       this.$background = $(`<div class="wx_game_background"></div>`);


      // this.hide();
       this.root.$wx_game.append(this.$background);
       this.width = this.$background.width();
       this.height= this.$background.height();
       this.game_map = new GameMap(this);
       this.player = [];
       this.player.push(new Player(this,this.width/2,this.height/2,this.height*0.05,"white",this.height*0.15,true));
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
