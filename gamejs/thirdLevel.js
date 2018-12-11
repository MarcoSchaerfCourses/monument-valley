import {createWalter} from './walter.js'
import {initFirstLevel, createFirstLevel, animateFirstLevel} from './firstLevel.js'

var scene, camera, renderer, mouse , keyboard, raycaster;

// custom global variables
var thirdLevel, walter, lastArch, frameID;
var translateFirstCarriage = 0;
var translateSecondCarriage = 0;
var translateMovableElevator = 1;

var canMoveWalter = true;
var translateCollision = true;
var rotateWalterFrontal = true;
var firstElevatorUp = false;
var secondElevatorUp = false;
var entered = false;
var towerRotated = false;
var buttonPressed = false;
var completed = false;


export function initThirdLevel(s, r) {

    translateFirstCarriage = 0;
    translateSecondCarriage = 0;
    translateMovableElevator = 1;

    canMoveWalter = true;
    translateCollision = true;
    rotateWalterFrontal = true;
    firstElevatorUp = false;
    secondElevatorUp = false;
    entered = false;
    towerRotated = false;
    buttonPressed = false;
    completed = false;
    
    // SCENE
    scene = s;
    
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(-211.93080398827863, 105.6074504211016, 209.92475017595305);
    camera.lookAt(scene.position);
    
    // RENDERER
    renderer = r;
    
    //KEYBOARD
    keyboard = new THREEx.KeyboardState();
    
    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-200,150, 194);
    scene.add(light);
    
    // SKY
    scene.fog = new THREE.Fog( scene.background, 1, 5000 );
    var vertexShader = document.getElementById( 'vertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    var uniforms = {
    topColor: { value: new THREE.Color( 0x000000 ) },
    bottomColor: { value: new THREE.Color( 0x000066 ) },
    offset: { value: 700 },
    exponent: { value: 0.6 }
    };
    scene.fog.color.copy( uniforms.bottomColor.value );
    var skyGeo = new THREE.SphereBufferGeometry( 1000, 20, 40);
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
    document.getElementById("next").addEventListener('click', goToFirstLevel, false);
}


