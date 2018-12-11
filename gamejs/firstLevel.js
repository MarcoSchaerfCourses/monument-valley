import {createWalter} from './walter.js'
import {initSecondLevel, createSecondLevel, animateSecondLevel} from './secondLevel.js'

if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

var scene, camera, renderer, raycaster, mouse , keyboard , SCREEN_HEIGHT, SCREEN_WIDTH;

// custom global variables
var firstLevel;
var wheel;
var walter;
var wheelID;
var frameID;

var scale = 1;

var elevatorup = false;
var lastElevatorUp = false;
var canRotateWheel = false;
var alreadyRotated = false;
var canMoveWalter = true;
var translateCollision = true;
var rotateWalterFrontal = true;


createSceneRenderer();
createFirstLevel();
animateFirstLevel();

function createSceneRenderer(){
    // SCENE
    var s = new THREE.Scene();

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    
    // RENDERER
    var r;
	if ( Detector.webgl )
        r = new THREE.WebGLRenderer( {antialias:true} );
    else
        r = new THREE.CanvasRenderer(); 
    r.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    document.body.appendChild( r.domElement );
    initFirstLevel(s, r);
}


export function initFirstLevel(s, r) {

    elevatorup = false;
    lastElevatorUp = false;
    canRotateWheel = false;
    alreadyRotated = false;
    canMoveWalter = true;
    translateCollision = true;
    rotateWalterFrontal = true;
    
    // SCENE
	scene = s;
    
    // CAMERA
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(155.90880333415035, 81.8382276296592, 194.5213428899432);
	camera.lookAt(scene.position);	
    
    // RENDERER
    renderer = r;
      
    //KEYBOARD
    keyboard = new THREEx.KeyboardState();
    
    // LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(200,130,250);
    scene.add(light);

    // SKY
    scene.fog = new THREE.Fog( scene.background, 1, 5000 );
    var vertexShader = document.getElementById( 'vertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    var uniforms = {
        topColor: { value: new THREE.Color( 0x0077ff ) },
        bottomColor: { value: new THREE.Color( 0xffffff ) },
        offset: { value: 230 },
        exponent: { value: 0.6 }
    };
    scene.fog.color.copy( uniforms.bottomColor.value );
    var skyGeo = new THREE.SphereBufferGeometry( 250, 20, 40);
    var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
    var sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );

    //RAYCASTER
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    document.addEventListener('mousedown', mouseDown, false);
    document.getElementById("next").addEventListener('click', goToSecondLevel, false);
	
}

