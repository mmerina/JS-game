(function(){
	var Map = window.Map = function (mapName,game){
		this.mapType = map_json[mapName];
		this.moveElement = null;
		this.moveElementArr = [];
		this.noMove = null;
		this.noMoveArr = [];
		this.boomElement = null;
		this.boomElementArr = [];
		this.creatureArr = [];
		this.propArr = [];
		this.game = game;
		this.creatureMax = this.mapType["creatureMax"];
		this.init();
	}
	Map.prototype.init = function (){
		for(var i=0;i<13;i++){
			for(var j=0;j<15;j++){
				if(this.mapType["tableMap"][i][j] == "x"){
					this.noMove = new NoMove(i,j,this.mapType,this.game);
					this.noMoveArr.push(this.noMove);
				}else 
				if(this.mapType["tableMap"][i][j] == "m"){
					this.moveElement = new MoveElement(i,j,this.mapType,this.game);
					this.moveElementArr.push(this.moveElement);
				}
				else if(this.mapType["tableMap"][i][j] == "b"){
					this.boomElement = new BoomElement(i,j,this.mapType,this.game);
					this.boomElementArr.push(this.boomElement);
				}
			}
		}
	}
	Map.prototype.render = function (){
		$(".game_table").addClass(this.mapType["mapClass"]);
	}

})();