(function(){
	var Creature = window.Creature = function (i,j){	
		//怪物所在行列
		this.i = i;
		this.j = j;
		//怪物位置
		this.x = this.j*40-4;
		this.y = this.i*40-20;
		//背景定位
		this.bgPosition = null;
		this.dom = null;
		this.table = null;
		this.isWalk = true;
		this.removeClass = true;
		this.speed = 2;
		//动态背景
		this.index = 3;
		this.init();
		this.directionArr = ["L","U","R","D"];
		this.direction = "R";
		//自己的炸弹
		this.bombArr = [];
		this.bombMax = 1;
		this.bombScope = 1;
		this.propSpeedNum = 0;
		this.propAddBombNum = 0;
		this.propUpBombScopeNum = 0;
		this.propI = 0;
		this.propJ = 0;
		game.map.creatureArr.push(this);

	}
	//初始化怪物
	Creature.prototype.init = function (){
		this.dom = document.createElement("div");
		this.table = game.table;
		this.table.appendChild(this.dom);
		this.dom.className = "creature";
		this.dom.style.background = "url(images/creature.png) no-repeat";
		this.dom.style.zIndex = this.index;
		this.bgPosition = "0px 0px";
	}
	//改变怪物index值
	Creature.prototype.changeIndex = function (){
		this.index = this.i+3;	
		this.dom.style.zIndex = this.index;	
	}
	//渲染怪物位置和index
	Creature.prototype.renderLocation = function (){
		this.goDie();
		if(!this.isWalk) return;
		this.dom.style.left = this.x +"px";
		this.dom.style.top = this.y +"px";	
		this.dom.style.backgroundPosition = this.bgPosition;
		this.changeIndex();
	}
	//改变怪物方向
	Creature.prototype.changeDirection = function (r){
		this.direction = this.directionArr[parseInt(Math.random()*4)];
	}
	//改变怪物速度
	Creature.prototype.changeSpeed = function (){
		if(this.speed<6) this.speed += 0.5;
	}
	//改变怪物炸弹数量
	Creature.prototype.changeBombMax = function (){
		if(this.bombMax<8) this.bombMax += 1;
	}
	//改变怪物炸弹范围
	Creature.prototype.changeBombScope = function (){
		if(this.bombScope<4) this.bombScope += 1;
	}
	//更新怪物的位置
	Creature.prototype.update = function (){
		if(!this.isWalk) return;
		this.location();
		switch(this.direction){
			case "R":
			this.y = this.i*40-20;
			this.bgPosition = "-300px 0px";
			if(!this.check()) return;
			this.x += this.speed;
			break;
			case "L":
			this.y = this.i*40-20;
			this.bgPosition = "-200px 0px";
			if(!this.check()) return;
			this.x -= this.speed;
			break;
			case "D":
			this.bgPosition = "0px 0px";
			this.x = this.j*40-4;
			if(!this.check()) return;
			this.y += this.speed;
			break;
			case "U":
			this.x = this.j*40-4;
			this.bgPosition = "-100px 0px";
			if(!this.check()) return;
			this.y -= this.speed;
			break;
		}	
	}
	//判断怪物所在行列
	Creature.prototype.location = function (){
			this.i = Math.round((this.y+20)/40);
			this.j = Math.round((this.x+4)/40);
	}
	//检测碰撞
	Creature.prototype.check = function (){
		switch(this.direction){
			case "R":
			if(this.x >=  556){
				this.changeDirection();
				return false;
			}
			this.idx = parseInt((this.x+44)/40);
			for(var j=this.idx;j<15;j++){
				if($("tr").eq(this.i).children().eq(j).attr("elementType") == "element"){
					if((this.x+44+this.speed)>j*40){
						this.changeDirection();
						return false;
					}
				}
				return true;
			}
			break;
			case "L":
			if(this.x <= -4){
				this.changeDirection();
				return false;
			}
			this.idx = parseInt((this.x+4)/40);
			for(var j=this.idx-1;j >= -1;j--){
				if($("tr").eq(this.i).children().eq(j).attr("elementType") == "element"){
					if((this.x+4-this.speed)<(j+1)*40){
						this.changeDirection();
						return false;
					}
				}
				if(this.x+4 >= 0){					
					return true;
				}
			}
			break;
			case "D":
			if(this.y >= 460){
				this.changeDirection();
				return false;
			}
			this.idy = parseInt((this.y+60)/40);
			for(var j=this.idy;j<13;j++){
				if($("tr").eq(j).children().eq(this.j).attr("elementType") == "element"){
					if((this.y+60+this.speed)>j*40){
						this.changeDirection();
						return false;
					}
				}
				return true;
			}
			break;
			case "U":
			if(this.y <= -20){
				this.changeDirection();
				return false;
			}
			this.idy = parseInt((this.y+20)/40);
			for(var j=this.idy-1;j >= -1;j--){
				if($("tr").eq(j).children().eq(this.j).attr("elementType") == "element"){
					if((this.y+20-this.speed)<(j+1)*40){
						this.changeDirection();
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
	Creature.prototype.goDie = function (){
		if($("tr").eq(this.i).children().eq(this.j).hasClass('bomb_x') || $("tr").eq(this.i).children().eq(this.j).hasClass('bomb_y') || $("tr").eq(this.i).children().eq(this.j).hasClass('bomb_center')){
			this.isWalk = false;
			var self = this;
			this.timeout = setTimeout(function(){
				if(self.removeClass){
					document.getElementById("goDie").play();
					self.table.removeChild(self.dom);
					self.removeClass = false;
					self.dropProp();
					game.deadCreature++;
				}
				game.map.creatureArr = _.without(game.map.creatureArr,self);
			},1000);
		}
	}
	//掉落道具
	Creature.prototype.dropProp = function (){
		this.propSpeedNum = this.speed-2;
		this.propAddBombNum = this.bombMax -1;
		this.propUpBombScopeNum = this.bombScope - 1;
		for(var i=0;i<this.propSpeedNum;i++){
			do{
				this.propI = parseInt(Math.random()*13);
				this.propJ = parseInt(Math.random()*15);
			}while($("tr").eq(this.propI).children().eq(this.propJ).attr("elementType") == "element");
			new Prop(this.propI,this.propJ,"shoe");
		}
		for(var i=0;i<this.propAddBombNum;i++){
			do{
				this.propI = parseInt(Math.random()*13);
				this.propJ = parseInt(Math.random()*15);
			}while($("tr").eq(this.propI).children().eq(this.propJ).attr("elementType") == "element");
			new Prop(this.propI,this.propJ,"addBomb");
		}
		for(var i=0;i<this.propUpBombScopeNum;i++){
			do{
				this.propI = parseInt(Math.random()*13);
				this.propJ = parseInt(Math.random()*15);
			}while($("tr").eq(this.propI).children().eq(this.propJ).attr("elementType") == "element");
			new Prop(this.propI,this.propJ,"upBombScope");
		}
		this.isDrop = false;
	}
	
})();