//POPULATE THE SCENE
function FirstLevel(){

    this.threegroup = new THREE.Group();

    //CREATING MESHES
    var material = new THREE.MeshLambertMaterial( { color: 0x70ff4c } );
    var material2 = new THREE.MeshLambertMaterial( { color: 0x29cc00 } );
    var material3 = new THREE.MeshLambertMaterial({color: 0x0000ff, transparent: true, opacity: 0});
    
    var geometry = new THREE.BoxGeometry( 50*scale, 10*scale, 10*scale);
    this.mesh1 = new THREE.Mesh( geometry, material );
    
    this.mesh2 = new THREE.Mesh( geometry, material );

    var geometry3 = new THREE.BoxGeometry( 10*scale, 50*scale, 10*scale );
    this.mesh3 = new THREE.Mesh( geometry3, material );

    this.mesh4 = new THREE.Mesh( geometry3, material );

    var geometry5 = new THREE.BoxGeometry( 100*scale, 10*scale, 10*scale);
    this.mesh5 = new THREE.Mesh( geometry5, material );

    var geometry6 = new THREE.BoxGeometry( 10/0.55*scale, 10/0.55*scale, 50/0.6*scale);
    this.mesh6 = new THREE.Mesh( geometry6, material );

    var geometry7 = new THREE.BoxGeometry(10*scale, 0, 10*scale);
    this.elevator = new THREE.Mesh(geometry7, material2);

    var geometry8 = new THREE.BoxGeometry( 100*scale, 100*scale, 1*scale);
    this.leftWallMesh5 = new THREE.Mesh(geometry8, material3);

    var geometry9 = new THREE.BoxGeometry( 100*scale, 100*scale, 1*scale);
    this.rightWallMesh5 = new THREE.Mesh(geometry9, material3);

    var geometry10 = new THREE.BoxGeometry( 1*scale, 50*scale, 50/0.6*scale);
    this.leftWallMesh6 = new THREE.Mesh(geometry10, material3);

    var geometry11 = new THREE.BoxGeometry( 1*scale, 50*scale, 50/0.6*scale);
    this.rightWallMesh6 = new THREE.Mesh(geometry11, material3);

    var geometry12 = new THREE.BoxGeometry( 50*scale, 50*scale, 1*scale);
    this.backWallMesh6 = new THREE.Mesh(geometry12, material3);

    this.frontWallMesh6 = new THREE.Mesh(geometry12, material3);

    var geometry13 = new THREE.BoxGeometry( 1*scale, 100*scale, this.elevator.geometry.parameters.depth*scale);
    this.wallElevator = new THREE.Mesh(geometry13, material3);
    this.wallElevator.visible = false;

    var geometry14 = new THREE.BoxGeometry( 1*scale, 70*scale, 50*scale);
    this.rightWallMesh3 = new THREE.Mesh(geometry14, material3);
    this.leftWallMesh3 = new THREE.Mesh(geometry14, material3);

    var geometry15 = new THREE.BoxGeometry( 120*scale, 1*scale, 110*scale);
    this.leftWallMesh2 = new THREE.Mesh(geometry15, material3);

    var geometry16 = new THREE.BoxGeometry( 100*scale, 1*scale, 150*scale);
    this.rightWallMesh2 = new THREE.Mesh(geometry16, material3);
    
    var geometry17 = new THREE.BoxGeometry(1*scale, 150*scale, 50*scale);
    this.finalWallMesh1 = new THREE.Mesh(geometry17, material3);
    
    this.lastElevator = new THREE.Mesh(geometry7, material2);

    var geometry18 = new THREE.BoxGeometry( 1*scale, 70*scale, 50*scale);
    this.wallLastElevator = new THREE.Mesh(geometry18, material3);
    this.wallLastElevator.visible = false;


    //POSITIONS
    this.mesh1.position.x = -30;
    this.mesh1.position.y = 15;

    this.mesh2.position.x = this.mesh1.geometry.parameters.width/2 + this.mesh2.geometry.parameters.width/2;
    
    this.mesh3.position.x = this.mesh2.geometry.parameters.width/2 + this.mesh3.geometry.parameters.width/2;
    this.mesh3.position.y = this.mesh2.geometry.parameters.height/2 - this.mesh3.geometry.parameters.height/2;

    this.mesh4.position.x = this.mesh1.geometry.parameters.width/2 + this.mesh2.geometry.parameters.width +
                            this.mesh4.geometry.parameters.width/2;;
    this.mesh4.position.y = -(this.mesh1.geometry.parameters.height/2 + this.mesh3.geometry.parameters.height/2 + 
                            this.mesh4.geometry.parameters.height/2);

    this.mesh5.position.x = - (this.mesh4.geometry.parameters.width/2 + this.mesh5.geometry.parameters.width/2);
    this.mesh5.position.y = -this.mesh4.geometry.parameters.height/2 + this.mesh5.geometry.parameters.height/2;

    this.mesh6.position.x = -this.mesh5.geometry.parameters.width/2 + this.mesh6.geometry.parameters.width/2;
    this.mesh6.position.y = this.mesh5.geometry.parameters.height/2 + this.mesh6.geometry.parameters.height/2;
    this.mesh6.position.z = -(-this.mesh5.geometry.parameters.depth/2 + this.mesh6.geometry.parameters.depth/2);

    this.elevator.position.x = this.mesh6.geometry.parameters.width/2 + this.elevator.geometry.parameters.width/2;
    this.elevator.position.y = - this.mesh6.geometry.parameters.height/2 + this.elevator.geometry.parameters.height/2;
    this.elevator.position.z = this.mesh6.geometry.parameters.depth/2 - this.elevator.geometry.parameters.depth/2;

    this.leftWallMesh5.position.z = this.mesh5.geometry.parameters.depth/2 + this.leftWallMesh5.geometry.parameters.depth/2;

    this.rightWallMesh5.position.x = this.mesh6.geometry.parameters.width;
    this.rightWallMesh5.position.z = -(this.mesh5.geometry.parameters.depth/2 + this.rightWallMesh5.geometry.parameters.depth/2);

    this.leftWallMesh6.position.x = - (this.mesh6.geometry.parameters.width/2 + this.leftWallMesh6.geometry.parameters.width/2);

    this.rightWallMesh6.position.x = this.mesh6.geometry.parameters.width/2 + this.rightWallMesh6.geometry.parameters.width/2;
    this.rightWallMesh6.position.z = -this.mesh5.geometry.parameters.depth;

    this.backWallMesh6.position.z = -(this.mesh6.geometry.parameters.depth/2 + this.backWallMesh6.geometry.parameters.depth/2) + 20;

    this.frontWallMesh6.position.z = this.mesh6.geometry.parameters.depth/2 + this.frontWallMesh6.geometry.parameters.depth/2;

    this.wallElevator.position.x = - this.mesh5.geometry.parameters.width/2 + this.elevator.geometry.parameters.width +
                                    this.mesh6.geometry.parameters.width + 5;
    
    this.rightWallMesh3.position.x = this.mesh3.geometry.parameters.width/2;

    this.leftWallMesh3.position.x = - this.mesh3.geometry.parameters.width/2;
    this.leftWallMesh3.position.y = - 2 * this.mesh2.geometry.parameters.depth;

    this.leftWallMesh2.position.y = this.mesh2.geometry.parameters.height/2;
    this.leftWallMesh2.position.x = - this.mesh2.geometry.parameters.width/2;

    this.rightWallMesh2.position.y = - this.mesh2.geometry.parameters.height/2;
    this.rightWallMesh2.position.x = - this.mesh2.geometry.parameters.width/2;
    
    this.finalWallMesh1.position.x = - this.mesh1.geometry.parameters.width/2;
    
    this.lastElevator.position.x = - this.mesh1.geometry.parameters.width/2 + this.lastElevator.geometry.parameters.width/2;
    this.lastElevator.position.y = this.mesh1.geometry.parameters.height/2;
    this.lastElevator.position.z = - this.mesh1.geometry.parameters.depth/2 + this.lastElevator.geometry.parameters.depth/2;

    this.wallLastElevator.position.x = - (this.mesh1.geometry.parameters.width/2 - this.lastElevator.geometry.parameters.width - 5);
    this.wallLastElevator.position.y = this.wallLastElevator.geometry.parameters.height/2;

    //GROUP ELEMENTS
    this.mesh1.add(this.mesh2);
    this.mesh1.add(this.mesh4);
    this.mesh1.add(this.finalWallMesh1);
    this.mesh1.add(this.lastElevator);
    this.mesh1.add(this.wallLastElevator);
    this.mesh2.add(this.mesh3);
    this.mesh2.add(this.leftWallMesh2);
    this.mesh2.add(this.rightWallMesh2);
    this.mesh3.add(this.leftWallMesh3);
    this.mesh3.add(this.rightWallMesh3);
    this.mesh4.add(this.mesh5);
    this.mesh5.add(this.mesh6);
    this.mesh5.add(this.leftWallMesh5);
    this.mesh5.add(this.rightWallMesh5);
    this.mesh5.add(this.wallElevator);
    this.mesh6.add(this.elevator);
    this.mesh6.add(this.leftWallMesh6);
    this.mesh6.add(this.rightWallMesh6);
    this.mesh6.add(this.backWallMesh6);
    this.mesh6.add(this.frontWallMesh6);
    this.threegroup.add(this.mesh1);

    //WHEEL MODEL
    createWheel();

    //CLOUD MODEL
    createClouds(-70, 50, -100, Math.PI/2, 0.15);
    createClouds(130, 50, 0, Math.PI/6, 0.1);
    createClouds(-200, -40, 40, -Math.PI/6, 0.13);

    //ISLAND MODEL
    createIsland();

    //WALTER
    walter = createWalter(scene);
    walter.body.position.x = 37.186230822843214;
    walter.body.position.y = -46.5;
    walter.body.position.z = 0.004548021380486489;
    walter.body.rotateY(-Math.PI/2);
}


