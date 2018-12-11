import {createWalter} from './walter.js'
import {initThirdLevel, createThirdLevel, animateThirdLevel} from './thirdLevel.js'

var camera, scene, renderer, keyboard;

var controls;

// custom global variables
var secondLevel, walter, frameID, tweenMesh2Back, tweenMesh5Back, lastTower, particleCount, particles;

var canMoveWalter = false;
var button1AlreadyPressed = false;
var button1AlreadyBack = false;
var mesh2AndWalterAlreadyRotated = false;
var mesh5AndWalterAlreadyRotated = false;
var button2AlreadyPressed = false;
var button2AlreadyBack = false;
var mesh7AlreadyRotated = false;
var loaded = false;
var completed = false;


export function initSecondLevel(s,r) {

    canMoveWalter = false;
    button1AlreadyPressed = false;
    button1AlreadyBack = false;
    mesh2AndWalterAlreadyRotated = false;
    mesh5AndWalterAlreadyRotated = false;
    button2AlreadyPressed = false;
    button2AlreadyBack = false;
    mesh7AlreadyRotated = false;
    loaded = false
    completed = false;

    //SCENE
    scene = s;

    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(-213.58337719145825, 178.67650892185713, 235.7860293861429);
    camera.lookAt(new THREE.Vector3(30,60,30));
    scene.add(camera);

    //ORBIT CONTROLS
    controls = new THREE.OrbitControls(camera);
    controls.center = new THREE.Vector3(30,60,-30);
    controls.enabled = false;

    // RENDERER
    renderer = r;

    //KEYBOARD
    keyboard = new THREEx.KeyboardState();

    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200, 194);
    scene.add(light);

    //SKY
    scene.fog = new THREE.Fog( scene.background, 1, 5000 );
    var vertexShader = document.getElementById( 'vertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    var uniforms = {
    topColor: { value: new THREE.Color(0x00001a) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 500},
    exponent: { value: 0.5 }
    };
    scene.fog.color.copy( uniforms.bottomColor.value );
    var skyGeo = new THREE.SphereBufferGeometry( 2000, 20, 40);
    var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
    var sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );

    //SNOW
    particleCount = 1000;
    var pMaterial = new THREE.PointCloudMaterial({
    color: 0xFFFFFF,
    size: 4,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
    });
    particles = new THREE.Geometry;

    for (var i = 0; i < particleCount; i++) {
        var pX = Math.random()*1000 - 500,
        pY = Math.random()*500 - 250,
        pZ = Math.random()*1000 - 500,
        particle = new THREE.Vector3(pX, pY, pZ);
        particle.velocity = {};
        particle.velocity.y = -1;
        particles.vertices.push(particle);
    }

    var particleSystem = new THREE.PointCloud(particles, pMaterial);
    particleSystem.position.y = 200;
    scene.add(particleSystem);

    // EVENTS
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    document.getElementById("next").addEventListener('click', goToThirdLevel, false);
}

