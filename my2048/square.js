/**
* @Unit
* @description squre unit class
*/
var Unit = (function(){
	return function(){
		var _v = 0;
		this.value = function() {
			return _v;
		};
		this.upgrade = function(a) {
			_v = _v + a;
			return this;
		};
		this.set = function(v) {
			_v = v;
			return this;
		};
		this.clear = function() {
			_v = 0;
			return this;
		}
	}
})();

/**
* @Unit
* @description Palte class
*/
var Plate = (function(){
	return function(){
		var _width 	= 4;
		var _height = 4;
		var _plate 	= {};
		var _emptyArray = new Array;
		var i,j;

		for( i = 0; i < _height; i ++ ){
			_plate[i] = {};
			for( j = 0; j < _width; j ++ ){
				_plate[i][j] = new Unit;
				emptyArrayPush(i,j);
				//_plate[i][j].set(10*i + j);
				//console.log( _plate[i][j].value() );
			}
		}

		function emptyArrayPop(i,j) {
			var key = i * _height + j;
			for(var k = 0 ; k < _emptyArray.length; k++ ) {
				if( _emptyArray[k] === key ) {
					_emptyArray.splice(k,1);	// remove _emptyArray[k]
				}
			}
			//console.log(_emptyArray);
		}

		function emptyArrayPush(i,j) {
			_emptyArray.push( i*_height+j );
			//console.log(_emptyArray);
		}

		function shift( i, j, m, n ) {		// shift b towards a
			var a, b;
			if( _plate[i] === undefined || _plate[m] === undefined ) {
				return 0;
			}
			if( _plate[i][j] === undefined || _plate[m][n] === undefined ) {
				return 0;
			}

			a = _plate[i][j];
			b = _plate[m][n];

			if( typeof a.value != 'function' || typeof b.value != 'function' ) {
				return 0;
			}

			if( a.value() === 0 && b.value() === 0 ){
				return 0;
			} else if( a.value() === b.value() )	// a equals b, then merge them
			{
				a.upgrade(b.value());
				b.clear();
				emptyArrayPush(m, n);		// push b to emptyArray
				return 0;
			} else if( a.value() === 0 ) { // a is empty, shift it
				a.set(b.value());
				b.clear();
				emptyArrayPop(i, j);		// pop a from emptyArray
				emptyArrayPush(m, n);		// push b to emptyArray
				return 1;
			} else {						// stay still
				return 0;
			}
		}

		/*
		this.getUnit = function(i,j){
			if( i > _height || j > _width ){
				return null;
			}
			return _plate[i][j];
		}*/

		this.setUnit = function(i,j,v) {
			_plate[i][j].set(v);
			emptyArrayPop(i,j);
		}

		this.display = function(){
			var str = null;
			for( var i = 0; i < _height; i++ ){
				for( var j = 0; j < _width; j++ ){
					if( str === null ) {
						str = _plate[i][j].value() + '\t\t';
					} else {
						str += _plate[i][j].value() + '\t\t';
					}
				}
				str += '<br>';
			}
			return str;
		}

		this.randomGenerate = function() {
			var rand, l, r, key;
			if( _emptyArray.length === 0 ) {	// no empty unit
				return false;
			}

			rand = parseInt( _emptyArray.length*Math.random() );
			key = _emptyArray[rand];
			l = parseInt( key / _width );		// line 
			r = parseInt( key % _width );		// row

			if( _plate[l][r].value() !== 0 ) {	// it's not empty
				emptyArrayPop(l,r)
				return false;
			}

			rand = parseInt( 2*Math.random() );	// desig
			if( rand === 0 ) {
				this.setUnit( l, r, 2 );
			} else {
				this.setUnit( l, r, 4 );
			}
		}

		this.emptyNum = function() {
			return _emptyArray.length;
		}

		this.shiftup = function() {
			var result = 0;
			var m;
			for( var j = 0; j < _width; j++ ) {
				for( var i = 0; i < (_height-1); i++ ) {
					m = i;
					do{
						result = shift( m, j, m+1, j );
						m--;
					} while(result === 1);
				}
			}
			this.randomGenerate();
		}

		this.shiftdown = function() {
			var result = 0;
			var m;
			for( var j = 0; j < _width; j++ ) {
				for( var i = (_height-1); i > 0; i--) {
					m = i;
					do{
						result = shift( m, j, m-1, j );;
						m++;
					} while(result == 1);
				}
			}
			this.randomGenerate();
		}

		this.shiftleft = function() {
			var result = 0;
			var m;
			for( var i = 0; i < _height; i++ ) {
				for( var j = 0; j < (_width-1); j++ ) {
					m = j;
					do{
						result = shift( i, m, i, m+1 );
						m--;
					} while(result === 1);
				}
			}
			this.randomGenerate();
		}

		this.shiftright = function() {
			var result = 0;
			var m;
			for( var i = 0; i < _height; i++ ) {
				for( var j = (_width-1); j > 0 ; j-- ) {
					m = j;
					do{
						result = shift( i, m, i, m-1 );
						m++;
					} while(result === 1);
				}
			}
			this.randomGenerate();
		}

	}
})();

/**

*/
var BindKey = ( function() {
	var _onKeyUp = function(){};
	var _onKeyDown = function(){};
	var _onKeyLeft = function(){};
	var _onKeyRight = function(){};

	function bindCallback() {
		document.onkeydown = function() {
	        var a = window.event.keyCode; 
	        if( a === 38 ) { 
	        	//console.log('key-up');
	        	_onKeyUp();
	        } else if( a === 37) {
	        	//console.log('key-left');
	        	_onKeyLeft();
	        } else if( a === 39 ) {
	        	//console.log('key-right');
	        	_onKeyRight();
	        } else if( a === 40 ) {
	        	//console.log('key-down');
	        	_onKeyDown();
	        }
		};
	}

	return function(){
		this.on = function( keyname, callback ) {
			if( typeof callback != 'function' ) {
				return;
			}
			switch( keyname ) {
				case 'up': _onKeyUp = callback; break;
				case 'down': _onKeyDown = callback; break;
				case 'left': _onKeyLeft = callback; break;
				case 'right': _onKeyRight = callback; break;
			}
			bindCallback();
		}
	}
})();
 
/**
keycode   37 = Left 
keycode   38 = Up 
keycode   39 = Right 
keycode   40 = Down 
**/


    //绑定alt+鼠标向上滚轮事件
    /*
    window.addEventListener('mousewheel', function(event){
        if(event.wheelDelta > 0 && event.altKey)
        {
            $('html,body').animate({ scrollTop: '0px' }, 800);
            //防止滚动条向上滚动，导致多重效果
            window.event.preventDefault();
        }
    }, false);*/