//POPULATE THE SCENE
function ThirdLevel(){
    
    this.threegroup = new THREE.Group();
    
    //CREATING MESHES
    var wallMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff, transparent: true, opacity: 0});

    var geometry = new THREE.BoxGeometry( 200, 20, 15);
    this.mesh1 = createMeshWithTexture(geometry);

    var geometry2 = new THREE.BoxGeometry( 200, 35, 15);
    this.mesh2 = createMeshWithTexture(geometry2);

    var geometry3 = new THREE.BoxGeometry( 15, 35, 30);
    this.mesh3 = createMeshWithTexture(geometry3);

    var geometry4 = new THREE.BoxGeometry( 15, 55, 30);
    this.mesh4 = createMeshWithTexture(geometry4);

    var geometry5 = new THREE.BoxGeometry( 15, 80, 80);
    this.mesh5 = createMeshWithTexture(geometry5);

    var geometry6 = new THREE.BoxGeometry( 30, 55, 15);
    this.mesh6 = createMeshWithTexture(geometry6);

    var geometry7 = new THREE.BoxGeometry( 50, 80, 15);
    this.mesh7 = createMeshWithTexture( geometry7);

    var geometry8 = new THREE.BoxGeometry( 33, 80 + 47, 15);
    this.movableElevator = createMovablesWithTexture(geometry8);

    var geometry9 = new THREE.BoxGeometry( 38.5, 80 + 70, 38.5);
    this.leftTower = createMeshWithTexture( geometry9);

    var geometry10 = new THREE.BoxGeometry( 38.5, 80 + 70, 38.5);
    this.rightTower = createMeshWithTexture( geometry10);

    var geometry11 = new THREE.BoxGeometry( 38.5, 25, 38.5);
    this.leftTowerTop = createMeshWithTexture( geometry11);

    var geometry12 = new THREE.BoxGeometry( 38.5, 35, 38.5);
    this.rightTowerTop = createMeshWithTexture( geometry12);

    var geometry13 = new THREE.CylinderGeometry(0, 27.5, 27.5, 4, false);
    this.leftRoof = createRoofWithTexture( geometry13);

    var geometry14 = new THREE.CylinderGeometry(0, 27.5, 27.5, 4, false);
    this.rightRoof = createRoofWithTexture( geometry14);

    var geometry15 = new THREE.BoxGeometry( 55, 35, 15);
    this.firstCarriage = createMovablesWithTexture(geometry15);

    var geometry16 = new THREE.BoxGeometry( 30, 45, 15);
    this.secondCarriage = createMovablesWithTexture(geometry16);

    var geometry17 = new THREE.BoxGeometry( 65.5, 5, 15);
    this.leftRoad = createMovablesWithTexture(geometry17);

    var geometry18 = new THREE.BoxGeometry( 46, 5, 15);
    this.rightRoad = createMovablesWithTexture(geometry18);

    var geometry19 = new THREE.BoxGeometry( 15.7, 5, 30);
    this.buttonRoad = createMeshWithTexture( geometry19);

    var geometry20 = new THREE.BoxGeometry( 10, 1, 10);
    this.button = createMovablesWithTexture(geometry20);

    var geometry21 = new THREE.BoxGeometry( 15, 0, 15);
    this.firstElevator = createMovablesWithTexture(geometry21);

    var geometry22 = new THREE.BoxGeometry( 15, 0, 15);
    this.secondElevator = createMovablesWithTexture(geometry22);
    
    var geometry23 = new THREE.BoxGeometry(0, 60, 30);
    this.leftWallMesh3 = new THREE.Mesh( geometry23, wallMaterial );
    
    var geometry24 = new THREE.BoxGeometry(15, 60, 0);
    this.frontWallMesh3 = new THREE.Mesh( geometry24, wallMaterial );
    
    var geometry25 = new THREE.BoxGeometry(15, 60, 0);
    this.backWallMesh3 = new THREE.Mesh( geometry25, wallMaterial );
    
    var geometry26 = new THREE.BoxGeometry(0, 60, 15);
    this.rightWallMesh3 = new THREE.Mesh( geometry26, wallMaterial );
    
    var geometry27 = new THREE.BoxGeometry(15, 60, 0);
    this.firstElevatorWall = new THREE.Mesh( geometry27, wallMaterial );
    
    var geometry28 = new THREE.BoxGeometry(0, 60, 15);
    this.leftWallMesh4 = new THREE.Mesh( geometry28, wallMaterial );
    
    var geometry29 = new THREE.BoxGeometry(15, 60, 0);
    this.backWallMesh4 = new THREE.Mesh( geometry29, wallMaterial );
    
    var geometry30 = new THREE.BoxGeometry(15, 60, 0);
    this.frontWallMesh4 = new THREE.Mesh( geometry30, wallMaterial );
    
    var geometry31 = new THREE.BoxGeometry(0, 60, 80);
    this.leftWallMesh5 = new THREE.Mesh( geometry31, wallMaterial );
    
    var geometry32 = new THREE.BoxGeometry(200, 80, 0);
    this.frontWallFirstCarriage = new THREE.Mesh( geometry32, wallMaterial );
    
    var geometry33 = new THREE.BoxGeometry(170, 60, 0);
    this.backWallFirstCarriage = new THREE.Mesh( geometry33, wallMaterial );
    
    var geometry34 = new THREE.BoxGeometry(0, 60 ,15);
    this.leftWallFirstCarriage = new THREE.Mesh( geometry34, wallMaterial);
    
    var geometry35 = new THREE.BoxGeometry(0, 60, 15);
    this.rightWallFirstCarriage = new THREE.Mesh( geometry35, wallMaterial);
    
    var geometry36 = new THREE.BoxGeometry(0, 60, 15);
    this.leftWallMesh6 = new THREE.Mesh( geometry36, wallMaterial);
    
    var geometry37 = new THREE.BoxGeometry(0, 60, 30);
    this.rightWallMesh6 = new THREE.Mesh( geometry37, wallMaterial);
    
    var geometry38 = new THREE.BoxGeometry(0, 60, 15);
    this.secondElevatorWall = new THREE.Mesh( geometry38, wallMaterial);
    this.secondElevatorWall.visible = false;

    var geometry39 = new THREE.BoxGeometry(170, 60, 0);
    this.backWallSecondCarriage = new THREE.Mesh( geometry39, wallMaterial );

    this.leftWallMesh7 = new THREE.Mesh( geometry36, wallMaterial);

    this.leftWallSecondCarriage = new THREE.Mesh( geometry34, wallMaterial);
    
    this.rightWallSecondCarriage = new THREE.Mesh( geometry34, wallMaterial);

    this.rightWallMesh5Car = new THREE.Mesh( geometry36, wallMaterial);

    var geometry40 = new THREE.BoxGeometry(0, 175, 35);
    this.rightWallMesh5 = new THREE.Mesh( geometry40, wallMaterial);

    var geometry41 = new THREE.BoxGeometry(60, 50, 0);
    this.backWallMesh5 = new THREE.Mesh( geometry41, wallMaterial);

    var geometry42 = new THREE.BoxGeometry(0, 60, 40);
    this.leftWallFirstArch = new THREE.Mesh( geometry42, wallMaterial);

    var geometry43 = new THREE.BoxGeometry(0, 80, 80);
    this.leftWallSecondArch = new THREE.Mesh( geometry43, wallMaterial);

    var geometry44 = new THREE.BoxGeometry(33, 30, 0);
    this.frontWallMovableElevator = new THREE.Mesh( geometry44, wallMaterial);

    var geometry45 = new THREE.BoxGeometry(0, 30, 15);
    this.rightWallMovableElevator = new THREE.Mesh( geometry45, wallMaterial);

    var geometry46 = new THREE.BoxGeometry(2*16, 30, 0);
    this.backWallMovableElevator = new THREE.Mesh( geometry46, wallMaterial);

    var geometry47 = new THREE.BoxGeometry(0, 30, 30);
    this.rightWallButtonRoad = new THREE.Mesh( geometry47, wallMaterial);

    var geometry48 = new THREE.BoxGeometry(15.7, 30, 0);
    this.backWallButtonRoad = new THREE.Mesh( geometry48, wallMaterial);

    var geometry49 = new THREE.BoxGeometry(15.7, 30, 0);
    this.frontWallSecondArch = new THREE.Mesh( geometry49, wallMaterial);

    var geometry50 = new THREE.BoxGeometry(130, 30, 0);
    this.rightWallRoad = new THREE.Mesh( geometry50, wallMaterial);

    this.leftWallRoad = new THREE.Mesh( geometry50, wallMaterial);

    this.frontWallLastFloor = new THREE.Mesh( geometry49, wallMaterial);
    this.frontWallLastFloor.visible = false;

    
    //POSITIONS
    this.mesh1.position.x = 40;
    this.mesh1.position.y = -100;

    this.mesh2.position.y = this.mesh2.geometry.parameters.height/2 - this.mesh1.geometry.parameters.height/2;
    this.mesh2.position.z = - this.mesh1.geometry.parameters.depth;
    
    this.mesh3.position.x = - (this.mesh1.geometry.parameters.width/2 + this.mesh3.geometry.parameters.width/2);
    this.mesh3.position.y = this.mesh3.geometry.parameters.height/2 - this.mesh1.geometry.parameters.height/2;
    this.mesh3.position.z = - this.mesh1.geometry.parameters.depth/2;

    this.mesh4.position.x = - this.mesh2.geometry.parameters.width/2 - this.mesh4.geometry.parameters.width/2 + 
                              this.mesh3.geometry.parameters.width;
    this.mesh4.position.y = this.mesh4.geometry.parameters.height/2 - this.mesh2.geometry.parameters.height/2;
    this.mesh4.position.z = - this.mesh4.geometry.parameters.depth/2 + this.mesh2.geometry.parameters.depth/2;
    
    this.mesh5.position.x = - this.mesh2.geometry.parameters.width/2 - this.mesh5.geometry.parameters.width/2 + 
                              this.mesh3.geometry.parameters.width + this.mesh4.geometry.parameters.width;
    this.mesh5.position.y = this.mesh5.geometry.parameters.height/2 - this.mesh2.geometry.parameters.height/2;
    this.mesh5.position.z = - this.mesh5.geometry.parameters.depth/2 + this.mesh2.geometry.parameters.depth/2;

    this.mesh6.position.x = this.mesh1.geometry.parameters.width/2 - this.mesh6.geometry.parameters.width/2;
    this.mesh6.position.y = this.mesh6.geometry.parameters.height/2 - this.mesh1.geometry.parameters.height/2;

    this.mesh7.position.x = + this.mesh2.geometry.parameters.width/2 - this.mesh7.geometry.parameters.width/2;
    this.mesh7.position.y = this.mesh7.geometry.parameters.height/2 - this.mesh2.geometry.parameters.height/2;

    this.movableElevator.position.x = this.mesh5.geometry.parameters.width/2 + this.movableElevator.geometry.parameters.width/2;
    this.movableElevator.position.y = -this.mesh5.geometry.parameters.height/2 + this.movableElevator.geometry.parameters.height/2 +19.4;
    this.movableElevator.position.z = this.mesh5.geometry.parameters.depth/2 - this.movableElevator.geometry.parameters.depth/2 -
                                      this.mesh2.geometry.parameters.depth - 11.5;

    this.leftTower.position.x = this.mesh5.geometry.parameters.width/2 + this.leftTower.geometry.parameters.width/2 + 32;
    this.leftTower.position.y = -this.mesh5.geometry.parameters.height/2 + this.leftTower.geometry.parameters.height/2 - 3.6;
    this.leftTower.position.z = - this.leftTower.geometry.parameters.depth/2 - this.movableElevator.geometry.parameters.depth/2 + 6;

    this.rightTower.position.x = this.mesh2.geometry.parameters.width - this.mesh3.geometry.parameters.width -
                                this.mesh4.geometry.parameters.width;
    this.rightTower.position.y = -this.mesh5.geometry.parameters.height/2 + this.rightTower.geometry.parameters.height/2 - 3.6;
    this.rightTower.position.z = this.mesh5.geometry.parameters.depth/2 - this.rightTower.geometry.parameters.depth/2 - 
                                this.mesh2.geometry.parameters.depth;

    this.leftTowerTop.position.y = this.leftTower.geometry.parameters.height/2 + this.leftTowerTop.geometry.parameters.height/2 + 1;
    this.leftTowerTop.rotateY(Math.PI/2);

    this.rightTowerTop.position.y = this.rightTower.geometry.parameters.height/2 + this.rightTowerTop.geometry.parameters.height/2 + 1;
    this.rightTowerTop.rotateY(-Math.PI/2);

    this.leftRoof.position.y = this.leftTowerTop.geometry.parameters.height/2 + this.leftRoof.geometry.parameters.height/2;
    this.leftRoof.rotateY(Math.PI/4);

    this.rightRoof.position.y = this.rightTowerTop.geometry.parameters.height/2 + this.rightRoof.geometry.parameters.height/2;
    this.rightRoof.rotateY(Math.PI/4);

    this.firstCarriage.position.x = this.mesh1.geometry.parameters.width/2 - this.firstCarriage.geometry.parameters.width/2 -
                                    this.mesh6.geometry.parameters.width;
    this.firstCarriage.position.y = this.mesh1.geometry.parameters.height/2 + this.firstCarriage.geometry.parameters.height/2;

    this.secondCarriage.position.x = -this.mesh2.geometry.parameters.width/2 + this.secondCarriage.geometry.parameters.width/2 +
                                    this.mesh4.geometry.parameters.width + this.mesh5.geometry.parameters.width;
    this.secondCarriage.position.y = this.mesh2.geometry.parameters.height/2 + this.secondCarriage.geometry.parameters.height/2;

    this.leftRoad.position.x = -this.leftTowerTop.geometry.parameters.width/2 + this.leftRoad.geometry.parameters.width/2 + 1.5;
    this.leftRoad.position.y = -this.leftTowerTop.geometry.parameters.height/2 + this.leftRoad.geometry.parameters.height/2 - 1;
    this.leftRoad.position.z = this.leftTowerTop.geometry.parameters.depth/2 - this.leftRoad.geometry.parameters.depth/2 - 3;
    this.leftRoad.visible = false;

    this.rightRoad.position.x = + this.rightTowerTop.geometry.parameters.width/2 - this.rightRoad.geometry.parameters.width/2 - 1.5;
    this.rightRoad.position.y = -this.rightTowerTop.geometry.parameters.height/2  +this.rightRoad.geometry.parameters.height/2 - 1;
    this.rightRoad.position.z = - this.rightTowerTop.geometry.parameters.depth/2 + 6;
    this.rightRoad.visible = false;

    this.buttonRoad.position.x = -this.leftTower.geometry.parameters.width/2 - this.buttonRoad.geometry.parameters.width/2;
    this.buttonRoad.position.y = this.leftTower.geometry.parameters.height/2 - this.buttonRoad.geometry.parameters.height/2;
    this.buttonRoad.position.z = -this.leftTower.geometry.parameters.depth/2 - this.buttonRoad.geometry.parameters.depth/2 + 0.3;

    this.button.position.y = this.buttonRoad.geometry.parameters.height/2 + this.button.geometry.parameters.height/2;
    this.button.position.z = -this.button.geometry.parameters.depth/2;

    this.firstElevator.position.y = this.mesh3.geometry.parameters.height/2;
    this.firstElevator.position.z = -this.mesh3.geometry.parameters.depth/2 + this.firstElevator.geometry.parameters.depth/2;

    this.secondElevator.position.x = this.mesh6.geometry.parameters.width/2 - this.secondElevator.geometry.parameters.width/2;
    this.secondElevator.position.y = this.mesh6.geometry.parameters.height/2;
    
    this.leftWallMesh3.position.x = - this.mesh3.geometry.parameters.width/2;
    this.leftWallMesh3.position.y = this.mesh3.geometry.parameters.height/2;
    
    this.frontWallMesh3.position.y = this.mesh3.geometry.parameters.height/2;
    this.frontWallMesh3.position.z = this.mesh3.geometry.parameters.depth/2;
    
    this.backWallMesh3.position.y = this.mesh3.geometry.parameters.height/2;
    this.backWallMesh3.position.z = - this.mesh3.geometry.parameters.depth/2;
    
    this.rightWallMesh3.position.x = this.mesh3.geometry.parameters.width/2;
    this.rightWallMesh3.position.y = this.mesh3.geometry.parameters.height/2;
    this.rightWallMesh3.position.z = this.rightWallMesh3.geometry.parameters.depth/2;
    
    this.firstElevatorWall.position.y = this.mesh3.geometry.parameters.height/2;
    this.firstElevatorWall.position.z = 5;
    this.firstElevatorWall.visible = false;
    
    this.leftWallMesh4.position.x = - this.mesh4.geometry.parameters.width/2;
    this.leftWallMesh4.position.y = this.mesh4.geometry.parameters.height;
    this.leftWallMesh4.position.z = - this.leftWallMesh4.geometry.parameters.depth/2;
    
    this.backWallMesh4.position.y = this.mesh4.geometry.parameters.height;
    this.backWallMesh4.position.z = - this.mesh4.geometry.parameters.depth/2;
    
    this.frontWallMesh4.position.y = this.mesh4.geometry.parameters.height;
    this.frontWallMesh4.position.z = this.mesh4.geometry.parameters.depth/2;
    
    this.leftWallMesh5.position.x = - this.mesh5.geometry.parameters.width/2;
    this.leftWallMesh5.position.y = this.mesh5.geometry.parameters.height/2;
    
    this.frontWallFirstCarriage.position.y = this.mesh1.geometry.parameters.height/2 + this.frontWallFirstCarriage.geometry.parameters.height/2;
    this.frontWallFirstCarriage.position.z = this.mesh1.geometry.parameters.depth/2;
    
    this.backWallFirstCarriage.position.y = this.mesh2.geometry.parameters.height/2 + this.backWallFirstCarriage.geometry.parameters.height/2;
    this.backWallFirstCarriage.position.z = this.mesh2.geometry.parameters.depth/2;
    
    this.leftWallFirstCarriage.position.x = - this.firstCarriage.geometry.parameters.width/2;
    this.leftWallFirstCarriage.position.y = this.mesh1.geometry.parameters.height/2 + this.firstCarriage.geometry.parameters.height/2;
    
    this.rightWallFirstCarriage.position.x = this.firstCarriage.geometry.parameters.width/2;
    this.rightWallFirstCarriage.position.y = this.mesh1.geometry.parameters.height/2 + this.firstCarriage.geometry.parameters.height/2;
    
    this.leftWallMesh6.position.x = - this.mesh6.geometry.parameters.width/2;
    this.leftWallMesh6.position.y = this.mesh6.geometry.parameters.height/2;
    
    this.rightWallMesh6.position.x = this.mesh6.geometry.parameters.width/2;
    this.rightWallMesh6.position.y = this.mesh6.geometry.parameters.height/2 + this.rightWallMesh6.geometry.parameters.height/2;
    this.rightWallMesh6.position.z = - this.mesh6.geometry.parameters.depth/2;
    
    this.secondElevatorWall.position.x = -5;
    this.secondElevatorWall.position.y = this.mesh6.geometry.parameters.height;

    this.backWallSecondCarriage.position.x = this.mesh5.geometry.parameters.width;
    this.backWallSecondCarriage.position.y = this.mesh2.geometry.parameters.height/2 + this.backWallSecondCarriage.geometry.parameters.height/2;
    this.backWallSecondCarriage.position.z = -this.mesh2.geometry.parameters.depth/2;

    this.leftWallMesh7.position.x = -this.mesh7.geometry.parameters.width/2;
    this.leftWallMesh7.position.y = this.mesh7.geometry.parameters.height/2;

    this.leftWallSecondCarriage.position.x = - this.secondCarriage.geometry.parameters.width/2;
    this.leftWallSecondCarriage.position.y = this.mesh2.geometry.parameters.height/2 + this.secondCarriage.geometry.parameters.height/2;

    this.rightWallSecondCarriage.position.x = this.secondCarriage.geometry.parameters.width/2;
    this.rightWallSecondCarriage.position.y = this.mesh2.geometry.parameters.height/2 + this.secondCarriage.geometry.parameters.height/2;

    this.rightWallMesh5Car.position.x = this.mesh5.geometry.parameters.width/2;
    this.rightWallMesh5Car.position.y = this.mesh5.geometry.parameters.height/2;
    this.rightWallMesh5Car.position.z = this.mesh5.geometry.parameters.depth/2 - this.rightWallMesh5Car.geometry.parameters.depth/2;

    this.rightWallMesh5.position.x = this.mesh5.geometry.parameters.width/2;
    this.rightWallMesh5.position.y = this.mesh5.geometry.parameters.height/2;
    this.rightWallMesh5.position.z = this.mesh5.geometry.parameters.depth/2 - this.rightWallMesh5.geometry.parameters.depth/2
                                    - this.rightWallMesh5Car.geometry.parameters.depth;
    
    this.backWallMesh5.position.x = - this.mesh5.geometry.parameters.width/2 + this.backWallMesh5.geometry.parameters.width/2;
    this.backWallMesh5.position.y = this.mesh5.geometry.parameters.height/2 + this.backWallMesh5.geometry.parameters.height/2;
    this.backWallMesh5.position.z = - this.mesh5.geometry.parameters.depth/2 ;

    this.leftWallFirstArch.position.x = this.mesh5.geometry.parameters.width/2;
    this.leftWallFirstArch.position.y = this.mesh5.geometry.parameters.height/2 + this.leftWallFirstArch.geometry.parameters.height/2 + 25;
    this.leftWallFirstArch.position.z = -this.mesh5.geometry.parameters.depth/2 +this.leftWallFirstArch.geometry.parameters.depth/2;

    this.leftWallSecondArch.position.x = -this.buttonRoad.geometry.parameters.width/2;
    this.leftWallSecondArch.position.y = -20;
    this.leftWallSecondArch.position.z = 13.5;
    this.leftWallSecondArch.visible = false;

    this.frontWallMovableElevator.position.y = this.movableElevator.geometry.parameters.height/2 + this.frontWallMovableElevator.geometry.parameters.height/2;
    this.frontWallMovableElevator.position.z = this.movableElevator.geometry.parameters.depth/2;

    this.rightWallMovableElevator.position.x = this.movableElevator.geometry.parameters.width/2;
    this.rightWallMovableElevator.position.y = this.movableElevator.geometry.parameters.height/2 + this.rightWallMovableElevator.geometry.parameters.height/2;

    this.backWallMovableElevator.position.x = - this.movableElevator.geometry.parameters.width/2 + this.backWallMovableElevator.geometry.parameters.width/2;
    this.backWallMovableElevator.position.y = this.movableElevator.geometry.parameters.height/2 + this.rightWallMovableElevator.geometry.parameters.height/2;
    this.backWallMovableElevator.position.z = - this.movableElevator.geometry.parameters.depth/2;
    this.backWallMovableElevator.visible = false;

    this.rightWallButtonRoad.position.x = this.buttonRoad.geometry.parameters.width/2;

    this.backWallButtonRoad.position.z = - this.buttonRoad.geometry.parameters.depth/2;

    this.frontWallSecondArch.position.x = - this.leftTower.geometry.parameters.width/2 - this.frontWallSecondArch.geometry.parameters.width/2;
    this.frontWallSecondArch.position.y = + this.leftTower.geometry.parameters.height/2 - this.frontWallSecondArch.geometry.parameters.height/2;
    this.frontWallSecondArch.position.z = this.leftTower.geometry.parameters.depth/2;

    this.rightWallRoad.position.x = - this.leftTower.geometry.parameters.width/2 + this.rightWallRoad.geometry.parameters.width/2;
    this.rightWallRoad.position.y = this.leftTower.geometry.parameters.height/2 + this.rightWallRoad.geometry.parameters.height/2;
    this.rightWallRoad.position.z = this.leftTower.geometry.parameters.depth/2;

    this.leftWallRoad.position.x = - this.leftTower.geometry.parameters.width/2 + this.leftWallRoad.geometry.parameters.width/2;
    this.leftWallRoad.position.y = this.leftTower.geometry.parameters.height/2 + this.leftWallRoad.geometry.parameters.height/2;
    this.leftWallRoad.position.z = this.leftTower.geometry.parameters.depth/2 + 15;

    this.frontWallLastFloor.position.x = - this.leftTower.geometry.parameters.width/2 - this.frontWallLastFloor.geometry.parameters.width/2;
    this.frontWallLastFloor.position.y = + this.leftTower.geometry.parameters.height/2 + this.frontWallLastFloor.geometry.parameters.height/2;
    this.frontWallLastFloor.position.z = this.leftTower.geometry.parameters.depth/2;
    
    //GROUP ELEMENTS
    this.mesh1.add(this.mesh2);
    this.mesh1.add(this.mesh3);
    this.mesh1.add(this.mesh6);
    this.mesh1.add(this.firstCarriage);
    this.mesh1.add(this.frontWallFirstCarriage);
    this.mesh2.add(this.mesh4);
    this.mesh2.add(this.mesh5);
    this.mesh2.add(this.mesh7);
    this.mesh2.add(this.secondCarriage);
    this.mesh2.add(this.backWallFirstCarriage);
    this.mesh2.add(this.backWallSecondCarriage);
    this.mesh3.add(this.firstElevator);
    this.mesh3.add(this.leftWallMesh3);
    this.mesh3.add(this.frontWallMesh3);
    this.mesh3.add(this.backWallMesh3);
    this.mesh3.add(this.rightWallMesh3);
    this.mesh3.add(this.firstElevatorWall);
    this.mesh4.add(this.leftWallMesh4);
    this.mesh4.add(this.backWallMesh4);
    this.mesh4.add(this.frontWallMesh4);
    this.mesh5.add(this.movableElevator);
    this.mesh5.add(this.leftTower);
    this.mesh5.add(this.rightTower);
    this.mesh5.add(this.leftWallMesh5);
    this.mesh5.add(this.rightWallMesh5Car);
    this.mesh5.add(this.rightWallMesh5);
    this.mesh5.add(this.backWallMesh5);
    this.mesh5.add(this.leftWallFirstArch);
    this.mesh6.add(this.secondElevator);
    this.mesh6.add(this.leftWallMesh6);
    this.mesh6.add(this.rightWallMesh6);
    this.mesh6.add(this.secondElevatorWall);
    this.mesh7.add(this.leftWallMesh7);
    this.firstCarriage.add(this.leftWallFirstCarriage);
    this.firstCarriage.add(this.rightWallFirstCarriage);
    this.secondCarriage.add(this.leftWallSecondCarriage);
    this.secondCarriage.add(this.rightWallSecondCarriage);
    this.leftTower.add(this.leftTowerTop);
    this.leftTower.add(this.buttonRoad);
    this.leftTower.add(this.frontWallSecondArch);
    this.leftTower.add(this.rightWallRoad);
    this.leftTower.add(this.leftWallRoad);
    this.leftTower.add(this.frontWallLastFloor);
    this.rightTower.add(this.rightTowerTop);
    this.leftTowerTop.add(this.leftRoof);
    this.leftTowerTop.add(this.leftRoad);
    this.rightTowerTop.add(this.rightRoof);
    this.rightTowerTop.add(this.rightRoad);
    this.buttonRoad.add(this.button);
    this.buttonRoad.add(this.leftWallSecondArch);
    this.buttonRoad.add(this.rightWallButtonRoad);
    this.buttonRoad.add(this.backWallButtonRoad);
    this.movableElevator.add(this.frontWallMovableElevator);
    this.movableElevator.add(this.rightWallMovableElevator);
    this.movableElevator.add(this.backWallMovableElevator);
    this.threegroup.add(this.mesh1);

    /* ########## MODELS LOADERS ########## */
    createArch(-21.8, -40.2, -68.2, Math.PI/2, 20, false);
    createArch(-5.5, -5, -68.2, Math.PI/2, 20, false);
    createArch(120.5, 37.5, -42, Math.PI/2, 15, true);
    createMoon();
    createEarth();
    createSaturn();

    //STARFIELD
    var starsGeometry = new THREE.Geometry();
    for ( var i = 0; i < 15000; i ++ ) {
        var star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread( 2000 );
        star.y = THREE.Math.randFloatSpread( 2000 );
        star.z = THREE.Math.randFloatSpread( 2000 );
        starsGeometry.vertices.push( star );
    }
    var starsMaterial = new THREE.PointsMaterial( { color: 0x888888 } );
    var starField = new THREE.Points( starsGeometry, starsMaterial );
    scene.add( starField );
    
    //WALTER
    walter = createWalter(scene);
    walter.body.position.x = -66.89564944833867;
    walter.body.position.y = -66.5;
    walter.body.position.z = 4.3603783001210843;
    
    /*walter.body.position.x = -39.26157561742835;
    walter.body.position.y = -21.6;
    walter.body.position.z = -25.11624837450779;*/
    
    walter.body.rotateY(-Math.PI);
}

