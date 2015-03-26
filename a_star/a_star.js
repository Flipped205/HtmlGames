




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

	this.createPath = function(){
	};

	this.getDistance = function(src, dest){
		return Math.abs(dest.x - src.x) + Math.abs(dest.y - src.y);
	};

	this.getPath = function(){
		return _path;
	};

	this.printMap = function() {
		console.log('map:');
		var src_n = _src.x * _mapW + _src.y;
		var dest_n = _dest.x * _mapW + _dest.y;
		var str = null;
		function getSymble(t){
			if(src_n === t) {
				return 'S';
			} else if(dest_n === t){
				return 'T';
			} else {
				return  _map[t];
			}
		}
		for(var i=0; i < _mapH; ++i){
			for(var j=0; j < _mapW; j++) {
				temp = i*_mapW + j
				if(str === null) {
					str =  getSymble(temp)+ '\t\t';
				}
				else {
					str +=  getSymble(temp) + '\t\t';
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

	this.remove = function() {
		_data.splice(pos, 1);  
	};

	this.isExist = function( x, y) {
		for(var i in _data) {
			if(i.x === x && i.y === y){
				return true;
			}
		}
		return false;
	}

};