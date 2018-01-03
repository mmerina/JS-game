(function(){
	var MoveElement = window.MoveElement = function (i,j,mapName_obj,game){
		this.mapType = mapName_obj;
		this.dom = null;
		this.i = i;
		this.j = j;
		this.game = game;
		this.propClass = null;
		this.init();
	}
	MoveElement.prototype.init = function (){
		this.dom = document.createElement("div");
		this.dom.className = "moveElement";
		if(this.checkProp()) this.propClass = this.mapType["PropMap"][this.i][this.j];
		this.game.table.appendChild(this.dom);
	}
	MoveElement.prototype.render = function (){
		this.game.setClass(this.i,this.j,"moveElement");
		this.game.setAttr(this.i,this.j,"element");
		this.dom.style.background = this.mapType["moveElement"];
		this.dom.style.left = this.j*40+"px";
		this.dom.style.top = (this.i*40-20)+"px";
		this.dom.style.zIndex = this.i+3;
	}
	//检测元素是否被推
	MoveElement.prototype.check = function (){
		if(this.game.role.isWalk){
			switch(this.game.role.direction){
				case "R":
				if(this.game.role.i == this.i && this.game.role.j <= this.j && this.game.role.x+44+this.game.role.speed > this.j*40){
					if($("tr").eq(this.i).children().eq(this.j+1).attr("elementType") == "element"){
						return false;
					}
					if(this.j == 14) return false;
					//如果元素背后有怪物则不能被推动
					for(var k=0;k<this.game.map.creatureArr.length;k++){
						if(this.game.map.creatureArr[k].i == this.i && this.game.map.creatureArr[k].j == this.j+1){
							return false;
						}			
					}
					document.getElementById("move_element").load();
					document.getElementById("move_element").play();	
					this.game.removeClass(this.i,this.j,"moveElement");
					this.game.setAttr(this.i,this.j,"");					
					this.j++;
				}
				break;
				case "L":
				if(this.game.role.i == this.i && this.game.role.j >= this.j && this.game.role.x+4-this.game.role.speed < (this.j+1)*40){
					//如果移动元素背后有元素则不能被推动
					if($("tr").eq(this.i).children().eq(this.j-1).attr("elementType") == "element"){
						return false;
					}
					//如果移动元素已在边界则不能被推动
					if(this.j == 0) return false;
					//如果元素背后有怪物则不能被推动
					for(var k=0;k<this.game.map.creatureArr.length;k++){
						if(this.game.map.creatureArr[k].i == this.i && this.game.map.creatureArr[k].j == this.j-1){
							return false;
						}			
					}
					document.getElementById("move_element").load();
					document.getElementById("move_element").play();
						this.game.removeClass(this.i,this.j,"moveElement");
						this.game.setAttr(this.i,this.j,"");					
						this.j--;
				}
				break;
				case "D":
				if(this.game.role.j == this.j && this.game.role.i <= this.i && this.game.role.y+60+this.game.role.speed > this.i*40){
					if($("tr").eq(this.i+1).children().eq(this.j).attr("elementType") == "element"){
						return false;
					}
					if(this.i == 12) return false;
					//如果元素背后有怪物则不能被推动
					for(var k=0;k<this.game.map.creatureArr.length;k++){
						if(this.game.map.creatureArr[k].j == this.j && this.game.map.creatureArr[k].i == this.i+1){
							return false;
						}			
					}
					document.getElementById("move_element").load();
					document.getElementById("move_element").play();	
						this.game.removeClass(this.i,this.j,"moveElement");
						this.game.setAttr(this.i,this.j,"");					
						this.i++;
				}
				break;
				case "U":
				if(this.game.role.j == this.j && this.game.role.i >= this.i && this.game.role.y+20-this.game.role.speed < (this.i+1)*40){
					if($("tr").eq(this.i-1).children().eq(this.j).attr("elementType") == "element"){
						return false;
					}
					if(this.i == 0) return false;
					//如果元素背后有怪物则不能被推动
					for(var k=0;k<this.game.map.creatureArr.length;k++){
						if(this.game.map.creatureArr[k].j == this.j && this.game.map.creatureArr[k].i == this.i-1){
							return false;
						}			
					}	
					document.getElementById("move_element").load();
					document.getElementById("move_element").play();
						this.game.removeClass(this.i,this.j,"moveElement");
						this.game.setAttr(this.i,this.j,"");					
						this.i--;
				}

				break;
			}
		}
	}
	//判断元素是否被炸掉
	MoveElement.prototype.checkDestroy = function (){
		if($("tr").eq(this.i).children().eq(this.j).hasClass('bomb_x') || $("tr").eq(this.i).children().eq(this.j).hasClass('bomb_y')){
			if(this.dom) this.game.table.removeChild(this.dom);
			this.game.map.moveElementArr = _.without(this.game.map.moveElementArr,this);
			this.game.removeClass(this.i,this.j,"moveElement");
			this.game.setAttr(this.i,this.j,"");
			//显示下面的道具
			if(this.propClass != null){
				switch(this.propClass){
					case "s":
						new Prop(this.i,this.j,"shoe");
					break;
					case "a":
						new Prop(this.i,this.j,"addBomb");
					break;
					case "u":
						new Prop(this.i,this.j,"upBombScope");
					break;
				}
			}
		}
	}
	//判断下面是否有道具
		MoveElement.prototype.checkProp = function (){
		if(this.mapType["PropMap"][this.i][this.j] != 0){
			return true;
		}
	}	
})();