//POPULATE THE SCENE
function SecondLevel(){

    this.threegroup = new THREE.Group();


    //CREATING MESHES
    var wallMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff, transparent: true, opacity: 0});
    var buttonMaterial=new THREE.MeshLambertMaterial({color: 0xff0000});
    
    var geometry = new THREE.BoxGeometry( 50, 10, 10);
    this.mesh1 = createMeshWithTexture(geometry, "pink.jpg");

    var geometry2 = new THREE.BoxGeometry( 10, 50, 10 );
    this.mesh2 = createMeshWithTexture(geometry2, "pink.jpg");

    this.mesh3 = createMeshWithTexture(geometry2, "pink.jpg");

    var geometry3 = new THREE.BoxGeometry( 10, 10, 50);
    this.mesh4 = createMeshWithTexture(geometry3, "pink.jpg");

    var geometry4 = new THREE.BoxGeometry( 10, 10, 100);
    this.mesh5 = createMeshWithTexture(geometry4, "pink.jpg");

    this.mesh6 = createMeshWithTexture(geometry, "pink.jpg");

    this.mesh7 = createMeshWithTexture(geometry, "pink.jpg");

    this.mesh8 = createMeshWithTexture(geometry, "pink.jpg");

    var geometry5 = new THREE.BoxGeometry( 30, 10, 30);
    this.meshPlatform1 = createMeshWithTexture(geometry5, "pink.jpg");

    var geometry6 = new THREE.BoxGeometry( 10, 10, 10);
    this.meshPlatform2 = createMeshWithTexture(geometry6, "pink.jpg");

    var geometry7 = new THREE.BoxGeometry( 10, 10, 10 );
    this.meshToPlatform2 = createMeshWithTexture(geometry7, "pink.jpg");

    this.meshToPlatform1 = createMeshWithTexture(geometry3, "pink.jpg");

    var geometry8=new THREE.BoxGeometry( 6, 10, 6 );
    this.button1=new THREE.Mesh(geometry8,buttonMaterial);

    var geometry9=new THREE.BoxGeometry( 10, 6, 6 );
    this.button2=new THREE.Mesh(geometry9,buttonMaterial);

    var geometry10=new THREE.BoxGeometry( 6, 6, 10 );
    this.button3=new THREE.Mesh(geometry10,buttonMaterial);

    var geometry11 = new THREE.BoxGeometry(70,130,70);
    this.bigTower =  createBigTowerWithTexture(geometry11, "wall2.jpg");

    var geometry12 = new THREE.CylinderGeometry(0, 50, 50, 4, false);
    this.roof = createRoofWithTexture(geometry12);

    var geometry13 = new THREE.BoxGeometry(10,25,10);
    this.col1 = createMeshWithTexture(geometry13, "pink.jpg");

    this.col2 = createMeshWithTexture(geometry13, "pink.jpg");

    this.col3 = createMeshWithTexture(geometry13, "pink.jpg");

    this.col4 = createMeshWithTexture(geometry13, "pink.jpg");

    var geometry14 = new THREE.BoxGeometry(0,30,10);
    this.rightWallMesh1 = new THREE.Mesh(geometry14, wallMaterial);

    this.leftWallMesh1 = new THREE.Mesh(geometry14, wallMaterial);

    var geometry15 = new THREE.BoxGeometry(50,30,0);
    this.backWallMesh1 =  new THREE.Mesh(geometry15, wallMaterial);

    var geometry16 = new THREE.BoxGeometry(20,30,0);
    this.frontWallMesh1RightHalf = new THREE.Mesh(geometry16, wallMaterial);

    this.frontWallMesh1LeftHalf = new THREE.Mesh(geometry16, wallMaterial);

    var geometry17 = new THREE.BoxGeometry(0,30,50);
    this.rightWallMeshToPlatform1 = new THREE.Mesh(geometry17, wallMaterial);

    this.leftWallMeshToPlatform1 = new THREE.Mesh(geometry17, wallMaterial);

    var geometry18 = new THREE.BoxGeometry(30,30,0);
    this.frontWallMeshPlatform1 = new THREE.Mesh(geometry18, wallMaterial);

    var geometry19 = new THREE.BoxGeometry(10,30,0);
    this.backWallMeshPlatform1RightHalf = new THREE.Mesh(geometry19, wallMaterial);

    this.backWallMeshPlatform1LeftHalf = new THREE.Mesh(geometry19, wallMaterial);

    var geometry20 = new THREE.BoxGeometry(0,30,30);
    this.rightWallMeshPlatform1 = new THREE.Mesh(geometry20, wallMaterial);

    this.leftWallMeshPlatform1 = new THREE.Mesh(geometry20, wallMaterial);

    var geometry21 = new THREE.BoxGeometry(30,50,0);
    this.rightWallMesh2 = new THREE.Mesh(geometry21, wallMaterial);

    this.leftWallMesh2 = new THREE.Mesh(geometry21, wallMaterial);

    var geometry22 = new THREE.BoxGeometry(30,0,10);
    this.backWallMesh2 = new THREE.Mesh(geometry22, wallMaterial);

    var geometry23 = new THREE.BoxGeometry(30,70,0);
    this.rightWallMesh3 = new THREE.Mesh(geometry23, wallMaterial);

    var geometry24 = new THREE.BoxGeometry(30,40,0);
    this.leftWallMesh3 = new THREE.Mesh(geometry24, wallMaterial);

    var geometry25 = new THREE.BoxGeometry(30,0,50);
    this.leftWallMesh4 = new THREE.Mesh(geometry25, wallMaterial);

    var geometry26 = new THREE.BoxGeometry(30,0,30);
    this.rightWallMesh4RightHalf = new THREE.Mesh(geometry26, wallMaterial);

    var geometry27 = new THREE.BoxGeometry(30,0,20);
    this.rightWallMesh4LeftHalf = new THREE.Mesh(geometry27, wallMaterial);

    var geometry28 = new THREE.BoxGeometry(30,20,0);
    this.rightWallPlatform2 = new THREE.Mesh(geometry28, wallMaterial);

    this.leftWallPlatform2 = new THREE.Mesh(geometry28, wallMaterial);

    var geometry29 = new THREE.BoxGeometry(30,0,10);
    this.frontWallPlatform2 = new THREE.Mesh(geometry29, wallMaterial);

    var geometry30 = new THREE.BoxGeometry(30,10,0);
    this.backWallMesh4 = new THREE.Mesh(geometry30, wallMaterial);

    this.backWallMesh5 = new THREE.Mesh(geometry30, wallMaterial);

    var geometry31 = new THREE.BoxGeometry(30,0,150);
    this.rightWallMesh5 = new THREE.Mesh(geometry31, wallMaterial);

    this.leftWallMesh5 = new THREE.Mesh(geometry31, wallMaterial);

    var geometry32 = new THREE.BoxGeometry(100,0,30);
    this.rightWallMesh7 = new THREE.Mesh(geometry32, wallMaterial);

    this.leftWallMesh7 = new THREE.Mesh(geometry32, wallMaterial);

    var geometry33 = new THREE.BoxGeometry(0,10,30);
    this.backWallMesh7 = new THREE.Mesh(geometry33, wallMaterial);
    this.backWallMesh7.visible=false;

    //POSITIONS
    this.meshToPlatform1.position.z = this.meshToPlatform1.geometry.parameters.depth/2 + this.mesh1.geometry.parameters.depth/2;

    this.meshPlatform1.position.z = this.meshToPlatform1.geometry.parameters.depth/2 + this.meshPlatform1.geometry.parameters.depth/2;

    this.button1.position.y = this.meshPlatform1.geometry.parameters.height/2;

    this.mesh2.position.x = this.mesh1.geometry.parameters.width/2 + this.mesh2.geometry.parameters.height/2;

    this.mesh3.position.x = this.mesh2.position.x;
    this.mesh3.position.y = this.mesh2.geometry.parameters.height/2 + this.mesh3.geometry.parameters.height/2;

    this.mesh4.position.y = this.mesh3.geometry.parameters.height/2 - this.mesh4.geometry.parameters.height/2;
    this.mesh4.position.z = -this.mesh3.geometry.parameters.depth/2 - this.mesh4.geometry.parameters.depth/2;

    this.meshToPlatform2.position.y = this.meshToPlatform2.geometry.parameters.height/2 + this.mesh4.geometry.parameters.height/2;

    this.meshPlatform2.position.y = this.meshToPlatform2.geometry.parameters.height/2 + this.meshPlatform2.geometry.parameters.height/2;

    this.button2.position.x = -this.meshPlatform2.geometry.parameters.width/2;

    this.mesh5.position.z = -this.mesh5.geometry.parameters.depth/2 - this.mesh4.geometry.parameters.depth/2;
    this.mesh5.rotateY(Math.PI/2);

    this.mesh6.position.x = -this.mesh5.geometry.parameters.depth/2 - this.mesh6.geometry.parameters.width/2;
    this.mesh6.position.z = this.mesh5.position.z ;

    this.mesh7.position.x = -this.mesh6.geometry.parameters.width/2 - this.mesh7.geometry.parameters.width/2;

    this.mesh8.position.x = this.mesh7.position.x - this.mesh7.geometry.parameters.width/2 - this.mesh8.geometry.parameters.width/2;

    this.button3.position.z = this.mesh7.geometry.parameters.depth/2;

    this.bigTower.position.x = + this.bigTower.geometry.parameters.width/2 + this.meshPlatform2.geometry.parameters.width/2;
    this.bigTower.position.y = - this.bigTower.geometry.parameters.height/2 + this.meshPlatform2.geometry.parameters.height/2;
    this.bigTower.position.z = 1;

    this.roof.position.y = this.bigTower.geometry.parameters.height/2 + this.roof.geometry.parameters.height/2 + 25;
    this.roof.rotateY(Math.PI/4);

    this.col1.position.x = -this.bigTower.geometry.parameters.width/2 + this.col1.geometry.parameters.width/2;
    this.col1.position.y = this.bigTower.geometry.parameters.height/2 + this.col1.geometry.parameters.height/2;
    this.col1.position.z = this.bigTower.geometry.parameters.depth/2 - this.col1.geometry.parameters.depth/2;

    this.col1.position.x = -this.bigTower.geometry.parameters.width/2 + this.col1.geometry.parameters.width/2;
    this.col1.position.y = this.bigTower.geometry.parameters.height/2 + this.col1.geometry.parameters.height/2;
    this.col1.position.z = this.bigTower.geometry.parameters.depth/2 - this.col1.geometry.parameters.depth/2;

    this.col2.position.x = +this.bigTower.geometry.parameters.width/2 - this.col1.geometry.parameters.width/2;
    this.col2.position.y = this.bigTower.geometry.parameters.height/2 + this.col1.geometry.parameters.height/2;
    this.col2.position.z = this.bigTower.geometry.parameters.depth/2 - this.col1.geometry.parameters.depth/2;

    this.col3.position.x = -this.bigTower.geometry.parameters.width/2 + this.col1.geometry.parameters.width/2;
    this.col3.position.y = this.bigTower.geometry.parameters.height/2 + this.col1.geometry.parameters.height/2;
    this.col3.position.z = - this.bigTower.geometry.parameters.depth/2 + this.col1.geometry.parameters.depth/2;

    this.col4.position.x = this.bigTower.geometry.parameters.width/2 - this.col1.geometry.parameters.width/2;
    this.col4.position.y = this.bigTower.geometry.parameters.height/2 + this.col1.geometry.parameters.height/2;
    this.col4.position.z = -this.bigTower.geometry.parameters.depth/2 + this.col1.geometry.parameters.depth/2;

    this.rightWallMesh1.position.x = this.mesh1.geometry.parameters.width/2;

    this.leftWallMesh1.position.x = -this.mesh1.geometry.parameters.width/2;

    this.backWallMesh1.position.z = -this.mesh1.geometry.parameters.depth/2;

    this.frontWallMesh1RightHalf.position.x = this.mesh1.geometry.parameters.width/2 - this.frontWallMesh1RightHalf.geometry.parameters.width/2;
    this.frontWallMesh1RightHalf.position.z = this.mesh1.geometry.parameters.depth/2;

    this.frontWallMesh1LeftHalf.position.x = - this.mesh1.geometry.parameters.width/2 + this.frontWallMesh1LeftHalf.geometry.parameters.width/2;
    this.frontWallMesh1LeftHalf.position.z = this.mesh1.geometry.parameters.depth/2;

    this.rightWallMeshToPlatform1.position.x = this.meshToPlatform1.geometry.parameters.width/2;

    this.leftWallMeshToPlatform1.position.x = -this.meshToPlatform1.geometry.parameters.width/2;

    this.frontWallMeshPlatform1.position.z = this.meshPlatform1.geometry.parameters.depth/2;

    this.backWallMeshPlatform1RightHalf.position.x = this.meshPlatform1.geometry.parameters.width/2 - 
                                                    this.backWallMeshPlatform1RightHalf.geometry.parameters.width/2;
    this.backWallMeshPlatform1RightHalf.position.z = -this.meshPlatform1.geometry.parameters.depth/2;

    this.backWallMeshPlatform1LeftHalf.position.x = -this.meshPlatform1.geometry.parameters.width/2 + 
                                                    this.backWallMeshPlatform1LeftHalf.geometry.parameters.width/2;
    this.backWallMeshPlatform1LeftHalf.position.z = -this.meshPlatform1.geometry.parameters.depth/2;

    this.rightWallMeshPlatform1.position.x = this.meshPlatform1.geometry.parameters.width/2;

    this.leftWallMeshPlatform1.position.x = -this.meshPlatform1.geometry.parameters.width/2;

    this.rightWallMesh2.position.z = this.mesh2.geometry.parameters.depth/2;

    this.leftWallMesh2.position.z = -this.mesh2.geometry.parameters.depth/2;

    this.backWallMesh2.position.y = -this.mesh2.geometry.parameters.height/2;

    this.rightWallMesh3.position.z = this.mesh3.geometry.parameters.depth/2;

    this.leftWallMesh3.position.y = -this.mesh3.geometry.parameters.height/2 + this.leftWallMesh3.geometry.parameters.height/2;
    this.leftWallMesh3.position.z = -this.mesh3.geometry.parameters.depth/2;

    this.leftWallMesh4.position.y = -this.mesh4.geometry.parameters.height/2;

    this.rightWallMesh4RightHalf.position.y = this.mesh4.geometry.parameters.height/2;
    this.rightWallMesh4RightHalf.position.z = +this.mesh4.geometry.parameters.depth/2 - this.rightWallMesh4RightHalf.geometry.parameters.depth/2
                                            + 10;
    
    this.rightWallMesh4LeftHalf.position.y = this.mesh4.geometry.parameters.height/2;
    this.rightWallMesh4LeftHalf.position.z = -this.mesh4.geometry.parameters.depth/2 + this.rightWallMesh4LeftHalf.geometry.parameters.depth/2;

    this.rightWallPlatform2.position.y = this.meshToPlatform2.geometry.parameters.height/2 - this.rightWallPlatform2.geometry.parameters.height/2 + 10;
    this.rightWallPlatform2.position.z = this.meshToPlatform2.geometry.parameters.depth/2;

    this.leftWallPlatform2.position.y = this.meshToPlatform2.geometry.parameters.height/2 - this.leftWallPlatform2.geometry.parameters.height/2 + 10;
    this.leftWallPlatform2.position.z = -this.meshToPlatform2.geometry.parameters.depth/2;

    this.frontWallPlatform2.position.y = this.meshToPlatform2.geometry.parameters.height/2 + 10;

    this.backWallMesh4.position.z = -this.mesh4.geometry.parameters.depth/2;

    this.backWallMesh5.position.z = this.mesh5.geometry.parameters.depth/2;

    this.rightWallMesh5.position.y = -this.mesh5.geometry.parameters.height/2;
    this.rightWallMesh5.position.z = -this.mesh5.geometry.parameters.depth/2 +this.rightWallMesh5.geometry.parameters.depth/2 - 50;

    this.leftWallMesh5.position.y = this.mesh5.geometry.parameters.height/2;
    this.leftWallMesh5.position.z = -this.mesh5.geometry.parameters.depth/2 +this.leftWallMesh5.geometry.parameters.depth/2 - 50;

    this.rightWallMesh7.position.x = this.rightWallMesh7.geometry.parameters.width/2 - this.mesh7.geometry.parameters.width/2 - 50;
    this.rightWallMesh7.position.y = -this.mesh7.geometry.parameters.height/2;

    this.leftWallMesh7.position.x = this.leftWallMesh7.geometry.parameters.width/2 - this.mesh7.geometry.parameters.width/2 - 50;
    this.leftWallMesh7.position.y = this.mesh7.geometry.parameters.height/2;

    this.backWallMesh7.position.x = this.mesh7.geometry.parameters.width/2;

    //GROUP ELEMENTS
    this.mesh1.add(this.meshToPlatform1);
    this.mesh1.add(this.mesh2);
    this.mesh1.add(this.mesh3);
    this.mesh1.add(this.rightWallMesh1);
    this.mesh1.add(this.leftWallMesh1);
    this.mesh1.add(this.backWallMesh1);
    this.mesh1.add(this.frontWallMesh1RightHalf);
    this.mesh1.add(this.frontWallMesh1LeftHalf);

    this.mesh2.add(this.rightWallMesh2);
    this.mesh2.add(this.leftWallMesh2);
    this.mesh2.add(this.backWallMesh2);

    this.mesh3.add(this.mesh4);
    this.mesh3.add(this.rightWallMesh3);
    this.mesh3.add(this.leftWallMesh3);

    this.mesh4.add(this.meshToPlatform2);
    this.mesh4.add(this.mesh5);
    this.mesh4.add(this.mesh6);
    this.mesh4.add(this.leftWallMesh4);
    this.mesh4.add(this.rightWallMesh4RightHalf);
    this.mesh4.add(this.rightWallMesh4LeftHalf);
    this.mesh4.add(this.backWallMesh4);

    this.mesh5.add(this.backWallMesh5);
    this.mesh5.add(this.rightWallMesh5);
    this.mesh5.add(this.leftWallMesh5);

    this.mesh6.add(this.mesh7);
    this.mesh6.add(this.mesh8);

    this.mesh7.add(this.button3);
    this.mesh7.add(this.rightWallMesh7);
    this.mesh7.add(this.leftWallMesh7);
    this.mesh7.add(this.backWallMesh7);


    this.meshToPlatform1.add(this.meshPlatform1);
    this.meshToPlatform1.add(this.rightWallMeshToPlatform1);
    this.meshToPlatform1.add(this.leftWallMeshToPlatform1);

    this.meshPlatform1.add(this.button1);
    this.meshPlatform1.add(this.frontWallMeshPlatform1);
    this.meshPlatform1.add(this.backWallMeshPlatform1RightHalf);
    this.meshPlatform1.add(this.backWallMeshPlatform1LeftHalf);
    this.meshPlatform1.add(this.rightWallMeshPlatform1);
    this.meshPlatform1.add(this.leftWallMeshPlatform1);

    this.meshToPlatform2.add(this.meshPlatform2);
    this.meshToPlatform2.add(this.rightWallPlatform2);
    this.meshToPlatform2.add(this.leftWallPlatform2);
    this.meshToPlatform2.add(this.frontWallPlatform2);

    this.meshPlatform2.add(this.button2);
    this.meshPlatform2.add(this.bigTower);

    this.bigTower.add(this.roof);
    this.bigTower.add(this.col1);
    this.bigTower.add(this.col2);
    this.bigTower.add(this.col3);
    this.bigTower.add(this.col4);

    this.threegroup.add(this.mesh1);


    /* ########## MODELS LOADERS ########## */
    createBox(-50, -5, 2, 0.75, -Math.PI/2, 0, 0);
    createHouse(-165, 65, -100, 0.2, 0, Math.PI/6, 0);
    createCandyStick(190, 0, 60, 0.5, -Math.PI/2, 0, -Math.PI/4);
    createtree(90, 0, 160, 0.5, -Math.PI/2, 0, 0);
    createClouds(160, 5, 70, Math.PI/6, 0.05);


    //WALTER
    walter = createWalter(scene);
    walter.body.position.x = this.mesh1.position.x - 30;
    walter.body.position.y = this.mesh1.position.y + this.mesh1.geometry.parameters.height + 4;
    walter.body.position.z = this.mesh1.position.z;

    var dir = new THREE.Vector3(this.bigTower.matrixWorld.getPosition().x, walter.body.position.y, walter.body.position.z);
    walter.body.lookAt(dir);
}