//STARTUP FUNCTION
export function createFirstLevel(){
    firstLevel = new FirstLevel();
    scene.add(firstLevel.threegroup);
}


export function animateFirstLevel() {
    frameID = requestAnimationFrame( animateFirstLevel );
    renderFirstLevel();		
    updateFirstLevel();
}

export function updateFirstLevel(){

    // move walter forwards
    if ( keyboard.pressed("up") && canMoveWalter)
        walter.walkForward();
    else
        walter.walkStop();

    // rotate walter left/right
    if ( keyboard.pressed("left") && canMoveWalter )
        walter.rotateLeft();
    
    if ( keyboard.pressed("right") && canMoveWalter)
        walter.rotateRight();

    //collision detection
    var ray = new THREE.Vector3(0, 0, 1);
    var collidableMeshList = [firstLevel.mesh4, firstLevel.mesh6 , firstLevel.mesh5, firstLevel.leftWallMesh5, firstLevel.rightWallMesh5,
                            firstLevel.leftWallMesh6, firstLevel.rightWallMesh6, firstLevel.backWallMesh6, firstLevel.wallElevator,
                            firstLevel.leftWallMesh3, firstLevel.rightWallMesh3, firstLevel.leftWallMesh2, firstLevel.rightWallMesh2,
                            firstLevel.frontWallMesh6, firstLevel.finalWallMesh1, firstLevel.wallLastElevator];
    
    var dist = 5;
    var origin = new THREE.Vector3(walter.body.position.x, walter.body.position.y, walter.body.position.z);
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(walter.body.matrix);
    var dir = new THREE.Vector3().copy(ray);
    dir = dir.applyMatrix4( matrix );
    var rayc = new THREE.Raycaster(origin, dir, 0.6, dist);
    var intersections = rayc.intersectObjects(collidableMeshList);
    if (intersections.length > 0 && translateCollision)
        walter.body.translateZ(-1);

    //to detect when walter is on the elevator
    if (walter.body.position.x >= -37.08367372909751 &&  walter.body.position.x <= -30 && !elevatorup){
        elevatorup = true;
        canMoveWalter = false;
        walter.walkStop();
        firstLevel.wallElevator.visible = true;
        setupElevatorScaleAnimation( firstLevel.elevator, 
            { x: 1, y: 1 , z: 1}, 
            { x: 1, y: firstLevel.mesh6.geometry.parameters.height, z: 1}, 
            2000, 500, TWEEN.Easing.Linear.None );
    }

    //to detect when walter is on the last elevator
    if (walter.body.position.x >= -53.69083018262058 &&  walter.body.position.x <= -44.78379294366032 && walter.body.position.y >= 20 && !lastElevatorUp){
        lastElevatorUp = true;
        firstLevel.wallLastElevator.visible = true;
        setupLastElevatorTranslateAnimation( firstLevel.lastElevator, 56);
    }

    //to detect when walter is on mesh 6
    if (walter.body.position.x <= -36.895647860848186){
        canRotateWheel= true;
    }

    //to detect when walter is on island (END OF LEVEL)
    if(walter.body.position.z <= -13 && lastElevatorUp){
        canMoveWalter = false;
        translateCollision = false;
        if(rotateWalterFrontal){
            walter.body.rotateY(-Math.PI + Math.PI/4);
            rotateWalterFrontal = false;
            var cameraXYZ = new THREE.Vector3(walter.body.position.x + 30, walter.body.position.y +10, walter.body.position.z +30 );
            setupCameraPositionTween(camera.position, cameraXYZ, 5000);
        }

    }   
    TWEEN.update();
}