//STARTUP FUNCTION
export function createThirdLevel() {
    thirdLevel = new ThirdLevel();
    scene.add(thirdLevel.threegroup);
}

export function animateThirdLevel() {
    frameID = requestAnimationFrame( animateThirdLevel );
    renderThirdLevel();
    updateThirdLevel();
}

function updateThirdLevel() {

    // move walter forwards
    if ( keyboard.pressed("up") && canMoveWalter)
        walter.walkForward();
    else{
        if(canMoveWalter)
            walter.walkStop();
    }
    
    // rotate walter left/right
    if ( keyboard.pressed("left") && canMoveWalter )
        walter.rotateLeft();
    
    if ( keyboard.pressed("right") && canMoveWalter)
        walter.rotateRight();
    
    //collision detection
    var ray = new THREE.Vector3(0, 0, 1);
    var collidableMeshList = [thirdLevel.mesh4, thirdLevel.mesh5, thirdLevel.mesh7, thirdLevel.movableElevator, thirdLevel.rightTower,
                              thirdLevel.leftTowerTop, thirdLevel.leftWallMesh3, thirdLevel.rightWallMesh3, thirdLevel.frontWallMesh3,
                              thirdLevel.backWallMesh3, thirdLevel.firstElevatorWall, thirdLevel.leftWallMesh4, thirdLevel.backWallMesh4,
                              thirdLevel.frontWallMesh4, thirdLevel.leftWallMesh5, thirdLevel.frontWallFirstCarriage, 
                              thirdLevel.backWallFirstCarriage, thirdLevel.leftWallFirstCarriage, thirdLevel.rightWallFirstCarriage, 
                              thirdLevel.leftWallMesh6, thirdLevel.rightWallMesh6, thirdLevel.secondElevatorWall, 
                              thirdLevel.backWallSecondCarriage, thirdLevel.leftWallMesh7 , thirdLevel.leftWallSecondCarriage,
                              thirdLevel.rightWallSecondCarriage, thirdLevel.rightWallMesh5Car, thirdLevel.rightWallMesh5, 
                              thirdLevel.backWallMesh5, thirdLevel.leftWallFirstArch,thirdLevel.leftWallSecondArch, 
                              thirdLevel.frontWallMovableElevator, thirdLevel.rightWallMovableElevator, thirdLevel.backWallMovableElevator,
                              thirdLevel.rightWallButtonRoad, thirdLevel.backWallButtonRoad, thirdLevel.frontWallSecondArch,
                              thirdLevel.rightWallRoad, thirdLevel.leftWallRoad, thirdLevel.frontWallLastFloor];
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

    //to detect when walter is on the first elevator
    if (walter.body.position.z <= -13 && !firstElevatorUp){
        canMoveWalter = false;
        walter.walkStop();
        firstElevatorUp = true;
        thirdLevel.firstElevatorWall.visible = true;
        setupElevatorScaleAnimation( thirdLevel.firstElevator, 
            { x: 1, y: 1 , z: 1}, 
            { x: 1, y: thirdLevel.mesh4.geometry.parameters.height - thirdLevel.mesh3.geometry.parameters.height, z: 1}, 
            2000, 500, TWEEN.Easing.Linear.None , 0.083);
    }

    //to detect when walter is on the second elevator
    if (walter.body.position.x >= 131 && !secondElevatorUp){
        canMoveWalter = false;
        walter.walkStop();
        secondElevatorUp = true;
        thirdLevel.secondElevatorWall.visible = true;
        setupElevatorScaleAnimation( thirdLevel.secondElevator, 
            { x: 1, y: 1 , z: 1}, 
            { x: 1, y: thirdLevel.mesh7.geometry.parameters.height - thirdLevel.mesh6.geometry.parameters.height, z: 1}, 
            2000, 500, TWEEN.Easing.Linear.None, 0.105);
    }

    //to detect when walter is inside the first door
    if (walter.body.position.y >= -22 && walter.body.position.y <= -20 && walter.body.position.x >= -44 &&
        walter.body.position.z >= -79.52810954507258 && walter.body.position.z <= -65.36362341232888 && !entered){
        entered = true;
        canMoveWalter = false;
        var dir = new THREE.Vector3(thirdLevel.mesh7.matrixWorld.getPosition().x,walter.body.position.y,walter.body.position.z);
        walter.body.lookAt(dir);
        translateWalterInDoor(-15);
    }


    //to detect when walter is on the button
    if (walter.body.position.z >= -113.27057509482057 && walter.body.position.z <= -102.2 && walter.body.position.x >= -10.281659658308996 &&
        walter.body.position.x <= -1.1699949609885358 && !buttonPressed){
        buttonPressed = true; 
        thirdLevel.leftRoad.visible = true;
        canMoveWalter = false
        walter.walkStop();
        translateYButton(thirdLevel.button, thirdLevel.buttonRoad.geometry.parameters.height/2 - thirdLevel.button.geometry.parameters.height/2 + 0.3);
        rotateYTowerTop(thirdLevel.leftTowerTop);
        translateXRoad(thirdLevel.leftRoad, thirdLevel.leftRoad.position.x-1.5);
        translateZRoad(thirdLevel.leftRoad, thirdLevel.leftRoad.position.z + thirdLevel.leftRoad.geometry.parameters.depth + 3);
        
        thirdLevel.rightRoad.visible = true;
        rotateYTowerTop(thirdLevel.rightTowerTop);
        translateXRoad(thirdLevel.rightRoad, thirdLevel.rightRoad.position.x - thirdLevel.rightTowerTop.geometry.parameters.width + 1.5);
        translateZRoad(thirdLevel.rightRoad, thirdLevel.rightRoad.position.z + thirdLevel.rightTowerTop.geometry.parameters.depth/2 - 6);
    }

    //to detect when walter entered the last door
    if (walter.body.position.x >= 117 && walter.body.position.y >= 45 && !completed){
        completed = true;
        canMoveWalter = false;
        clearModal();
        showModal("game completed", "restart");
    }
    
    TWEEN.update();
}