export function createSecondLevel() {
  secondLevel = new SecondLevel();
  scene.add(secondLevel.threegroup);

}


export function animateSecondLevel() {
    frameID = requestAnimationFrame( animateSecondLevel );
    renderSecondLevel();
    updateSecondLevel();
}


function updateSecondLevel(){

    if ( keyboard.pressed("up") && canMoveWalter)
        walter.walkForward();
    else{
        if(canMoveWalter)
            walter.walkStop();
    }
            
    // rotate walter left/right
    if ( keyboard.pressed("left") && canMoveWalter)
        walter.rotateLeft();
    
    if ( keyboard.pressed("right") && canMoveWalter)
        walter.rotateRight();

    if(loaded){
        loaded=false;
        translateWalterOnMesh1Center(secondLevel.mesh1.matrixWorld.getPosition().x);
    }


    //collision detection
    var ray = new THREE.Vector3(0, 0, 1);
    var collidableMeshList = [secondLevel.rightWallMesh1, secondLevel.leftWallMesh1, secondLevel.backWallMesh1,
                            secondLevel.frontWallMesh1RightHalf, secondLevel.frontWallMesh1LeftHalf, secondLevel.rightWallMeshToPlatform1,
                            secondLevel.leftWallMeshToPlatform1, secondLevel.frontWallMeshPlatform1, secondLevel.backWallMeshPlatform1RightHalf,
                            secondLevel.backWallMeshPlatform1LeftHalf, secondLevel.rightWallMeshPlatform1, secondLevel.leftWallMeshPlatform1,
                            secondLevel.rightWallMesh2, secondLevel.leftWallMesh2, secondLevel.bigTower, secondLevel.backWallMesh2,
                            secondLevel.rightWallMesh3, secondLevel.leftWallMesh3, secondLevel.leftWallMesh4,
                            secondLevel.rightWallMesh4RightHalf,secondLevel.rightWallMesh4LeftHalf, secondLevel.rightWallPlatform2,
                            secondLevel.leftWallPlatform2, secondLevel.frontWallPlatform2, secondLevel.backWallMesh4, secondLevel.backWallMesh5,
                            secondLevel.rightWallMesh5, secondLevel.leftWallMesh5, secondLevel.rightWallMesh7, secondLevel.leftWallMesh7,
                            secondLevel.backWallMesh7];
    var dist = 5;
    var origin = new THREE.Vector3(walter.body.position.x, walter.body.position.y, walter.body.position.z);
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(walter.body.matrix);
    var dir = new THREE.Vector3().copy(ray);
    dir = dir.applyMatrix4( matrix );
    var rayc = new THREE.Raycaster(origin, dir, 0.6, dist);
    var intersections = rayc.intersectObjects(collidableMeshList);
    if (intersections.length > 0)
        walter.body.translateZ(-1);

    //to detect when walter is on button 1
    if (walter.body.position.x >= -5 &&  walter.body.position.x <= 5 && walter.body.position.z >= 67 &&
        walter.body.position.z <= 73 && !button1AlreadyPressed){
        button1AlreadyPressed = true;
        setupButton1Animation(secondLevel.button1);
        setupMesh2RotateAnimation(secondLevel.mesh2);
    }

    //to detect when waltr leaves button 1
    if (!(walter.body.position.x >= -5 &&  walter.body.position.x <= 5 && walter.body.position.z >= 67 && walter.body.position.z <= 73) 
        && button1AlreadyPressed && !button1AlreadyBack){
            button1AlreadyBack = true;
            setupButton1Back(secondLevel.button1);
            setupMesh2RotateBack(secondLevel.mesh2);
        }

    //to detect when walter is on button 2
    if (walter.body.position.y >= 86.18023243721129 &&  walter.body.position.y <= 98 && walter.body.position.z <=- 23 &&
        walter.body.position.z >= -34 && !button2AlreadyPressed){
        button2AlreadyPressed = true;
        setupButton2Animation(secondLevel.button2);
        setupMesh5RotateAnimation(secondLevel.mesh5);
    }

    //to detect when walter leaves button 2
    if (!(walter.body.position.y >= 86.18023243721129 &&  walter.body.position.y <= 98 && walter.body.position.z <=- 23 && walter.body.position.z >= -34 ) 
        && button2AlreadyPressed && !button2AlreadyBack){
        console.log("LASCIO");
        button2AlreadyBack = true;
        setupButton2Back(secondLevel.button2);
        setupMesh5RotateBack(secondLevel.mesh5);
    }

    //to detect when walter is on button 3
    if (walter.body.position.z <=- 90 && walter.body.position.x <= -71 && walter.body.position.x >= -79 && walter.body.position.y >= 67 &&
        walter.body.position.y <= 73 &&  !mesh7AlreadyRotated  ){
        canMoveWalter=false;
        mesh7AlreadyRotated=true;
        walter.walkStop();
        setupButton3Animation( secondLevel.button3);
    }

    //to detect when Walter is on Mesh2
    if (walter.body.position.x >= 24.22021104406285 && walter.body.position.z >= -6 &&  walter.body.position.z <= 6 && !mesh2AndWalterAlreadyRotated){
        mesh2AndWalterAlreadyRotated = true;
        tweenMesh2Back.stop();
        canMoveWalter = false;
        walter.walkStop();
        var dir = new THREE.Vector3(secondLevel.bigTower.matrixWorld.getPosition().x, walter.body.position.y, walter.body.position.z);
        walter.body.lookAt(dir);
        translateWalterOnMeshCenter(secondLevel.mesh2.matrixWorld.getPosition().x - 14);
    }

    //to detect when Walter is on Mesh5
    if (walter.body.position.z <= -55 && !mesh5AndWalterAlreadyRotated ){
        mesh5AndWalterAlreadyRotated = true;
        tweenMesh5Back.stop();
        canMoveWalter = false;
        walter.walkStop();
        var dir = new THREE.Vector3(walter.body.position.x, walter.body.position.y, secondLevel.mesh6.matrixWorld.getPosition().z);
        walter.body.lookAt(dir);
        walter.body.rotateZ(-Math.PI/2);
        translateWalterOnMeshCenterZ(secondLevel.mesh5.matrixWorld.getPosition().z + 14); 
    }

    //to detect when walter entered the tower
    if(walter.body.position.x <=- 140 && !completed){
        canMoveWalter = false;
        clearModal();
        showModal("second level completed", "next");
        completed = true;
    }

    simulateRain();

    TWEEN.update();
    controls.update();
}