function renderFirstLevel() {
	renderer.render( scene, camera );
}


//CLICK EVENT
function mouseDown( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children, true );

    if ( intersects.length > 0 ) {

        //clicking on wheel
        if(intersects[0].object.id == wheelID+1 && canRotateWheel && !alreadyRotated){
            alreadyRotated = true;
            wheel = intersects[0].object;

            var x1 = firstLevel.mesh6.matrixWorld.getPosition().x - firstLevel.mesh6.geometry.parameters.width/2;
            var x2 = firstLevel.mesh6.matrixWorld.getPosition().x + firstLevel.mesh6.geometry.parameters.width/2;

            var z1 = firstLevel.mesh6.matrixWorld.getPosition().z + firstLevel.mesh6.geometry.parameters.depth/2;
            var z2 = firstLevel.mesh6.matrixWorld.getPosition().z - firstLevel.mesh6.geometry.parameters.depth/2;

            var walterX = walter.body.position.x;
            var walterZ = walter.body.position.z;

            var fx = (walterX - x1) / (x2-x1);
            var fz = (walterZ - z1) / (z2-z1);

            //translating ahead and scaling down mesh 6
            firstLevel.mesh6.scale.x = 0.55;
            firstLevel.mesh6.scale.y = 0.55;
            firstLevel.mesh6.scale.z = 0.6;
        
            firstLevel.mesh6.position.x = firstLevel.mesh5.geometry.parameters.width/2 + (firstLevel.mesh6.geometry.parameters.width*0.55)/2;
            firstLevel.mesh6.position.y = firstLevel.mesh4.geometry.parameters.height + firstLevel.mesh3.geometry.parameters.height/2;
            firstLevel.mesh6.position.z = firstLevel.mesh3.geometry.parameters.height - firstLevel.mesh5.geometry.parameters.depth/2 + 
                                          firstLevel.mesh6.geometry.parameters.depth * 0.6/2;
            
            firstLevel.mesh6.updateMatrixWorld();                                        
            
            //translating ahead and scaling down walter
            walter.body.position.x = firstLevel.mesh6.matrixWorld.getPosition().x - 5 + fx * 10;
            walter.body.position.y = 25;
            walter.body.position.z = firstLevel.mesh6.matrixWorld.getPosition().z + 25 - fz * 50;
            
            walter.scale(0.5);
        
            //rotating mesh2 and wheel
            setupMesh2RotateAnimation(firstLevel.mesh2);
            setupWheelRotateAnimation( intersects[0].object );

            firstLevel.rightWallMesh6.position.z = firstLevel.mesh5.geometry.parameters.depth/2;
            firstLevel.backWallMesh6.visible = false;
        }
    }
}