function renderThirdLevel() {
    renderer.render( scene, camera );
}


//CLICK EVENT
function mouseDown( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children, true );

    if(intersects.length > 0){

        if (intersects[1].object.id == thirdLevel.firstCarriage.id){
            thirdLevel.firstCarriage.updateMatrixWorld();  
            switch(translateFirstCarriage %2){
                case 0:
                        translateXFirstCarriage(intersects[1].object, 
                            -thirdLevel.mesh1.geometry.parameters.width/2 + thirdLevel.firstCarriage.geometry.parameters.width/2, -1);
                        translateFirstCarriage++;
                        break;
                case 1:
                        translateXFirstCarriage(intersects[1].object, 
                            +thirdLevel.mesh1.geometry.parameters.width/2 - thirdLevel.firstCarriage.geometry.parameters.width/2
                            -thirdLevel.mesh6.geometry.parameters.width, 1);
                        translateFirstCarriage++;
                        break;
            }
        }
        else if (intersects[1].object.id == thirdLevel.secondCarriage.id || intersects[2].object.id == thirdLevel.secondCarriage.id
             || intersects[3].object.id == thirdLevel.secondCarriage.id){
            var carriage;
            if(intersects[1].object.id == thirdLevel.secondCarriage.id)
                carriage = intersects[1].object;
            else if (intersects[2].object.id == thirdLevel.secondCarriage.id)
                carriage = intersects[2].object;
            else
                carriage = intersects[3].object;
            thirdLevel.secondCarriage.updateMatrixWorld();  
            switch(translateSecondCarriage %2){
                case 0:
                        translateXSecondCarriage(carriage, 
                            +thirdLevel.mesh1.geometry.parameters.width/2 - thirdLevel.secondCarriage.geometry.parameters.width/2
                            -thirdLevel.mesh7.geometry.parameters.width, 1);
                        translateSecondCarriage++;
                        break;
                case 1:
                        translateXSecondCarriage(carriage, 
                            -thirdLevel.mesh1.geometry.parameters.width/2 + thirdLevel.secondCarriage.geometry.parameters.width/2
                            +thirdLevel.mesh4.geometry.parameters.width  + thirdLevel.mesh5.geometry.parameters.width, -1);
                        translateSecondCarriage++;
                        break;
            }
        }
        else if (intersects[0].object.id == thirdLevel.movableElevator.id || intersects[1].object.id == thirdLevel.movableElevator.id
             || intersects[2].object.id == thirdLevel.movableElevator.id || intersects[3].object.id == thirdLevel.movableElevator.id){
            var elevator;
            if(intersects[0].object.id == thirdLevel.movableElevator.id)
                elevator = intersects[0].object;
            else if (intersects[1].object.id == thirdLevel.movableElevator.id)
                elevator = intersects[1].object;
            else if (intersects[2].object.id == thirdLevel.movableElevator.id)
                elevator = intersects[2].object
            else
                elevator = intersects[3].object;
            thirdLevel.movableElevator.updateMatrixWorld();
            switch(translateMovableElevator %3){
                case 0:
                        translateYMovableElevator(elevator, 
                            -thirdLevel.mesh5.geometry.parameters.height/2 + thirdLevel.movableElevator.geometry.parameters.height/2 + 19.4, 1);
                        translateMovableElevator++;
                        thirdLevel.frontWallLastFloor.visible = false;
                        break;
                case 1:
                        translateYMovableElevator(elevator, 
                            -thirdLevel.mesh5.geometry.parameters.height/2 + thirdLevel.movableElevator.geometry.parameters.height/2 + 19.4 + 5, 
                            1);
                        translateMovableElevator++;
                        break;
                case 2:
                        translateYMovableElevator(elevator, 
                            -thirdLevel.mesh5.geometry.parameters.height/2 + thirdLevel.movableElevator.geometry.parameters.height/2 -15.8, -1);
                        translateMovableElevator++;
                        thirdLevel.frontWallLastFloor.visible = true;
                        break;
            }
        }
    }
}