function renderSecondLevel() {
    renderer.render( scene, camera );
}


//########################################################TWEEEN####################################
function setupMesh2RotateAnimation( object){
    new TWEEN.Tween(object.rotation)
    .to({ z: "-" + Math.PI/2}, 2000)
    .onComplete(function(){
        object.updateMatrixWorld();
        secondLevel.rightWallMesh1.visible = false;
        secondLevel.backWallMesh2.visible = false;
    })
    .start();
}

function setupMesh2RotateBack( object){
    tweenMesh2Back = new TWEEN.Tween(object.rotation)
    .to({ z: 0}, 2000)
    .delay(5000)
    .onStart(function(){
        secondLevel.rightWallMesh1.visible = true;
        secondLevel.backWallMesh2.visible = true;
    })
    .onComplete(function(){
        object.updateMatrixWorld();
        if(!canMoveWalter)
            canMoveWalter = true;
    })
    .start();
}

function setupMesh2RotateBackWithWalter( object){
    new TWEEN.Tween(object.rotation)
    .to({ z: 0}, 2000)
    .onStart(function(){
        secondLevel.rightWallMesh1.visible = true;
        secondLevel.backWallMesh2.visible = true;
    })
    .onUpdate( function() {
        walter.body.rotateX(-0.013);
        })
    .onComplete(function(){
        if(!canMoveWalter)
            canMoveWalter = true;
    })
    .start();
}