//#############################################################TWEEN FUNCTIONS#################################################################

function setupElevatorScaleAnimation( object, source, target, duration, delay, easing ){
    var l_delay = ( delay !== undefined ) ? delay : 0;
    var l_easing = ( easing !== undefined ) ? easing : TWEEN.Easing.Linear.None;

    new TWEEN.Tween( source )
        .to( target, duration )
        .delay( l_delay )
        .easing( l_easing )
        .onUpdate( function() { 
                    object.scale.copy( source ); 
                    object.translateY(0.075);
                    walter.onElevator(0.075*2);})
        .onComplete(function() {
            canMoveWalter = true;
        })
        .start();
}


function setupLastElevatorTranslateAnimation( object, destinationPoint ){
    new TWEEN.Tween(object.position)
        .to({y: destinationPoint}, 2000)
        .delay(1000)
        .onUpdate( function() {
            object.translateY(0.075);
            walter.onElevator(0.42);})
        .start();
}


function setupWheelRotateAnimation( object){
    new TWEEN.Tween(object.rotation)
    .to({ z: "-" + Math.PI/2}, 2000)
    .onComplete(function() {
        if (Math.abs(object.rotation.z)>=2*Math.PI) {
            object.rotation.z = object.rotation.z % (2*Math.PI);
        }
    })
    .start();
}