//########################################################TWEEEN####################################
function translateXRoad(object, destinationPoint) {
    new TWEEN.Tween(object.position)
    .to({x: destinationPoint}, 2000)
    .delay(1000)
    .onUpdate( function() {
              object.translateX(-0.075);
              })
    .start();
}

function translateZRoad(object, destinationPoint) {
    new TWEEN.Tween(object.position)
    .to({z: destinationPoint}, 2000)
    .delay(1000)
    .onUpdate( function() {
              object.translateZ(0.075);
              })
    .onComplete(function() {
        lastArch.visible = true;
        translateXArch(lastArch, 107.5);
    })
    .start();
}

function rotateYTowerTop( object){
    new TWEEN.Tween(object.rotation)
    .to({ y: 0}, 2000)
    .onComplete(function() {
        if (Math.abs(object.rotation.y)>=2*Math.PI) {
            object.rotation.y = object.rotation.y % (2*Math.PI);
        }
    })
    .start();
}

function translateXFirstCarriage(object, destinationPoint, direction) {
    new TWEEN.Tween(object.position)
    .to({x: destinationPoint}, 1000)
    .onUpdate( function() {
                object.translateX(0.075 * direction);
                var boundaryXLeft = thirdLevel.firstCarriage.matrixWorld.getPosition().x - thirdLevel.firstCarriage.geometry.parameters.width/2;
                var boundaryXRight = thirdLevel.firstCarriage.matrixWorld.getPosition().x + thirdLevel.firstCarriage.geometry.parameters.width/2;
                var boundaryZLeft = thirdLevel.firstCarriage.matrixWorld.getPosition().z - thirdLevel.firstCarriage.geometry.parameters.depth/2;
                var boundaryZRight = thirdLevel.firstCarriage.matrixWorld.getPosition().z + thirdLevel.firstCarriage.geometry.parameters.depth/2;
                if (walter.body.position.x >= boundaryXLeft && walter.body.position.x <= boundaryXRight &&
                    walter.body.position.z >= boundaryZLeft && walter.body.position.z <= boundaryZRight){
                    var dir;
                    if (direction > 0)
                        dir = new THREE.Vector3(thirdLevel.mesh6.matrixWorld.getPosition().x,walter.body.position.y,walter.body.position.z);
                    else
                        dir = new THREE.Vector3(thirdLevel.mesh3.matrixWorld.getPosition().x,walter.body.position.y,walter.body.position.z);
                    walter.body.lookAt(dir);
                    walter.body.translateZ(1.95);
                }
                if (direction < 0){
                    thirdLevel.leftWallMesh6.visible = true;
                    thirdLevel.rightWallFirstCarriage.visible = true;
                }
                else
                    thirdLevel.frontWallMesh4.visible = true;

              })
    .onComplete( function() {
                if (direction > 0) {
                    thirdLevel.rightWallFirstCarriage.visible = false;
                    thirdLevel.leftWallMesh6.visible = false;
                }
                else {
                    thirdLevel.frontWallMesh4.visible = false;
    }
    })
    .start();
}