function setupMesh5RotateAnimation( object){
    new TWEEN.Tween(object.rotation)
    .to({ y: 0}, 2000)
    .onComplete(function() {
        object.updateMatrixWorld();
        secondLevel.backWallMesh4.visible = false;
        secondLevel.backWallMesh5.visible = false;
    })
    .start();
}

function setupMesh5RotateBack( object){
    tweenMesh5Back = new TWEEN.Tween(object.rotation)
    .to({ y:  Math.PI/2}, 2000)
    .onStart(function(){
        secondLevel.backWallMesh4.visible = true;
        secondLevel.backWallMesh5.visible = true;
    })
    .delay(5000)
    .onComplete(function(){
        object.updateMatrixWorld();
        if(!canMoveWalter)
            canMoveWalter = true;
    })
    .start();
}

function setupMesh5RotateBackWithWalter( object){
    new TWEEN.Tween(object.rotation)
    .to({ y:  Math.PI/2}, 2000)
    .onStart(function(){
        secondLevel.backWallMesh4.visible = true;
        secondLevel.backWallMesh5.visible = true;
    })
    .onUpdate( function() {
        walter.body.rotateX(-0.013);
        })
    .onComplete(function(){
        if(!canMoveWalter)
            canMoveWalter = true;
    })
    .start();
}

