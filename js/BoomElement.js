(function(){
	var BoomElement = window.BoomElement = function (i,j,mapName_obj,game){
		this.mapType = mapName_obj;
		this.dom = null;
		this.i = i;
		this.j = j;
		this.game = game;
		this.propClass = null;
		this.init();
	}
	BoomElement.prototype.init = function (){
		this.dom = document.createElement("div");
		this.dom.className = "boomElement";
		if(this.checkProp()) this.propClass = this.mapType["PropMap"][this.i][this.j];
		this.game.table.appendChild(this.dom);
	}
	BoomElement.prototype.render = function (){
		this.game.setClass(this.i,this.j,"boomElement");
		this.game.setAttr(this.i,this.j,"element");
		this.dom.style.background = this.mapType["boomElement"];
		this.dom.style.left = this.j*40+"px";
		this.dom.style.top = (this.i*40-10)+"px";
		this.dom.style.zIndex = this.i+3;
	}
	//判断元素是否被炸掉
	BoomElement.prototype.checkDestroy = function (){
		if($("tr").eq(this.i).children().eq(this.j).hasClass('bomb_x') || $("tr").eq(this.i).children().eq(this.j).hasClass('bomb_y')){
			if(this.dom) this.game.table.removeChild(this.dom);
			this.game.map.boomElementArr = _.without(this.game.map.boomElementArr,this);
			this.game.removeClass(this.i,this.j,"boomElement");
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
	BoomElement.prototype.checkProp = function (){
		if(this.mapType["PropMap"][this.i][this.j] != 0){
			return true;
		}
	}
})();