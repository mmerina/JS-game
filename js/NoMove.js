(function(){
	var NoMove = window.NoMove = function (i,j,mapName_obj,game){
		this.mapType = mapName_obj;
		this.dom = null;
		this.i = i;
		this.j = j;
		this.game = game;
		this.init();
	}
	NoMove.prototype.init = function (){
		this.dom = document.createElement("div");
		this.dom.className = "noMove";
		this.game.table.appendChild(this.dom);
	}
	NoMove.prototype.render = function (){
		this.game.setClass(this.i,this.j,"noMove");
		this.game.setAttr(this.i,this.j,"element");
		this.dom.style.background = this.mapType["noMove"];
		this.dom.style.left = this.j*40+"px";
		this.dom.style.top = (this.i*40-20)+"px";
		this.dom.style.zIndex = this.i+3;
	}
})();