// Matter.js module aliases
var Engine 	= Matter.Engine,
	World	= Matter.World,
	Bodies	= Matter.Bodies,
	Bounds 	= Matter.Bounds,
	Body	= Matter.Body,
	Constraint = Matter.Constraint,
	Composite  = Matter.Composite,
	Composites = Matter.Composites,
	Events 	= Matter.Events,
	Common  = Matter.Common,
	MouseConstraint = Matter.MouseConstraint;
// create a Matter.js engine
//var _container = document.getElementsByClassName("wolrd");
var _container = document.body;
var _options = {wireframes: false};
var _engine = Engine.create(_container, _options);

var group = Body.nextGroup(true);
// add a mouse controlled constraint
var constraintOptions = { constraint: {	render: { visible: false } } }
var _mouseConstraint = MouseConstraint.create(_engine, constraintOptions);
_mouseConstraint.collisionFilter.mask = defaultCategory | blueCategory | greenCategory;
var defaultCategory = 0x0001,
            redCategory = 0x0002,
            greenCategory = 0x0004,
            blueCategory = 0x0008;
// create ground
var b_height = 600;
var b_width  = 1600;
var ground = Bodies.rectangle(0, b_height, b_width, 20, { isStatic: true, id:'ground', render: { visible: false } }),
	wall_left = Bodies.rectangle(0, 0, 10, b_width, { isStatic: true, render: {visible: false} }),
	wall_right = Bodies.rectangle(b_width/2, 0, 10, 1000, { isStatic: true, render: {visible: false} }),
	ceiling = Bodies.rectangle(0, 0, b_width, 20, { isStatic: true, render: {visible: false} }),
	ballOptions = {	id:"ball",
					density: 0.4,
					restitution: 0.9,
					collisionFilter: { category: redCategory },
					frictionAir: 0.1,
					render: {
                        sprite: {
                            texture: './ball.png'
                        }
                    }
				},
	ball = Bodies.circle(250,300,40, ballOptions);
/*var	anchor = { x: 170, y: 350 },
	elastic = Constraint.create({
		pointA: anchor,
		bodyB: rock,
		stiffness: 0.05,
		render: {
			lineWidth: 0,
		}
	});*/

var ball;
var items = [	ground,
				_mouseConstraint,
				ball,
				wall_left,
				wall_right,
				ceiling
			]

World.add(_engine.world, items)

var renderOptions = _engine.render.options;
        renderOptions.background = './wall-bg.jpg';
        renderOptions.showAngleIndicator = false;
        renderOptions.wireframes = false;

Events.on(_mouseConstraint,'startdrag', function(event){
	if( event.body.id == 'ball' ) {
		
	}
})
Events.on(_mouseConstraint, 'mousedown', function(event) {
	var bodies = Composite.allBodies(_engine.world);
	var mouse = event.mouse;
	if( mouse.button === 0 ) {
		for (var i = 0; i < bodies.length; i++) {
	        var body = bodies[i];
	        if ( !body.isStatic && Bounds.contains(body.bounds, mouse.position) ) {
	            var forceMagnitude = 0.01 * body.mass * 10;

	            var force_x = (mouse.position.x - body.position.x) > 0 ? -1 : 1;
	            var force_y = (mouse.position.y - body.position.y) > 0 ? -1 : 1;
	            
	            console.log(body.id);
	            console.log(body.position.x + ":" + body.position.y);
	            console.log(mouse.position.x + ":" + mouse.position.y );
	            Body.applyForce(body, { x: 0, y: 0 }, { 
	                x: force_x * forceMagnitude, 
	                y: force_y * forceMagnitude
	            });
	            //console.log(body.force);
	        }
	    }
	}
    
	//Body.applyForce (jumper,{ x: 0, y: 0 }, {x:0,y:0.001} );
	/*
	var mouse = event.mouse,
		engine = event.source,
		bodies = Composite.allBodies(engine.world),
		constraints = Composite.allConstraints(engine.world),
		i;

		if (mouse.button === 0) {	// 0: left-click 2: 0: right-double-click 
            // find if a body was clicked on
            for (i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                if (Bounds.contains(body.bounds, mouse.position)) {
                	if(body.id === 'ball') {

                		console.log("click" + body.id);
                		console.log("click" +  {x:100, y:100});
                		console.log( {x:100, y:100});
                		//body.position = {x:100, y:100};
                		
                		//
                	}
                    // remove the body that was clicked on
                    //Composite.remove(engine.world, body, true);
                }
            }
        }*/
    var mousePosition = event.mouse.position;
    //var forceMagnitude = 0.01 * jumper.mass;
    /*Body.applyForce(jumper, { x: jumper.position.x, y: jumper.position.y }, { 
        x: 0, y: 0.5
        //x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]), 
        //y: -forceMagnitude + Common.random() * -forceMagnitude
    });*/
    //Body.applyForce (ball,{ x: ball.position.x, y: ball.position.y }, {x:0,y:1} );
    //Body.applyGravityAll(jumper, {x:0,y:1} );
    
    //console.log(jumper.force);
    //console.log('ball at ' + jumper.position.x + ' ' + jumper.position.y);
    //jumper.position.x = 100;
    //console.log('ball at ' + jumper.position.x + ' ' + jumper.position.y);
    //jumper.position.y = -0.1;
   	console.log('mousedown at ' + mousePosition.x + ' ' + mousePosition.y);
});

// run the engine
Engine.run(_engine)