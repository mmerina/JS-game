(function(){
	var Game = window.Game = function (id,ballType,mapName){
		this.table = null;
		//创建表格
		this.map = null;
		this.role = null;
		this.timer = null;
		this.timeout = null;
		this.roleId = id;
		this.ballType = ballType;
		this.mapName = mapName;
		this.creatureNum = 0;
		this.deadCreature = 0;
		this.creatureLocation = 0;
		this.time=0;
		this.init();
		this.frame = 0;
		this.start();
		this.bindKeyupevent();
	}
	//初始化表格
	Game.prototype.init = function (){
		this.table = document.createElement("table");
		this.table.className = "game_table";
		$(".game_play").append(this.table);
		for(var i=0;i<13;i++){
			var tr = document.createElement("tr");
			for(var j=0;j<15;j++){
				var td = document.createElement("td");
				tr.appendChild(td);
			}
			this.table.appendChild(tr);
		}
	}
	//渲染类
	Game.prototype.setClass = function (row,col,classname){
		$("tr").eq(row).children("td").eq(col).addClass(classname);
	}
	//移除类
	Game.prototype.removeClass = function (row,col,classname){
		$("tr").eq(row).children("td").eq(col).removeClass(classname);
	}
	//渲染自定义属性
	Game.prototype.setAttr = function (row,col,attrname){
		$("tr").eq(row).children("td").eq(col).attr("elementType",attrname);
	}
	//用键盘控制方向
	Game.prototype.bindKeyevent = function (){
		var self = this;
		document.onkeydown = function (event){
			switch(event.keyCode){
				case 37:
				self.role.isWalk = true;
				self.role.changeDirection("L");
				break;
				case 38:
				self.role.isWalk = true;
				self.role.changeDirection("U");
				break;
				case 39:
				self.role.isWalk = true;
				self.role.changeDirection("R");
				break;
				case 40:
				self.role.isWalk = true;
				self.role.changeDirection("D");
				break;
				case 32:
				if(self.role.bombArr.length<self.role.bombMax && !($("tr").eq(self.role.i).children().eq(self.role.j).hasClass('bomb'))){			
					new Bomb(self.role,self.ballType,self.role.i,self.role.j);
					document.getElementById("drop_bomb").play();
				}
				break;
			}
		}
	}
	//键盘抬起
	Game.prototype.bindKeyupevent = function (){
		var self = this;
		document.onkeyup = function (event){
			if(event.keyCode == 37 && self.role.direction == "L" ||
				event.keyCode == 38 && self.role.direction == "U" ||
				event.keyCode == 39 && self.role.direction == "R" ||
				event.keyCode == 40 && self.role.direction == "D"){
				self.role.isWalk = false;
			}
		}
	}
	// 	//判断胜利
	// Game.prototype.checkVictory = function (){
	// 	if(this.map.creatureMax == this.deadCreature){
	// 		this.role.isDie = true;
	// 		clearInterval(this.timer);
	// 		document.getElementById(this.map.mapType["music_id"]).pause();
	// 		document.getElementById(this.map.mapType["music_id"]).currentTime = 0;
	// 		document.getElementById("victory").play();
	// 		$("section.game_play .victory").css("display","block");
	// 		var self = this;
	// 		setTimeout(function (){
	// 			console.log(111);
	// 			$("section.game_play .victory").css("display","none");
	// 			returnChooseMap();
	// 		},3000);
	// 	}
	// }
	// 清屏
	// Game.prototype.clear = function (){
	// 	for(var i=0;i<20;i++){
	// 		for(var j=0;j<20;j++){
	// 			this.renderColor(i,j,"#fff");
	// 		}
	// 	}
	// }
	//主循环
	Game.prototype.start = function (){
		this.map = new Map(this.mapName,this);
		this.role = new Role(this.roleId,this.map.mapType["origin_i"],this.map.mapType["origin_j"],this);
		$("section.game_play p.creatureMax").html(this.map.creatureMax);		
		$("section.game_play p.game_time").html(this.time+"  s");
		$("section.game_play p.creatureNum").html(this.deadCreature);
		this.map.render();	
		for(var i=0;i<this.map.moveElementArr.length;i++){
			this.map.moveElementArr[i].render();
			this.map.moveElementArr[i].check();					
			this.map.moveElementArr[i].checkDestroy();					
			}
			for(var i=0;i<this.map.noMoveArr.length;i++){
				this.map.noMoveArr[i].render();					
			}
			for(var i=0;i<this.map.boomElementArr.length;i++){
				this.map.boomElementArr[i].render();					
				this.map.boomElementArr[i].checkDestroy();					
			}
			this.role.renderLocation();
		document.getElementById("ReadyGo").play();
		var self = this;
		this.timeout = setTimeout(function(){
		self.bindKeyevent();
			document.getElementById(self.map.mapType["music_id"]).play();
			self.timer = setInterval(function (){
				self.frame++;
				self.frame%50 == 0 && self.time++;
				$("section.game_play p.game_time").html(self.time+"  s");
				//渲染地图上的元素
				for(var i=0;i<self.map.moveElementArr.length;i++){
				self.map.moveElementArr[i].render();
				self.map.moveElementArr[i].check();					
				self.map.moveElementArr[i].checkDestroy();					
				}
				for(var i=0;i<self.map.noMoveArr.length;i++){
					self.map.noMoveArr[i].render();					
				}
				for(var i=0;i<self.map.boomElementArr.length;i++){
					self.map.boomElementArr[i].render();					
					self.map.boomElementArr[i].checkDestroy();					
				}
				//渲染角色
				self.role.update();					
				self.role.renderLocation();
				self.frame%5 == 0 && self.role.renderBG();
				//自动创建怪物
				if(self.map.creatureArr.length<4 && self.creatureNum<self.map.creatureMax){
					self.creatureNum++;
					self.creatureLocation = parseInt(Math.random()*4);
					self.creature = new Creature(self.map.mapType["creatureLocation"][self.creatureLocation]["i"],self.map.mapType["creatureLocation"][self.creatureLocation]["j"]);
				}
				self.role.checkVictory();
				$("section.game_play p.creatureNum").html(self.deadCreature);
				//渲染怪物
				for(var i=0;i<self.map.creatureArr.length;i++){
					self.map.creatureArr[i].update();	
					self.map.creatureArr[i].renderLocation();				
				}
				//渲染炸弹
				for(var i=0;i<self.role.bombArr.length;i++){
					self.frame%5 == 0 && self.role.bombArr[i].render();	
					self.role.bombArr[i].startBomb();				
				}
				//渲染道具
				for(var i=0;i<self.map.propArr.length;i++){
					self.map.propArr[i].checkEated();				
				}
				
			},20);
		},2000);
	} 
})();