function setupButton1Animation(object){
    new TWEEN.Tween(object.position)
    .to({ y: 1 }, 125)
    .onStart(function() {
        button1AlreadyBack = false;
    })
    .start();
}

function  setupButton1Back(object){
    new TWEEN.Tween(object.position)
    .to({ y: 5}, 2000)
    .delay(5000)
    .onComplete(function() {
        button1AlreadyPressed = false;
    })
    .start();
}
function setupButton2Animation( object){
    new TWEEN.Tween(object.position)
    .to({ x:  "-"+1}, 125)
    .onStart(function() {
        button2AlreadyBack = false;
    })
    .start();
}

function  setupButton2Back(object){
    new TWEEN.Tween(object.position)
    .to({ x : "-"+5 }, 2000)
    .delay(5000)
    .onComplete(function() {
        button2AlreadyPressed = false;
    })
    .start();
}

function setupMesh7RotateAnimation( object){
    new TWEEN.Tween(object.rotation)
    .to({ x: Math.PI/2 }, 2000)
    .onStart(function(){
        setupWalterTranslateY(walter.body);
        setupLastTowerRotateAnimation(lastTower);
    })
    .onUpdate(function(){
        walter.body.rotateZ(-0.013);
        walter.body.position.z -= 0.1;
    })
    .onComplete(function(){  
        canMoveWalter=true;
        secondLevel.backWallMesh7.visible=true;
    })
    .start();
}