function translateXSecondCarriage(object, destinationPoint, direction) {
    new TWEEN.Tween(object.position)
    .to({x: destinationPoint}, 1000)
    .onUpdate( function() {
            object.translateX(0.075 * direction);
            var boundaryXLeft = thirdLevel.secondCarriage.matrixWorld.getPosition().x - thirdLevel.secondCarriage.geometry.parameters.width/2;
            var boundaryXRight = thirdLevel.secondCarriage.matrixWorld.getPosition().x + thirdLevel.secondCarriage.geometry.parameters.width/2;
            var boundaryZLeft = thirdLevel.secondCarriage.matrixWorld.getPosition().z - thirdLevel.secondCarriage.geometry.parameters.depth/2;
            var boundaryZRight = thirdLevel.secondCarriage.matrixWorld.getPosition().z + thirdLevel.secondCarriage.geometry.parameters.depth/2;
            if (walter.body.position.x >= boundaryXLeft && walter.body.position.x <= boundaryXRight &&
                walter.body.position.z >= boundaryZLeft && walter.body.position.z <= boundaryZRight){
                var dir;
                if (direction>0)
                    dir = new THREE.Vector3(thirdLevel.mesh7.matrixWorld.getPosition().x,walter.body.position.y,walter.body.position.z);
                else
                    dir = new THREE.Vector3(thirdLevel.mesh5.matrixWorld.getPosition().x,walter.body.position.y,walter.body.position.z);
                walter.body.lookAt(dir);
                walter.body.translateZ(1.5);
            }
            if (direction < 0){
                thirdLevel.leftWallMesh7.visible = true;
                thirdLevel.rightWallSecondCarriage.visible = true;
            }
            else{
                thirdLevel.leftWallSecondCarriage.visible = true;
                thirdLevel.rightWallMesh5Car.visible = true;
            }
        })
    .onComplete( function() {
            if (direction > 0) {
                thirdLevel.leftWallMesh7.visible = false;
                thirdLevel.rightWallSecondCarriage.visible = false;
            }
            else{
                thirdLevel.leftWallSecondCarriage.visible = false;
                thirdLevel.rightWallMesh5Car.visible = false;
            }
            })
    .start();
}



