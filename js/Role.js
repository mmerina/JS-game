(function(){
	var Role = window.Role = function (id,i,j,game){
		//自己的身体
		this.roleType = role_json[id];		
		this.id = id;
		//角色所在行列
		this.i = i;
		this.j = j;
		//角色位置
		this.x = this.j*40-4;
		this.y = this.i*40-20;
		//背景定位
		this.bgx = null;
		this.bgy = null;
		this.dom = null;
		this.speed = this.roleType["speed"];
		//动态背景
		this.state = 0;
		this.index = 3;
		this.isWalk = false;
		this.isDie = false;
		this.game = game;
		this.init(id);
		this.direction = "R";
		//自己的炸弹
		this.bombArr = [];
		this.bombMax = this.roleType["bombMax"];
		this.bombScope = 1;
	}
	//初始化角色
	Role.prototype.init = function (){
		this.dom = document.createElement("div");
		var table = this.game.table;
		table.appendChild(this.dom);
		this.dom.className = "role";
		this.dom.id = this.id;
		this.dom.style.background = this.roleType["background"];
		this.dom.style.zIndex = this.index;
		this.bgx = this.roleType["bgx"];
		this.bgy = this.roleType["bgy"];
	}
	//改变角色index值
	Role.prototype.changeIndex = function (){
		this.index = this.i+3;	
		this.dom.style.zIndex = this.index;	
	}
	//渲染角色位置和index
	Role.prototype.renderLocation = function (){
		this.dom.style.left = this.x +"px";
		this.dom.style.top = this.y +"px";	
		this.changeIndex();
	}
	//渲染角色背景图
	Role.prototype.renderBG = function (){
		if(this.isWalk){
			this.state++;
			if(this.state > 3){
				this.state = 0;
			}
			this.bgx = -(this.roleType["stateX"]+100*this.state) + "px";	 
		}else{
			this.bgx = this.roleType["bgx"];
		}
		this.dom.style.backgroundPosition = this.bgx + this.bgy;
	}
	//改变角色方向
	Role.prototype.changeDirection = function (r){
		this.direction = r;
	}
	//改变角色速度
	Role.prototype.changeSpeed = function (){
		if(this.speed<5) this.speed += 0.5;
	}
	//改变角色炸弹数量
	Role.prototype.changeBombMax = function (){
		if(this.bombMax<8) this.bombMax += 1;
	}
	//改变角色炸弹范围
	Role.prototype.changeBombScope = function (){
		if(this.bombScope<4) this.bombScope += 1;
	}
	//更新角色的位置
	Role.prototype.update = function (){
		this.goDie();
		if(!this.isWalk) return;
		this.location();
		switch(this.direction){
			case "R":
			this.y = this.i*40-20;
			this.bgy = this.roleType["bgyr"];
			if(!this.check()) return;
			this.x += this.speed;
			break;
			case "L":
			this.y = this.i*40-20;
			this.bgy = this.roleType["bgyl"];
			if(!this.check()) return;
			this.x -= this.speed;
			break;
			case "D":
			this.bgy = this.roleType["bgyd"];
			this.x = this.j*40-4;
			if(!this.check()) return;
			this.y += this.speed;
			break;
			case "U":
			this.x = this.j*40-4;
			this.bgy = this.roleType["bgyu"];
			if(!this.check()) return;
			this.y -= this.speed;
			break;
		}	
	}
	//判断角色所在行列
	Role.prototype.location = function (){
			this.i = Math.round((this.y+20)/40);
			this.j = Math.round((this.x+4)/40);
	}
	//检测碰撞
	Role.prototype.check = function (){
		switch(this.direction){
			case "R":
			this.idx = parseInt((this.x+44)/40);
			for(var j=this.idx;j<15;j++){
				if($("tr").eq(this.i).children().eq(j).attr("elementType") == "element"){
					if((this.x+44+this.speed)>j*40){
						return false;
					}
				}
				return true;
			}
			break;
			case "L":
			this.idx = parseInt((this.x+4)/40);
			for(var j=this.idx-1;j >= -1;j--){
				if($("tr").eq(this.i).children().eq(j).attr("elementType") == "element"){
					if((this.x+4-this.speed)<(j+1)*40){
						return false;
					}
				}
				if(this.x+4 >= 0){					
					return true;
				}
			}
			break;
			case "D":
			this.idy = parseInt((this.y+60)/40);
			for(var j=this.idy;j<13;j++){
				if($("tr").eq(j).children().eq(this.j).attr("elementType") == "element"){
					if((this.y+60+this.speed)>j*40){
						return false;
					}
				}
				return true;
			}
			break;
			case "U":
			this.idy = parseInt((this.y+20)/40);
			for(var j=this.idy-1;j >= -1;j--){
				if($("tr").eq(j).children().eq(this.j).attr("elementType") == "element"){
					if((this.y+20-this.speed)<(j+1)*40){
						return false;
					}
				}
				if(this.y+20 >= 0){					
					return true;
				}
			}
			break;
		}
	}
	//判断死亡
	Role.prototype.goDie = function (){
		if($("tr").eq(this.i).children().eq(this.j).hasClass('bomb_x') || $("tr").eq(this.i).children().eq(this.j).hasClass('bomb_y') || $("tr").eq(this.i).children().eq(this.j).hasClass('bomb_center')){
			this.isDie = true;
			clearInterval(this.game.timer);
			document.getElementById(this.game.map.mapType["music_id"]).pause();
			document.getElementById(this.game.map.mapType["music_id"]).currentTime = 0;
			document.getElementById("fail").play();
			$("section.game_play .game_over").css("display","block");
		}
	}
	//判断胜利
	Role.prototype.checkVictory = function (){
		if(this.game.map.creatureMax == this.game.deadCreature){
			this.isDie = true;
			clearInterval(this.game.timer);
			document.getElementById(this.game.map.mapType["music_id"]).pause();
			document.getElementById(this.game.map.mapType["music_id"]).currentTime = 0;
			document.getElementById("victory").play();
			$("section.game_play .victory").css("display","block");
			var self = this;
			setTimeout(function (){
				$("section.game_play .victory").css("display","none");
				returnChooseMap();
			},4000);
		}
	}
})();