function setupMesh2RotateAnimation( object){
    new TWEEN.Tween(object.rotation)
    .to({ x: "-" + Math.PI/2}, 2000)
    .easing( TWEEN.Easing.Elastic.Out )
    .onComplete(function() {
        if (Math.abs(object.rotation.x)>=2*Math.PI) {
            object.rotation.x = object.rotation.x % (2*Math.PI);
        }
    })
    .start();
}


function setupCameraPositionTween( source, target, duration, delay, easing ){
    var l_delay = ( delay !== undefined ) ? delay : 0;
    var l_easing = ( easing !== undefined ) ? easing : TWEEN.Easing.Linear.None;

    new TWEEN.Tween( source )
        .to( target, duration )
        .delay( l_delay )
        .easing( l_easing )
        .onComplete(function() {
            clearModal();
            showModal("first level completed", "next");
        })
        .start();
}


//########################################################## MODELS LOADERS ############################################################### 

function createWheel(){
    var onProgress = function ( xhr ) {

        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
     };

    var onError = function ( xhr ) { };

    //wheel material
    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load('images/wood.jpg');
    var material = new THREE.MeshPhongMaterial({map: map});

    new THREE.OBJLoader()
        .setPath( 'models/shipwheel/' )
        .load( 'shipwheel2.obj', function ( object ) {
           object.traverse( function ( node ) {
                if ( node.isMesh ) node.material = material;
                });

            object.position.x = 58;
            object.position.y = 15;
            object.position.z = -2.5;
            object.scale.x = 1.65;
            object.scale.y = 1.65;
            object.scale.z = 1.65;
            object.rotateY(Math.PI/2);

            wheelID = object.id;
            
            scene.add( object );

        }, onProgress, onError );
}


function createClouds(x, y, z, angle, scale){
    var onProgress = function ( xhr ) {

        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
     };

    var onError = function ( xhr ) { };

    //cloud material
    var cloudMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );

    new THREE.OBJLoader()
        .setPath( 'models/cloud/' )
        .load( 'cloud.obj', function ( object ) {
            object.traverse( function ( node ) {
                if ( node.isMesh ) node.material = cloudMaterial;
                });

            object.position.x = x;
            object.position.y = y;
            object.position.z = z;
            object.scale.x = scale;
            object.scale.y = scale;
            object.scale.z = scale;
            scene.add( object );

        }, onProgress, onError );
}


function createIsland(){
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    new THREE.MTLLoader()
        .setPath( 'models/island/' )
        .load( 'low-poly-mill.mtl', function ( materials ) {

            materials.preload();

            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( 'models/island/' )
                .load( 'low-poly-mill.obj', function ( object ) {

                    object.position.y = 65;
                    object.position.x = -50;
                    object.position.z = -25;
                    object.scale.x = 30;
                    object.scale.y = 30;
                    object.scale.z = 30;
                    object.rotateY(Math.PI/2);

                    scene.add( object );

                }, onProgress, onError );
        } );
}


//PASS TO SECOND LEVEL
function goToSecondLevel(){
    document.getElementById('myModal').style.display = "none";
    document.getElementById('myOverlay').style.display = "none";
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    document.removeEventListener('mousedown', mouseDown, false);
    document.getElementById("next").removeEventListener('click', goToSecondLevel, false);
    cancelAnimationFrame(frameID);
    renderer.render( scene, camera );
    initSecondLevel(scene, renderer);
    createSecondLevel();
    animateSecondLevel();
}

/*function goToThirdLevel(){
    document.getElementById('myModal').style.display = "none";
    document.getElementById('myOverlay').style.display = "none";
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    document.removeEventListener('mousedown', mouseDown, false);
    document.getElementById("next").removeEventListener('click', goToThirdLevel, false);
    cancelAnimationFrame(frameID);
    renderer.render( scene, camera );
    initThirdLevel(scene, renderer);
    createThirdLevel();
    animateThirdLevel();
}*/