function setupWalterTranslateY(object){
    new TWEEN.Tween(object.position)
    .to({ x: object.position.x}, 1000)
    .onUpdate(function(){
        walter.body.position.y -= 0.21;
    })
    .start();
}

function setupLastTowerRotateAnimation( object){
    new TWEEN.Tween(object.rotation)
    .to({ x: Math.PI }, 2000)
    .onUpdate(function(){
        object.position.y+=0.085;
    })
    .start();
}

function setupButton3Animation(object){
    new TWEEN.Tween(object.position)
    .to({ z: 0.2}, 125)
    .onComplete(function(){
        var dir = new THREE.Vector3(secondLevel.mesh8.matrixWorld.getPosition().x, walter.body.position.y, walter.body.position.z);
        walter.body.lookAt(dir);
        walter.body.rotateZ(-Math.PI/2);
        setupMesh7RotateAnimation(secondLevel.mesh7);
    })
    .start();
}

function translateWalterOnMesh1Center(destinationPoint){
    new TWEEN.Tween(walter.body.position)
    .to({x: destinationPoint}, 1000)
    .delay(500)
    .onUpdate( function() {
        walter.walkForward();
    })
    .onComplete( function() {
        walter.walkStop();
        canMoveWalter = true;
    })
    .start();
}

function translateWalterOnMeshCenter(destinationPoint){
    new TWEEN.Tween(walter.body.position)
    .to({x: destinationPoint}, 1000)
    .onUpdate( function() {
        walter.walkForward();
    })
    .onComplete( function() {
        walter.walkStop();
        setupMesh2RotateBackWithWalter(secondLevel.mesh2);
    })
    .start();
}

function translateWalterOnMeshCenterZ(destinationPoint){
    new TWEEN.Tween(walter.body.position)
    .to({z: destinationPoint}, 1000)
    .onUpdate( function() {
        walter.walkForward();
    })
    .onComplete( function() {
        walter.walkStop();
        setupMesh5RotateBackWithWalter(secondLevel.mesh5);
    })
    .start();
}


//########################################### MODEL LOADERS ##########################################
function createBox(x,y,z,scale,rx,ry,rz){
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% earth downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    new THREE.MTLLoader()
        .setPath( 'models/box/' )
        .load( 'box.mtl', function ( materials ) {

            materials.preload();

            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( 'models/box/' )
                .load( 'box.obj', function ( object ) {

                    object.position.x = x;
                    object.position.y = y;
                    object.position.z = z;
                    object.scale.x = scale;
                    object.scale.y = scale;
                    object.scale.z = scale;
                    object.rotateX(rx);
                    object.rotateY(ry);
                    object.rotateZ(rz);

                    scene.add( object );

                }, onProgress, onError );
        } );
}


function createHouse(x,y,z,scale,rx,ry,rz){
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% earth downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    new THREE.MTLLoader()
        .setPath( 'models/house/' )
        .load( 'house.mtl', function ( materials ) {

            materials.preload();

            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( 'models/house/' )
                .load( 'house.obj', function ( object ) {

                    object.position.x = x;
                    object.position.y = y;
                    object.position.z = z;
                    object.scale.x = scale;
                    object.scale.y = scale;
                    object.scale.z = scale;
                    object.rotateX(rx);
                    object.rotateY(ry);
                    object.rotateZ(rz);

                    lastTower = object;

                    scene.add( object );

                }, onProgress, onError );
        } );
}

function createCandyStick(x,y,z,scale,rx,ry,rz){
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% earth downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    new THREE.MTLLoader()
        .setPath( 'models/candyStick/' )
        .load( 'candyStick.mtl', function ( materials ) {

            materials.preload();

            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( 'models/candyStick/' )
                .load( 'candyStick.obj', function ( object ) {

                    object.position.x = x;
                    object.position.y = y;
                    object.position.z = z;
                    object.scale.x = scale;
                    object.scale.y = scale;
                    object.scale.z = scale;
                    object.rotateX(rx);
                    object.rotateY(ry);
                    object.rotateZ(rz);

                    scene.add( object );

                }, onProgress, onError );
        } );
}

