(function(){
	var Prop = window.Prop = function (i,j,propClass){
		this.dom = null;
		this.i = i;
		this.j = j;
		this.state = 0;
		this.propClass = propClass;
		this.init();
		game.map.propArr.push(this);
	}
	Prop.prototype.init = function (){
		this.dom = document.createElement("div");
		this.dom.className = this.propClass;
		game.table.appendChild(this.dom);
		this.dom.style.left = this.j*40+"px";
		this.dom.style.top = (this.i*40-20)+"px";
		this.dom.style.zIndex = this.i+2;	
	}
	//判断元素是否被吃掉
	Prop.prototype.checkEated = function (){
		if(game.role.i == this.i && game.role.j == this.j){
			document.getElementById("pick_up").load();
			document.getElementById("pick_up").play();
			game.table.removeChild(this.dom);
			game.map.propArr = _.without(game.map.propArr,this);
			switch(this.propClass){
				case "shoe":
				game.role.changeSpeed();
				$("section.game_play .prop_screen #shoe").css("display","block").siblings().css("display","none");
				break;
				case "addBomb":
				game.role.changeBombMax();
				$("section.game_play .prop_screen #addBomb").css("display","block").siblings().css("display","none");
				break;
				case "upBombScope":
				game.role.changeBombScope();
				$("section.game_play .prop_screen #upBombScope").css("display","block").siblings().css("display","none");
				break;
			}
		}
		for(var i=0;i<game.map.creatureArr.length;i++){
			if(game.map.creatureArr[i].i == this.i && game.map.creatureArr[i].j == this.j){
				document.getElementById("pick_up").load();
				document.getElementById("pick_up").play();
				game.table.removeChild(this.dom);
				game.map.propArr = _.without(game.map.propArr,this);
				switch(this.propClass){
					case "shoe":
					game.map.creatureArr[i].changeSpeed();
					break;
					case "addBomb":
					game.map.creatureArr[i].changeBombMax();
					break;
					case "upBombScope":
					game.map.creatureArr[i].changeBombScope();
					break;
				}
			}			
		}
	}
})();