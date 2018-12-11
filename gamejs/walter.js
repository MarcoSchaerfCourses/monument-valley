var camera, scene, renderer, controls;
var world, walter;
var scale=0.02;
var hemiLight, dirLight, backLight, isUp, frrrr, isMove;

var keyboard = new THREEx.KeyboardState();

var ahead = -1;


export function createWalter(scena){
    walter = new Walter();
    scena.add(walter.threegroup);
    return walter;
}


function Walter() {

    this.threegroup = new THREE.Group();

    this.informalSmokingMat = "#ffc107";
    this.informalLegsMMat = "#755b0b";
    this.informalZipperMat = "#755b0b";
    this.informalShoesMat = "#907637";

    this.formalSmokingMat = "#333";
    this.formalLegsMMat = "#222";
    this.formalZipperMat = "white";
    this.formalShoesMat = "#585858";


    this.hatMat = new THREE.MeshLambertMaterial({
        color: "#333",
        shading: THREE.FlatShading,
    });

    this.skinMat = new THREE.MeshLambertMaterial({
        color: "#e0bea5",
        shading: THREE.FlatShading,
    });

    this.pupilaMat = new THREE.MeshLambertMaterial({
        color: "#333",
        shading: THREE.FlatShading,
    });

    this.lipMat = new THREE.MeshLambertMaterial({
        color: "#333",
        shading: THREE.FlatShading,
    });

    this.eyeMat = new THREE.MeshLambertMaterial({
        color: "white",
        shading: THREE.FlatShading
    });

    this.bearMat = new THREE.MeshLambertMaterial({
        color: "#bb7344",
        shading: THREE.FlatShading
    });

    this.zipperMat = new THREE.MeshLambertMaterial({
        color: this.formalZipperMat,
        shading: THREE.FlatShading
    });

    this.smokingMat = new THREE.MeshLambertMaterial({
        color: this.formalSmokingMat,
        shading: THREE.FlatShading
    });

    this.legsMMat = new THREE.MeshLambertMaterial({
        color: this.formalLegsMMat,
        shading: THREE.FlatShading
    });

    this.shoesMat = new THREE.MeshLambertMaterial({
        color: this.formalShoesMat,
        shading: THREE.FlatShading
    });


    //head
    var head = new THREE.BoxGeometry(300*scale, 230*scale , 280*scale);
    this.head = new THREE.Mesh(head, this.skinMat);
    
    //glasses
    var glass = new THREE.BoxGeometry(120*scale, 78*scale, 10*scale);
    this.glassLeft = new THREE.Mesh(glass, this.eyeMat);
    this.glassRight = new THREE.Mesh(glass, this.eyeMat);


    //glass middle
    var glassu = new THREE.BoxGeometry(30*scale, 10*scale, 10*scale);
    this.glassu = new THREE.Mesh(glassu, this.pupilaMat);

    //Retinas
    var retina = new THREE.BoxGeometry(25*scale, 25*scale, 5*scale);
    this.retinaLeft = new THREE.Mesh(retina, this.pupilaMat);
    this.retinaRight = new THREE.Mesh(retina, this.pupilaMat);

    //beard
    var beard = new THREE.BoxGeometry(140*scale, 130*scale, 10*scale);
    this.beard = new THREE.Mesh(beard, this.bearMat);

    //mout
    var mout = new THREE.BoxGeometry(90*scale, 60*scale, 20*scale);
    this.mout = new THREE.Mesh(mout, this.skinMat);

    //lip
    var lip = new THREE.BoxGeometry(40*scale, 20*scale, 10*scale);
    this.lip = new THREE.Mesh(lip, this.lipMat);

    //Hat
    var hatTop = new THREE.BoxGeometry(320*scale, 120*scale, 290*scale);
    this.hatTop = new THREE.Mesh(hatTop, this.hatMat);
    
    var hatBottom = new THREE.BoxGeometry(400*scale, 40*scale, 380*scale);
    this.hatBottom = new THREE.Mesh(hatBottom, this.hatMat);

    //body
    var body = new THREE.BoxGeometry(300*scale, 250*scale, 220*scale);
    this.body = new THREE.Mesh(body, this.smokingMat);

    //arms
    var arm = new THREE.BoxGeometry(50*scale, 250*scale, 100*scale);
    this.armLeft = new THREE.Mesh(arm, this.smokingMat);
    this.armRight = new THREE.Mesh(arm, this.smokingMat);

    //shoulder
    var circleRadius = 50 * scale;
    var circleShape = new THREE.Shape();
    circleShape.moveTo( 0, circleRadius );
    circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
    circleShape.quadraticCurveTo( circleRadius, - circleRadius, 0, - circleRadius );
    circleShape.quadraticCurveTo( - circleRadius, - circleRadius, - circleRadius, 0 );
    circleShape.quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );
    var circleDepth = 50*scale;
    var extrudeSettings = { depth: circleDepth, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    var geometrys = new THREE.ExtrudeBufferGeometry( circleShape, extrudeSettings );
    this.shoulderLeft = new THREE.Mesh (geometrys, this.smokingMat);
    this.shoulderRight = new THREE.Mesh (geometrys, this.smokingMat);

    // hands
    var hand = new THREE.BoxGeometry(50*scale, 50*scale, 50*scale);
    this.handLeft = new THREE.Mesh(hand, this.skinMat);
    this.handRight = new THREE.Mesh(hand, this.skinMat);

    //zipper
    var zipper = new THREE.BoxGeometry(80*scale, 250*scale, 10*scale);
    this.zipper = new THREE.Mesh(zipper, this.zipperMat);

    //legs
    var leg = new THREE.BoxGeometry(100*scale, 150*scale, 120*scale);
    this.legRightUpper = new THREE.Mesh(leg, this.smokingMat);
    this.legLeftUpper = new THREE.Mesh(leg, this.smokingMat);
    this.legRightLower = new THREE.Mesh(leg, this.smokingMat);
    this.legLeftLower = new THREE.Mesh(leg, this.smokingMat);

    //shoes
    var shoes = new THREE.BoxGeometry(100*scale, 50*scale, 200*scale);
    this.shoeRight = new THREE.Mesh(shoes, this.shoesMat);
    this.shoeLeft = new THREE.Mesh(shoes, this.shoesMat);

    //POSITIONS
    this.head.position.y = this.body.geometry.parameters.height/2 + this.head.geometry.parameters.height/2 + (50*scale);

    this.shoulderLeft.position.x = - (this.body.geometry.parameters.width/2 + circleDepth + (10*scale));
    this.shoulderRight.position.x = this.body.geometry.parameters.width/2 +(10*scale);
    this.shoulderLeft.position.y = this.body.geometry.parameters.height/2 - circleRadius;
    this.shoulderRight.position.y = this.body.geometry.parameters.height/2 - circleRadius;
    this.shoulderLeft.rotateY(Math.PI/2);
    this.shoulderRight.rotateY(Math.PI/2);
    this.armLeft.rotateY(Math.PI/2);
    this.armRight.rotateY(Math.PI/2);

    this.armLeft.position.y = - this.armLeft.geometry.parameters.height/2;
    this.armRight.position.y = - this.armLeft.geometry.parameters.height/2;
    this.armLeft.position.z = circleDepth/2;
    this.armRight.position.z = circleDepth/2;
   
    this.handLeft.position.y = - (this.armLeft.geometry.parameters.height/2 + this.handLeft.geometry.parameters.height/2);
    this.handRight.position.y = - (this.armLeft.geometry.parameters.height/2 + this.handLeft.geometry.parameters.height/2);
    
    this.legLeftUpper.position.x = - this.body.geometry.parameters.width/4;
    this.legRightUpper.position.x = this.body.geometry.parameters.width/4;
    this.legLeftUpper.position.y = - (this.body.geometry.parameters.height/2 + this.legLeftUpper.geometry.parameters.height/2 - (50*scale));
    this.legRightUpper.position.y = - (this.body.geometry.parameters.height/2 + this.legLeftUpper.geometry.parameters.height/2 - (50*scale));
    this.legLeftLower.position.y = - (this.legLeftUpper.geometry.parameters.height/2 + this.legLeftLower.geometry.parameters.height/2);
    this.legRightLower.position.y = - (this.legLeftUpper.geometry.parameters.height/2 + this.legLeftLower.geometry.parameters.height/2);

    this.shoeLeft.position.y = - (this.legLeftLower.geometry.parameters.height/2 + this.shoeLeft.geometry.parameters.height/2);
    this.shoeRight.position.y = - (this.legRightLower.geometry.parameters.height/2 + this.shoeRight.geometry.parameters.height/2);
    this.shoeLeft.position.z = this.shoeLeft.geometry.parameters.depth/2 - this.legLeftLower.geometry.parameters.depth/2;
    this.shoeRight.position.z = this.shoeLeft.geometry.parameters.depth/2 - this.legLeftLower.geometry.parameters.depth/2;

    this.zipper.position.z = this.body.geometry.parameters.depth/2 + this.zipper.geometry.parameters.depth/2;

    this.hatBottom.position.y = this.head.geometry.parameters.height/2 + this.hatBottom.geometry.parameters.height/2;
    this.hatTop.position.y = this.hatBottom.geometry.parameters.height/2 + this.hatTop.geometry.parameters.height/2;

    this.glassLeft.position.x = -this.head.geometry.parameters.width/4;
    this.glassLeft.position.y = this.head.geometry.parameters.height/4;
    this.glassLeft.position.z = this.head.geometry.parameters.depth/2 + this.glassLeft.geometry.parameters.depth/2;
    this.glassRight.position.x = this.head.geometry.parameters.width/4;
    this.glassRight.position.y = this.head.geometry.parameters.height/4;
    this.glassRight.position.z = this.head.geometry.parameters.depth/2 + this.glassLeft.geometry.parameters.depth/2;
    this.glassu.position.y = this.head.geometry.parameters.height/4;
    this.glassu.position.z = this.head.geometry.parameters.depth/2 + this.glassu.geometry.parameters.depth/2;

    this.retinaLeft.position.z = this.glassLeft.geometry.parameters.depth/2 + this.retinaLeft.geometry.parameters.depth/2;
    this.retinaRight.position.z = this.glassLeft.geometry.parameters.depth/2 + this.retinaLeft.geometry.parameters.depth/2;

    this.beard.position.y = -this.head.geometry.parameters.height/3;
    this.beard.position.z = this.head.geometry.parameters.depth/2 + this.beard.geometry.parameters.depth/2;

    this.mout.position.y = this.beard.geometry.parameters.height/7;
    this.mout.position.z = this.beard.geometry.parameters.depth/2 + this.mout.geometry.parameters.depth/2;

    this.lip.position.z = this.mout.geometry.parameters.depth/2 + this.lip.geometry.parameters.depth/2;

    // group elements

    this.head.add(this.hatBottom);
    this.head.add(this.glassu);
    this.head.add(this.glassLeft);
    this.head.add(this.glassRight);
    this.head.add(this.beard);

    this.hatBottom.add(this.hatTop);

    this.shoulderLeft.add(this.armLeft);
    this.shoulderRight.add(this.armRight);

    this.armLeft.add(this.handLeft);
    this.armRight.add(this.handRight);

    this.legLeftUpper.add(this.legLeftLower);
    this.legRightUpper.add(this.legRightLower);

    this.legLeftLower.add(this.shoeLeft);
    this.legRightLower.add(this.shoeRight);

    this.glassLeft.add(this.retinaLeft);
    this.glassRight.add(this.retinaRight);

    this.beard.add(this.mout);

    this.mout.add(this.lip);

    this.body.add(this.shoulderLeft);
    this.body.add(this.shoulderRight);
    this.body.add(this.zipper);
    this.body.add(this.legLeftUpper);
    this.body.add(this.legRightUpper);
    this.body.add(this.head);

    this.threegroup.add(this.body);

    this.scale = function(s){
        this.body.scale.set(s,s,s);
    }

    this.walkForward = function(){
        this.body.translateZ(  20*scale );
        if (this.legLeftUpper.rotation.x < -0.7)
            ahead = 1;
        else if (this.legLeftUpper.rotation.x > 0.7)
            ahead = -1;
   
        this.legLeftUpper.rotateX(0.05 * ahead);
        this.legRightUpper.rotateX(- 0.05 * ahead);
        this.shoulderLeft.rotateZ(- 0.05 * ahead);
        this.shoulderRight.rotateZ(0.05 * ahead);

        this.retinaLeft.rotateZ(0.1);
        this.retinaRight.rotateZ(-0.1);
        this.handLeft.rotateY(0.1);
        this.handRight.rotateY(-0.1);

        this.head.rotateX(0.004 * ahead);
        this.body.translateY(1 * scale * ahead);
    }

    this.walkStop = function(){
        this.retinaLeft.rotation.z = 0;
        this.retinaRight.rotation.z = 0;
        this.handLeft.rotation.y = 0;
        this.handRight.rotation.y = 0;
        this.legLeftUpper.rotation.x = 0;
        this.legRightUpper.rotation.x = 0;
        this.shoulderLeft.rotation.x = 0;
        this.shoulderRight.rotation.x = 0;
        this.head.rotation.x = 0;
    }

    this.rotateLeft = function(){
        this.body.rotateY(0.1);
    }

    this.rotateRight = function(){
        this.body.rotateY(-0.1);
    }
    
    this.onElevator = function(x){
        this.body.translateY(x);
    }
}