function createtree(x,y,z,scale,rx,ry,rz){
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% earth downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    new THREE.MTLLoader()
        .setPath( 'models/tree/' )
        .load( 'tree.mtl', function ( materials ) {

            materials.preload();

            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( 'models/tree/' )
                .load( 'tree.obj', function ( object ) {

                    object.position.x = x;
                    object.position.y = y;
                    object.position.z = z;
                    object.scale.x = scale;
                    object.scale.y = scale;
                    object.scale.z = scale;
                    object.rotateX(rx);
                    object.rotateY(ry);
                    object.rotateZ(rz);

                    scene.add( object );

                    loaded = true;

                }, onProgress, onError );
        } );
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
    var cloudMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );

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

//########################################### TEXTURE ##########################################
function createMeshWithTexture(geometry,image){
    var texture1 = new THREE.TextureLoader().load( "images/"+image );
    var textureMaterial1 = new THREE.MeshPhongMaterial( { map: texture1} );
    
    var texture2 = new THREE.TextureLoader().load( "images/"+image );
    var textureMaterial2 = new THREE.MeshPhongMaterial( { map: texture2} );
    
    var texture3 = new THREE.TextureLoader().load( "images/"+image );
    var textureMaterial3 = new THREE.MeshPhongMaterial( { map: texture3} );
    
    var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(
                                                                    [
                                                                     textureMaterial1, // +x
                                                                     textureMaterial1, // -x
                                                                     textureMaterial2, // +y
                                                                     textureMaterial2, // -y
                                                                     textureMaterial3, // +z
                                                                     textureMaterial3 // -z
                                                                     ]));
    
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture3.wrapS = THREE.RepeatWrapping;
    texture3.wrapT = THREE.RepeatWrapping;
    
    texture1.repeat.set(geometry.parameters.depth / 39 , geometry.parameters.height / 26);
    texture2.repeat.set(geometry.parameters.width / 39 , geometry.parameters.depth / 26);
    texture3.repeat.set(geometry.parameters.width / 39 , geometry.parameters.height / 26);
    
    texture1.needsUpdate = true;
    texture2.needsUpdate = true;
    texture3.needsUpdate = true;
    return mesh
}

function createRoofWithTexture(geometry){
    var texture1 = new THREE.TextureLoader().load( "images/roof2.jpg" );
    var textureMaterial1 = new THREE.MeshPhongMaterial( { map: texture1} );
    
    var texture2 = new THREE.TextureLoader().load( "images/roof2.jpg" );
    var textureMaterial2 = new THREE.MeshPhongMaterial( { map: texture2} );
    
    var texture3 = new THREE.TextureLoader().load( "images/roof2.jpg" );
    var textureMaterial3 = new THREE.MeshPhongMaterial( { map: texture3} );
    
    var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(
                                                                    [
                                                                     textureMaterial1, // +x
                                                                     textureMaterial1, // -x
                                                                     textureMaterial2, // +y
                                                                     textureMaterial2, // -y
                                                                     textureMaterial3, // +z
                                                                     textureMaterial3 // -z
                                                                     ]));
    
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture3.wrapS = THREE.RepeatWrapping;
    texture3.wrapT = THREE.RepeatWrapping;
    
    texture1.repeat.set(2,1);
    texture2.repeat.set(2,1);
    texture3.repeat.set(2,1);
    
    texture1.needsUpdate = true;
    texture2.needsUpdate = true;
    texture3.needsUpdate = true;
    return mesh
}

function createBigTowerWithTexture(geometry,image){
    var texture1 = new THREE.TextureLoader().load( "images/"+image );
    var textureMaterial1 = new THREE.MeshPhongMaterial( { map: texture1} );
    
    var texture2 = new THREE.TextureLoader().load( "images/"+image );
    var textureMaterial2 = new THREE.MeshPhongMaterial( { map: texture2} );
    
    var texture3 = new THREE.TextureLoader().load( "images/"+image );
    var textureMaterial3 = new THREE.MeshPhongMaterial( { map: texture3} );
    
    var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(
                                                                    [
                                                                     textureMaterial1, // +x
                                                                     textureMaterial1, // -x
                                                                     textureMaterial2, // +y
                                                                     textureMaterial2, // -y
                                                                     textureMaterial3, // +z
                                                                     textureMaterial3 // -z
                                                                     ]));
    
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture3.wrapS = THREE.RepeatWrapping;
    texture3.wrapT = THREE.RepeatWrapping;
    
    texture1.repeat.set(geometry.parameters.depth / 39 , geometry.parameters.height / 26);
    texture2.repeat.set(geometry.parameters.width / 39 , geometry.parameters.depth / 26);
    texture3.repeat.set(geometry.parameters.width / 39 , geometry.parameters.height / 26);
    
    texture1.needsUpdate = true;
    texture2.needsUpdate = true;
    texture3.needsUpdate = true;
    return mesh
}


var simulateRain = function(){
    var pCount = particleCount;
    while (pCount--) {
      var particle = particles.vertices[pCount];
      if (particle.y < -200) {
        particle.y = 200;
        particle.velocity.y = -1.2;
      }
  
      particle.velocity.y -= Math.random() * .02;
  
      particle.y += particle.velocity.y;
    }
  
    particles.verticesNeedUpdate = true;
  };


//GO TO THIRD LEVEL
function goToThirdLevel(){
    document.getElementById('myModal').style.display = "none";
    document.getElementById('myOverlay').style.display = "none";
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    document.getElementById("next").removeEventListener('click', goToThirdLevel, false);
    cancelAnimationFrame(frameID);
    renderer.render( scene, camera );
    initThirdLevel(scene, renderer);
    createThirdLevel();
    animateThirdLevel();
}