function translateYMovableElevator(object, destinationPoint, direction) {
    new TWEEN.Tween(object.position)
    .to({y: destinationPoint}, 1000)
    //.delay(1000)
    .onUpdate( function() {
              object.translateY(0.075 * direction);
              var boundaryXLeft = thirdLevel.movableElevator.matrixWorld.getPosition().x - thirdLevel.movableElevator.geometry.parameters.width/2;
              var boundaryXRight = thirdLevel.movableElevator.matrixWorld.getPosition().x + thirdLevel.movableElevator.geometry.parameters.width/2;
              var boundaryZLeft = thirdLevel.movableElevator.matrixWorld.getPosition().z - thirdLevel.movableElevator.geometry.parameters.depth/2;
              var boundaryZRight = thirdLevel.movableElevator.matrixWorld.getPosition().z + thirdLevel.movableElevator.geometry.parameters.depth/2;
              
              if (walter.body.position.x >= boundaryXLeft && walter.body.position.x <= boundaryXRight &&
                  walter.body.position.z >= boundaryZLeft && walter.body.position.z <= boundaryZRight) {
                if (translateMovableElevator%3 == 0){
                    walter.body.translateY(-0.65);
                    thirdLevel.rightWallMovableElevator.visible = true;
                    thirdLevel.backWallMovableElevator.scale.x = 1/2;
                }
                else if (translateMovableElevator%3 == 1){
                    walter.body.translateY(0.59);
                    thirdLevel.rightWallMovableElevator.visible = true;
                    thirdLevel.backWallMovableElevator.visible = true;
                    thirdLevel.backWallMovableElevator.scale.x = 1/2;
                    thirdLevel.backWallMovableElevator.position.x = - thirdLevel.movableElevator.geometry.parameters.width/2+thirdLevel.backWallMovableElevator.geometry.parameters.width/4;
                }
                else if (translateMovableElevator%3 == 2){
                    walter.body.translateY(0.075);
                }
              }
            if(translateMovableElevator%3 == 0)
                thirdLevel.rightWallMovableElevator.visible = true;
            else if(translateMovableElevator%3 == 1){
                thirdLevel.backWallMovableElevator.visible = true;
                thirdLevel.backWallMovableElevator.scale.x = 1/2;
                thirdLevel.backWallMovableElevator.position.x = - thirdLevel.movableElevator.geometry.parameters.width/2+thirdLevel.backWallMovableElevator.geometry.parameters.width/4;
              }
            else if (translateMovableElevator%3 == 2){
                thirdLevel.backWallMovableElevator.visible = true;
                thirdLevel.backWallMovableElevator.scale.x = 2;
            }

        })
    .onComplete( function() {
        if (translateMovableElevator%3 == 2 && towerRotated)
            thirdLevel.rightWallMovableElevator.visible = false;
        if(translateMovableElevator%3 == 0)
            thirdLevel.backWallMovableElevator.visible = false;
        })
    .start();
}

