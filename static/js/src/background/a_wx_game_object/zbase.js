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
