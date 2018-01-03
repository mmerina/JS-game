(function(){
	var Bomb = window.Bomb = function (role,id,i,j){
		//自己的身体
		this.bombType = bomb_json[id];
		//炸弹的角色
		this.role = role;
		this.i = i;
		this.j = j;
		this.state = 0;
		this.second = 0;
		this.table = null;
		//炸掉爆炸的左右范围
		this.idl = this.j-game.role.bombScope;
		this.idr = this.j+game.role.bombScope;
		this.idu = this.i-game.role.bombScope;
		this.idd = this.i+game.role.bombScope;
		//角色位置
		this.init();
		game.role.bombArr.push(this);
	}
	//初始化炸弹
	Bomb.prototype.init = function (){
		this.dom = document.createElement("div");
		this.table = game.table;
		this.table.appendChild(this.dom);
		this.dom.className = "bomb";
		this.dom.style.background = this.bombType["background"];
		this.dom.style.zIndex = this.i+2;
		this.dom.style.left = this.j*40+"px";
		this.dom.style.top = (this.i*40-10)+"px";
	}
	//炸弹动起来
	Bomb.prototype.render = function (){
		this.state++;
		if(this.state > 6){
				this.state = 0;
			}
		this.dom.style.backgroundPosition = -(100*this.state) + "px 0px";
		game.setClass(this.i,this.j,"bomb");
		//此处判断角色在离开泡泡后再给泡泡位置的td加碰撞类
		if(game.role.i == this.i && game.role.j == this.j) return; 
		game.setAttr(this.i,this.j,"element");	

	}
	//炸弹爆炸
	Bomb.prototype.startBomb = function (){
		//判断是否立刻开始爆炸
		if(!this.checkBomb()){ this.second++ };
		//开始爆炸		
		if(this.second%200 == 0){
			//从dom树和炸弹数组中移除炸弹
			document.getElementById("bomb_boom").play();
			this.table.removeChild(this.dom);
			game.role.bombArr = _.without(game.role.bombArr,this);
			game.removeClass(this.i,this.j,"bomb");
			game.setAttr(this.i,this.j,"");
			game.setClass(this.i,this.j,"bomb_center");
			this.checkBombScope();
			if(this.idl<0){
				this.idl=0;
			}
			if(this.idu<0){
				this.idu=0;
			}
			//渲染爆炸效果
			for(var i=this.idu;i<=this.idd;i++){
				if(i == this.i) continue;
				game.setClass(i,this.j,"bomb_y");	
			}
			for(var j=this.idl;j<=this.idr;j++){
				if(j == this.j) continue;
				game.setClass(this.i,j,"bomb_x");	
			}
			var self = this;
			this.timeout = setTimeout(function(){
				game.removeClass(self.i,self.j,"bomb_center");
				for(var i=self.idu;i<=self.idd;i++){
					if(i == self.i) continue;
					game.removeClass(i,self.j,"bomb_y");	
				}
				for(var j=self.idl;j<=self.idr;j++){
					if(j == self.j) continue;
					game.removeClass(self.i,j,"bomb_x");	
				}
				clearTimeout(this.timeout);
			},500);
		}		
	}
	//判断是否被触发爆炸
	Bomb.prototype.checkBomb = function (){
		if($("tr").eq(this.i).children().eq(this.j).hasClass('bomb_x') || $("tr").eq(this.i).children().eq(this.j).hasClass('bomb_y')){
			this.second=200;
			return true;
		}
			return false;
	}
	//判断炸弹爆炸范围
	Bomb.prototype.checkBombScope = function (){
		//判断炸弹纵向范围
		for(var i=this.i-1;i>=this.i-game.role.bombScope;i--){
			if($("tr").eq(i).children().eq(this.j).hasClass('noMove')){
				this.idu = i+1;
				break;
			}else if($("tr").eq(i).children().eq(this.j).hasClass('boomElement') || $("tr").eq(i).children().eq(this.j).hasClass('moveElement')){
				this.idu = i;
				break;
			}
		}
		for(var i=this.i+1;i<=this.i+ game.role.bombScope;i++){
			if($("tr").eq(i).children().eq(this.j).hasClass('noMove')){
				this.idd = i-1;
				break;
			}else if($("tr").eq(i).children().eq(this.j).hasClass('boomElement') || $("tr").eq(i).children().eq(this.j).hasClass('moveElement')){
				this.idd = i;
				break;
			}
		}
		//判断炸弹横向范围
		for(var i=this.j-1;i>=this.j-game.role.bombScope;i--){
			if($("tr").eq(this.i).children().eq(i).hasClass('noMove')){
				this.idl = i+1;
				break;
			}else if($("tr").eq(this.i).children().eq(i).hasClass('boomElement') || $("tr").eq(this.i).children().eq(i).hasClass('moveElement')){
				this.idl = i;
				break;
			}
		}
		for(var i=this.j+1;i<=this.j+ game.role.bombScope;i++){
			if($("tr").eq(this.i).children().eq(i).hasClass('noMove')){
				this.idr = i-1;
				break;
			}else if($("tr").eq(this.i).children().eq(i).hasClass('boomElement') || $("tr").eq(this.i).children().eq(i).hasClass('moveElement')){
				this.idr = i;
				break;
			}
		}
	}
	
})();