function setupElevatorScaleAnimation( object, source, target, duration, delay, easing , speed ){
    var l_delay = ( delay !== undefined ) ? delay : 0;
    var l_easing = ( easing !== undefined ) ? easing : TWEEN.Easing.Linear.None;

    new TWEEN.Tween( source )
        .to( target, duration )
        .delay( l_delay )
        .easing( l_easing )
        .onUpdate( function() { 
                    object.scale.copy( source ); 
                    object.translateY(speed);
                    walter.onElevator(speed*2);})
        .onComplete( function() {
            canMoveWalter = true;
        })
        .start();
}

function translateWalterInDoor(destinationPoint){
    new TWEEN.Tween(walter.body.position)
    .to({x: destinationPoint}, 500)
    .onUpdate( function() {
            walter.walkForward();
            })
    .onComplete( function() {
            //walter.body.translateY(30);
            walter.body.position.y = 9.5;
            var dir = new THREE.Vector3(thirdLevel.mesh5.matrixWorld.getPosition().x,walter.body.position.y,walter.body.position.z);
            walter.body.lookAt(dir);
            translateWalterOutDoor(-23);
        })
    .start();
}

function translateWalterOutDoor(destinationPoint){
    new TWEEN.Tween(walter.body.position)
    .to({x: destinationPoint}, 500)
    .onUpdate( function() {
            walter.walkForward();
            })
    .onComplete( function() {
        canMoveWalter = true;
        thirdLevel.leftWallSecondArch.visible = true;
        })
    .start();
}

function translateYButton(object, destinationPoint) {
    new TWEEN.Tween(object.position)
    .to({y: destinationPoint}, 2000)
    .onUpdate( function() {
              object.translateY(-0.075);
              })
    .start();
}

function translateXArch(object, destinationPoint) {
    new TWEEN.Tween(object.position)
    .to({x: destinationPoint}, 2000)
    .onUpdate( function() {
            object.position.z= -42;
            object.translateX(0.075);
              })
    .onComplete(function() {
        towerRotated = true;
        canMoveWalter = true;
    })
    .start();
}

//########################################### MODEL LOADERS ##########################################
function createArch(x, y, z, angle, scale, last){
    var onProgress = function ( xhr ) {

        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% arch downloaded' );
        }
     };

    var onError = function ( xhr ) { };

    //arch material
    var textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load('images/wall.jpg');
    var archMaterial = new THREE.MeshPhongMaterial({ map: map });
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(2 , 2);

    new THREE.OBJLoader()
        .setPath( 'models/arch/' )
        .load( 'arch.obj', function ( object ) {
            object.traverse( function ( node ) {
                if ( node.isMesh ) node.material = archMaterial;
                });

            object.scale.x = scale;
            object.scale.y = scale;
            object.scale.z = 2*scale;
            object.position.x = x;
            object.position.y = y;
            object.position.z = z;
            object.rotateY(angle);
            if(last){
                lastArch = object;
                lastArch.visible = false;
            }
            scene.add( object );

        }, onProgress, onError );
    }

function createMoon(){
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% moon downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    new THREE.MTLLoader()
        .setPath( 'models/moon/' )
        .load( 'moon.mtl', function ( materials ) {

            materials.preload();

            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( 'models/moon/' )
                .load( 'moon.obj', function ( object ) {

                    object.position.x = 190;
                    object.position.y = 80;
                    object.position.z = 60;
                    object.scale.x = 0.12;
                    object.scale.y = 0.12;
                    object.scale.z = 0.12;
                    //object.rotateY(Math.PI/2);

                    scene.add( object );

                }, onProgress, onError );
        } );
}

function createEarth(){
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '% earth downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    new THREE.MTLLoader()
        .setPath( 'models/earth/' )
        .load( 'earth.mtl', function ( materials ) {

            materials.preload();

            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( 'models/earth/' )
                .load( 'earth.obj', function ( object ) {

                    object.position.x = 190;
                    object.position.y = 80;
                    object.position.z = 60;
                    object.scale.x = 15;
                    object.scale.y = 15;
                    object.scale.z = 15;
                    //object.rotateY(Math.PI/2);

                    scene.add( object );

                }, onProgress, onError );
        } );
}

function createSaturn(){
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round( percentComplete, 2 ) + '%  saturn downloaded' );
        }
    };

    var onError = function ( xhr ) { };

    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    new THREE.MTLLoader()
        .setPath( 'models/saturn/' )
        .load( 'saturn.mtl', function ( materials ) {

            materials.preload();

            new THREE.OBJLoader()
                .setMaterials( materials )
                .setPath( 'models/saturn/' )
                .load( 'saturn.obj', function ( object ) {

                    object.position.x = -80;
                    object.position.y = 50;
                    object.position.z = -300;
                    object.scale.x = 0.1;
                    object.scale.y = 0.1;
                    object.scale.z = 0.1;
                    object.rotateX(Math.PI/2);

                    scene.add( object );

                }, onProgress, onError );
        } );
}

//########################################### TEXTURE ##########################################
function createMeshWithTexture(geometry){
    var texture1 = new THREE.TextureLoader().load( "images/wall.jpg" );
    var textureMaterial1 = new THREE.MeshPhongMaterial( { map: texture1} );
    
    var texture2 = new THREE.TextureLoader().load( "images/wall.jpg" );
    var textureMaterial2 = new THREE.MeshPhongMaterial( { map: texture2} );
    
    var texture3 = new THREE.TextureLoader().load( "images/wall.jpg" );
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
    var texture1 = new THREE.TextureLoader().load( "images/roof.jpg" );
    var textureMaterial1 = new THREE.MeshPhongMaterial( { map: texture1} );
    
    var texture2 = new THREE.TextureLoader().load( "images/roof.jpg" );
    var textureMaterial2 = new THREE.MeshPhongMaterial( { map: texture2} );
    
    var texture3 = new THREE.TextureLoader().load( "images/roof.jpg" );
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

function createMovablesWithTexture(geometry){
    var texture1 = new THREE.TextureLoader().load( "images/wood2.jpeg" );
    var textureMaterial1 = new THREE.MeshPhongMaterial( { map: texture1} );
    
    var texture2 = new THREE.TextureLoader().load( "images/wood2.jpeg" );
    var textureMaterial2 = new THREE.MeshPhongMaterial( { map: texture2} );
    
    var texture3 = new THREE.TextureLoader().load( "images/wood2.jpeg" );
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

//PASS TO FIRST LEVEL
function goToFirstLevel(){
    document.getElementById('myModal').style.display = "none";
    document.getElementById('myOverlay').style.display = "none";
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    document.removeEventListener('mousedown', mouseDown, false);
    document.getElementById("next").removeEventListener('click', goToFirstLevel, false);
    cancelAnimationFrame(frameID);
    renderer.render( scene, camera );
    initFirstLevel(scene, renderer);
    createFirstLevel();
    animateFirstLevel();
}
