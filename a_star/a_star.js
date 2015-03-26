var AStar = function(map, mapW, mapH, src, dest){
	var _me = this;
	var _openList = new NodeList(true, 'F');
	var _closedList = new NodeList();
	var _path = new NodeList();
	var _map = map;
	var _mapW = mapW || 0;
	var _mapH = mapH || 0;
	var _src = src;
	var _dest = dest;
	var _currentNode;
	var _count = 0;
	var _arrived = false;
	_openList.add(new Node(null, src));// set start point
	function index(i,j){
		var temp = i*_mapW + j;
		return temp < 0 ? -1 :
			   temp > _mapW * _mapH -1 ? -1 :
			   temp ;
	}
	function getDistance(src, dest){
		var d_x = dest.x - src.x;
		var d_y = 
		dest.y - src.y;
		return Math.floor( Math.sqrt(d_x*d_x+d_y*d_y)*10 );
	}
	function isInOpenList(i,j){
		return _openList.isExist(i,j)
	}
	function isInClosedList(i,j){
		return _closedList.isExist(i,j);
	}
	function isPassable(i,j){
		var s_i = _currentNode.x;
		var s_j = _currentNode.y;
		if(_map[index(i,j)]>0){		// obstacle
			return false;
		} else if( s_i !== i && s_j !== j ){	//   ?(-1,-1)   O(-1,0)	?(-1,1)
			var d_i = i - s_i;					//	 O(0,-1)  	s(0,0)
			var d_j = i - s_i;					//   ?(1,-1)   			?(1,1)
			if( _map[index(s_i+d_i,s_j)]>0 || _map[index(s_i,s_j+d_j)]>0){
				return false;
			} else {
				return true;
			}
		}									
		return true;
	}
	function isArrived(src){
		if(getDistance(src, dest) == 0 ){
			return true;
		}
		return false;
	}
	this.createPath = function(){
		while(!_openList.isEmpty()){
			_currentNode = _openList.pop(0);	// get the shortest node
			_closedList.add(_currentNode);		// add to the closed list
			if(isArrived(_currentNode)){
				_arrived = true;
				break;
			}
			var start = {
				x: _currentNode.x - 1 >= 0 ? _currentNode.x - 1 : 0,
				y: _currentNode.y - 1 >= 0 ? _currentNode.y - 1 : 0
			};
			var stop = {
				x: _currentNode.x + 1 < _mapH-1 ? _currentNode.x + 1 : _mapH-1,
				y: _currentNode.y + 1 < _mapW-1 ? _currentNode.y + 1 : _mapW-1
			};
			for(var i = start.x; i <= stop.x; ++i) {
				for(var j = start.y; j <= stop.y; ++j) {
					if( isInClosedList(i,j) || !isPassable(i,j) ) {	// cannot pass or in the closedList
					} else if( !isInOpenList(i,j) ){				// not in the openList
						var temp_node = new Node(_currentNode, {x : i, y : j} );
						temp_node.G = _currentNode.G + 10;
						temp_node.H = getDistance(temp_node, dest);
						temp_node.F = temp_node.G + temp_node.H;
						_openList.add(temp_node);
					}
				}
			}
		};
		if(_arrived) {
			while (_currentNode.parent !== null) {  
				_path.add(_currentNode);
				_currentNode = _currentNode.parent;  
			}
			_path.add(_currentNode);
		}
			};
	this.getPath = function(){
		return _path;
	};
	this.printOpenList = function(){
		console.log(_openList.get(0));
	}
	this.printMap = function() {
		console.log('map:');
		var src_n = index(_src.x, _src.y);
		var dest_n = index(_dest.x, _dest.y);
		var str = null;
		var path = this.getPath();
		function getSymble(a,b){
			var temp = index(a,b);
			if(src_n === temp) {
				return 'S';
			} else if(dest_n === temp){
				return 'T';
			} if( _path.isExist(a,b) ){
				return '*';
			} else {
				return  _map[temp] ? 'X' : '0';
			}
		}
		for(var i=0; i < _mapH; ++i){
			for(var j=0; j < _mapW; j++) {
				if(str === null) {
					str =  getSymble(i,j) + '\t\t';
				}
				else {
					str += getSymble(i,j) + '\t\t';
				}
			}
			str += '\n';
		}
		console.log(str);
	}
};

var Node = function(parent, loc) {
	this.parent = parent;
	this.x = loc.x;
	this.y = loc.y;
	this.F = 0;
	this.G = 0;
	this.H = 0;
};

var NodeList = function(sort, sortParam){
	var _data = [];
	var _sort = sort;
	var _sortParam = sortParam;
	this.get = function(index) {
		return _data[index];
	};
	this.add = function(node) {
		_data.push(node);
		if(_sort) {
			var sortBy = _sortParam ||　'F';  
        	_data.sort( function(o1, o2) {
        		return o1[sortBy] - o2[sortBy];
        	});  
		}
	};
	this.pop = function() {
		var temp = _data[0];
		this.remove(0);
		return temp;
	};
	this.size = function() {
		return _data.length;
	};
	this.isEmpty = function() {
		return _data.length === 0 ? true : false;
	};
	this.remove = function(pos) {
		_data.splice(pos, 1);  
	};
	this.isExist = function( x, y) {
		for(var i in _data) {
			if(_data[i].x === x && _data[i].y === y){
				return true;
			}
		}
		return false;
	}
	this.printData = function(){
		console.log(_data);
	}
};