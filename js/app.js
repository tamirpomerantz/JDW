var camera, scene, light, renderer, raycaster, mouse, controls;
var exportButton, floatingDiv;
var mouseX = 0,
    mouseY = 0;
// var isMobile = false;
var screenWidth = window.screen.width;
var screenHeight = window.screen.height;
var windowWidth = window.screen.width;
var windowHeight = window.screen.height;
var rotationSpeed = 0.1;
var BoxesNumber = 13;
var mouseMoveInterval = 350; // This is for the "jumping" animation. 
var mouseRelations = []; // Arr to keep distance from mouse pointer.

var borderWidth = 70;
var percentOfScreenX = 1;
var percentOfScreenY = 0.8;


var PosArr = [];
PosArr = [
    [90, 36, 0],
    [0, 66, 0],
    [68, 90, 0],
    [19, 25, 100],
    [18, 89, 0],
    [62, 58, 0],
    [88, 83, 100],
    [40, 19, 200],
    [20, 48, 0],
    [0, 0, 0],
    [70, 19, 0],
    [42, 97, 100],
    [100, 100, 0]
];


// Random positions of rocks

// for (j=0;j<BoxesNumber;j++)
// {
//     let tmpX = Math.floor((Math.random() * 100));
//     let tmpY = Math.floor((Math.random() * 100));
//     let tmpZ = Math.floor((Math.random() * 100)-50);
// PosArr.push([tmpX,tmpY,tmpZ]);
// console.log('['+tmpX+','+tmpY+','+tmpZ+',],');
// }


// Detect mobile
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 640) {
    var isMobile = true;
}

// Creation of texture materials
var txtArr = [
    'img/t2.jpg',
    'img/t3.jpg',
    'img/t4.jpg',
    'img/t5.jpg',
    'img/t6.jpg',
    'img/t7.jpg',
    'img/t8.jpg',
    'img/t9.jpg',
    'img/t2.jpg',
    'img/t3.jpg',
    'img/t4.jpg',
    'img/t5.jpg'
];

var TZAtxtArr = ['img/check5.jpg', 'img/check6.jpg', 'img/check1.jpg', 'img/check2.jpg', 'img/check3.jpg', 'img/check4.jpg'];
var TZAMaterial = [];
var TXTMaterial = [];
var TXTMaterialScale2 = [];


for (let i = 0; i < TZAtxtArr.length; i++) {
    let TZATexture = new THREE.TextureLoader().load(TZAtxtArr[i],);
    TZATexture.anisotropy = 4;
    TZATexture.repeat.set(1, 1);
    TZATexture.offset.set(0.001, 0.001);
    TZATexture.wrapS = TZATexture.wrapT = THREE.RepeatWrapping;
    TZATexture.format = TZATexture.RGBFormat;
    TZAMaterial[i] = new THREE.MeshPhongMaterial({
        map: TZATexture,
        specular: 0x222222,
        shininess: 20,
        bumpMap: TZATexture,
        bumpScale: 2
    })
}


// Floating box textures

var TXTBoxSideMaterial = [];
var TXTBoxSQMaterial = [];
var txtBoxSideArr = ['img/BOX-SIDE-01.jpg', 'img/BOX-SIDE-02.jpg', 'img/BOX-SIDE-03.jpg'];



    // for (let i = 0; i < txtArr.length; i++) {


    //     var loader = new THREE.TextureLoader();
    //     loader.load(txtArr[i],
    //         function (texture) {
    //             // all loaded
    //             loaderCount++;
    //             console.log('loaded ' + txtArr[i])
                

    //             if (loaderCount == txtArr.length) {
    //                 EnterAnimation();
    //                 console.log(TXTMaterial);
    //             }



    //         });
    // }



////////// promise code
var allPromises = [];
 var loader = new THREE.TextureLoader();
txtArr.forEach( function( txtArrURL ) {

    allPromises.push( new Promise( function( resolve, reject ) {

        loader.load(
           txtArrURL,

           function( texture ) {
               // Success callback of TextureLoader
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set(0, 0);
                texture.repeat.set(1, 1);
                material = new THREE.MeshBasicMaterial({
                    map: texture,
                    overdraw: true
                });
               TXTMaterial.push( material );

               // We're done, so tell the promise it is complete
               resolve( material );
           },

           function( xhr ) {
               // Progress callback of TextureLoader
               // ...
           },

           function( xhr ) {
               // Failure callback of TextureLoader
               // Reject the promise with the failure
               reject( new Error( 'Could not load ') );
           }
        );

    }));

});

Promise.all( allPromises )
    .then( function( arrayOfMaterials ) {
       let time = 0;
init();
animate();
       console.log(TXTMaterial);

    }, function( error ) {
        console.error( "Could not load all textures:", error );
    });
///////// end of promise code



for (let i = 0; i < txtBoxSideArr.length; i++) {
    // Box side
    let textureBoxSideArr = new THREE.TextureLoader().load(txtBoxSideArr[i]);
    textureBoxSideArr.wrapS = textureBoxSideArr.wrapT = THREE.RepeatWrapping;
    textureBoxSideArr.repeat.set(1, 0.666666);
    textureBoxSideArr.offset.set(0, 0.33333);
    TXTBoxSideMaterial[i] = new THREE.MeshBasicMaterial({
        map: textureBoxSideArr,
        overdraw: true
    });
    // Box square
    let textureBoxSQ = new THREE.TextureLoader().load(txtBoxSideArr[i]);
    textureBoxSQ.wrapS = textureBoxSQ.wrapT = THREE.RepeatWrapping;
    textureBoxSQ.repeat.set(1, 0.333);
    textureBoxSQ.offset.set(0, 0);
    TXTBoxSQMaterial[i] = new THREE.MeshBasicMaterial({
        map: textureBoxSQ,
        overdraw: true
    });
}



function createMaterialBox(j) {
    var materials = [
        TZAMaterial[j],
        TXTBoxSideMaterial[j],
        TXTBoxSQMaterial[j]
    ];
    return materials;
}


function createMaterialsMobile() {


    var newTZATexture = new THREE.TextureLoader().load('img/check1.jpg');
    newTZATexture.anisotropy = 4;
    newTZATexture.repeat.set(0.5, 2);
    newTZATexture.offset.set(0.001, 0.001);
    newTZATexture.wrapS = newTZATexture.wrapT = THREE.RepeatWrapping;
    newTZATexture.format = newTZATexture.RGBFormat;

    var newTZATextureMap = new THREE.TextureLoader().load('img/check1.jpg');
    newTZATextureMap.repeat.set(0.5, 2);
    newTZATextureMap.offset.set(0.001, 0.001);
    newTZATextureMap.wrapS = newTZATextureMap.wrapT = THREE.RepeatWrapping;


    var boxColorTxtStripe = new THREE.TextureLoader().load('img/BOX-02.jpg');
    boxColorTxtStripe.repeat.set(1, 1);
    boxColorTxtStripe.offset.set(0.001, 0.001);
    boxColorTxtStripe.wrapS = boxColorTxtStripe.wrapT = THREE.RepeatWrapping;



    var boxColorTxtSquare = new THREE.TextureLoader().load('img/box-1.jpg');
    boxColorTxtSquare.repeat.set(1, 1);
    boxColorTxtSquare.offset.set(0.001, 0.001);
    boxColorTxtSquare.wrapS = boxColorTxtSquare.wrapT = THREE.RepeatWrapping;




    var materials = [
        new THREE.MeshBasicMaterial({
            map: boxColorTxtStripe,
            overdraw: true
        }),
        new THREE.MeshBasicMaterial({
            map: boxColorTxtStripe,
            overdraw: true
        }), new THREE.MeshBasicMaterial({
            map: boxColorTxtSquare,
            overdraw: true
        }), new THREE.MeshBasicMaterial({
            map: boxColorTxtSquare,
            overdraw: true
        }), new THREE.MeshPhongMaterial({
            map: newTZATextureMap,
            specular: 0x222222,
            shininess: 25,
            bumpMap: newTZATexture,
            bumpScale: 2
        }), new THREE.MeshPhongMaterial({
            map: newTZATextureMap,
            specular: 0x222222,
            shininess: 25,
            bumpMap: newTZATexture,
            bumpScale: 1
        })

    ];
    return materials;
}

var boxArr = [];

var meshArr = [];
var maxSize = 90;
var minSize = 70;
var boxWidth, boxHeight, boxDepth;

var tmpCylinder;
var tmpSphere;

var cylcount = 0
var camDist = 1500;

if (isMobile)
    camDist = 500;

var loaderCount = 0;

function init() {

    raycaster = new THREE.Raycaster(); // create once
    mouse = new THREE.Vector2(); // create once

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.id = 'three-js-canvas';
    // app
    document.getElementsByClassName("app")[0].appendChild(renderer.domElement);
    // document.body
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1600);
    camera.position.set(0, 0, camDist);

    scene = new THREE.Scene();
    light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
    var tmpCylinderGeo, tmpCylinderBsp;


    if (isMobile) {

        let globalBaflaTilt = -25 * (Math.PI / 180);
        for (j = 0; j < 3; j++) {
            boxArr[j] = new THREE.BoxBufferGeometry(40, 170, 50);
            meshArr[j] = new THREE.Mesh(boxArr[j], createMaterialsMobile());
            meshArr[j].position.z = (j * 60) - 60;
            meshArr[j].position.y = -((j * 30) - 30);
            meshArr[j].rotation.z = j * -78 * (Math.PI / 180); // bafla circular rotation
            meshArr[j].rotation.x = globalBaflaTilt;
            meshArr[j].rotation.y = Math.floor((Math.random() * (6))) * (Math.PI / 180); // small <10 distortions in y rotation
            if (j == 2)
                meshArr[j].rotation.x = -6 * (Math.PI / 180);



            scene.add(meshArr[j]);
            if (true) { // TODO: check if device orientation 
                // camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 200, 1000);
                controls = new THREE.DeviceOrientationControls(scene);

            }
        }


    } else {
        for (j = 0; j < BoxesNumber; j++) {

            boxWidth = Math.floor((Math.random() * (maxSize - minSize)) + minSize)
            boxHeight = 200;
            cylBase = Math.floor((Math.random() * (maxSize / 1.5 - minSize / 1.5)) + minSize / 1.5)



            if (j == 's') { // create box
                // Cylinder 1
                let tmpCylinder = new THREE.CylinderGeometry((boxWidth / 1.3), (boxWidth / 1.3) * 1, boxHeight, 4);
                let tmpCylinder2 = new THREE.CylinderGeometry((boxWidth / 1.3), (boxWidth / 1.3) * 1, boxHeight, 4);

                let currTexture = TZAMaterial[Math.floor(Math.random() * 4)];
                tmpCylinder.materials = [TXTMaterial[j], TXTMaterial[j], currTexture];
                tmpCylinder2.materials = [TXTMaterial[2], TXTMaterial[j], currTexture];

                for (m = 0; m < tmpCylinder.faces.length; m++) {
                    if (m == 0 || m == 1 || m == 4 || m == 5) {
                        tmpCylinder.faces[m].materialIndex = 0; // side 2
                        tmpCylinder2.faces[m].materialIndex = 0; // side 2
                    } else if (m == 2 || m == 3 || m == 6 || m == 7) {
                        tmpCylinder.faces[m].materialIndex = 2; // side 1 
                        tmpCylinder2.faces[m].materialIndex = 2; // side 1 
                    } else {
                        tmpCylinder.faces[m].materialIndex = 1; // edge squaer
                        tmpCylinder2.faces[m].materialIndex = 1; // edge squaer

                    }
                }



                // console.log(result.faces.length);

                let group = new THREE.Object3D(); //create an empty container

                let tmpmesh = new THREE.Mesh(tmpCylinder, tmpCylinder.materials);
                let tmpmesh2 = new THREE.Mesh(tmpCylinder2, tmpCylinder2.materials);

                tmpmesh.scale.y = 1.5;
                tmpmesh2.position.x = (boxWidth / 1.3) * 1.5;
                tmpmesh2.position.z = (boxWidth / 1.3) * 1.5;
                // tmpmesh2.rotation.y = -80 * (Math.PI / 180);

                if (j == 1) {
                    tmpmesh.rotation.z = 90 * (Math.PI / 180);
                    tmpmesh.rotation.x = 90 * (Math.PI / 180);
                    tmpmesh.rotation.y = 45 * (Math.PI / 180);
                }

                if (j == 2) {
                    tmpmesh.rotation.z = 90 * (Math.PI / 180);
                    tmpmesh.rotation.x = 0 * (Math.PI / 180);
                    tmpmesh.rotation.y = 45 * (Math.PI / 180);
                }



                group.add(tmpmesh); //add a mesh with geometry to it
                group.add(tmpmesh2); //add a mesh with geometry to it

                meshArr[j] = group;



            } else if (j == 0 || j == 1 || j == 2 || j == 3 || j == 4 || j == 6 || j == 8 || j == 10) { // create triangle cylincer
                tmpCylinder = new THREE.CylinderGeometry(cylBase, cylBase, boxHeight * 2, 4);
                tmpCylinder.materials = [TXTMaterial[j], TZAMaterial[Math.floor(Math.random() * TZAMaterial.length)]];
                tmpCylinderBsp = new ThreeBSP(tmpCylinder);

                // console.log(result.faces.length);


                //cube 1 - to cut cilynder
                var sphere_geometry = new THREE.CubeGeometry(1000, boxHeight, 1000);
                var cube1 = new THREE.Mesh(sphere_geometry);
                cube1.position.y = boxHeight;
                cube1.rotation.z = Math.random();
                var cube1_bsp = new ThreeBSP(cube1);

                //cube 2 - to cut cilynder
                var cube2 = new THREE.Mesh(sphere_geometry);
                cube2.position.y = (boxHeight) * -1;
                cube2.rotation.z = -Math.random();
                var cube2_bsp = new ThreeBSP(cube2);

                //cube 3 - to cut cilynder
                var cube3 = new THREE.Mesh(sphere_geometry);
                cube3.position.y = (boxHeight) * -0.9;
                cube3.rotation.z = 0
                var cube3_bsp = new ThreeBSP(cube3);

                //cube 3 - to cut cilynder
                var cube4 = new THREE.Mesh(sphere_geometry);
                cube4.position.y = (boxHeight) * 0.9;
                cube4.rotation.z = 0
                var cube4_bsp = new ThreeBSP(cube4);

                //substract cube from cylinder
                var subtract_bsp = tmpCylinderBsp.subtract(cube2_bsp.union(cube1_bsp.union(cube3_bsp.union(cube4_bsp))));
                var result = subtract_bsp.toGeometry();




                result.materials = [TXTMaterial[Math.floor(Math.random() * 4)], TZAMaterial[Math.floor(Math.random() * TZAMaterial.length)]];
                for (m = 0; m < result.faces.length; m++) {
                    if (m < 12) {
                        result.faces[m].materialIndex = 1; // material - map

                    } else {
                        result.faces[m].materialIndex = 0; // material - color pattern
                    }
                }
                meshArr[j] = new THREE.Mesh(result, result.materials);


            } else { // create cylinder
                cylcount++;
                let TMPCylHeight = boxHeight * ((Math.random() * (2.5 - 1)) + 1);
                tmpCylinder = new THREE.CylinderGeometry(cylBase, cylBase, TMPCylHeight, 120);

                if (j == 8 || j == 9)
                    tmpCylinder = new THREE.CylinderGeometry(cylBase / 1.75, cylBase / 1.75, TMPCylHeight, 120);


                tmpCylinderGeo = new THREE.Mesh(tmpCylinder);
                tmpCylinderGeo.position.y = 0;
                tmpCylinderBsp = new ThreeBSP(tmpCylinderGeo);

                //cube 1 - to cut cilynder
                var sphere_geometry = new THREE.CubeGeometry(1000, cylBase * 2.5, 1000);
                var cube1 = new THREE.Mesh(sphere_geometry);
                cube1.position.y = TMPCylHeight / 2;
                cube1.rotation.z = Math.random();
                var cube1_bsp = new ThreeBSP(cube1);

                //cube 2 - to cut cilynder
                var cube2 = new THREE.Mesh(sphere_geometry);
                cube2.position.y = (TMPCylHeight / 2) * -1;
                cube2.rotation.z = -Math.random();
                var cube2_bsp = new ThreeBSP(cube2);

                //substract cube from cylinder
                var subtract_bsp = tmpCylinderBsp.subtract(cube2_bsp.union(cube1_bsp));
                var result = subtract_bsp.toGeometry();

                // apply materials on right faces
                result.materials = [TXTMaterial[cylcount], TZAMaterial[Math.floor(Math.random() * 4)]];
                for (m = 0; m < result.faces.length; m++) {
                    if (m < result.faces.length - 220) {
                        result.faces[m].materialIndex = 1; // material - map

                    } else {
                        result.faces[m].materialIndex = 0; // material - color pattern
                    }
                }

                // console.log(result.faces.length);

                meshArr[j] = new THREE.Mesh(result, result.materials);

            }


            meshArr[j].innitialposition = {};
            meshArr[j].velocity = {};
            meshArr[j].positionAfterResize = {};
            meshArr[j].innitialposition.x = PosArr[j][0];
            meshArr[j].innitialposition.y = 100 - PosArr[j][1];

            meshArr[j].position.z = -(Math.random() * 800) - 1000; // for innitial fade in
            meshArr[j].rotation.z = Math.random() - 0.5;
            meshArr[j].rotation.x = Math.random() - 1.5;
            meshArr[j].rotation.y = Math.random() - 0.5;
            meshArr[j].rotationnum = 0;

            meshArr[j].material.map.needsUpdate = true;

            scene.add(meshArr[j]);

        }
        
    }

       EnterAnimation();

    scene.updateMatrixWorld(true);
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseover', onDocumentMouseMove, false);
    document.addEventListener('click', exitAnimation, false); // TODO: Better detect the click without document object

}


isAnimationOn = true;


function EnterAnimation() {

    // do fade in
    for (j = 0; j < BoxesNumber; j++) {

        new TWEEN.Tween(meshArr[j].position).to({
                z: PosArr[j][2]
            }, 2000 + Math.random() * 1000)
            .easing(TWEEN.Easing.Circular.Out).start();
    }
}

function exitAnimation() {
    if (isAnimationOn) {
        for (j = 0; j < BoxesNumber; j++) {
            new TWEEN.Tween(meshArr[j].position).to({
                    z: -300
                }, 2000 + Math.random() * 4000)
                .easing(TWEEN.Easing.Elastic.Out).start();
            new TWEEN.Tween(meshArr[j].scale).to({
                    z: 0,
                    y: 0,
                    x: 0
                }, 1000)
                .easing(TWEEN.Easing.Elastic.Out).start()
                .onComplete(function () {
                    scene.remove(meshArr[j]);
                });


        }
        isAnimationOn = false;
    }

}


var screenBorders = {}
var globalPosTween;

var isMouseAnimating = false;

function onWindowResize() {

    // Resize - responsive regrouping of objects

    screenWidth = window.innerWidth - (borderWidth / 2);
    screenHeight = window.innerHeight - (borderWidth / 2);

    let scaleFactor = 0.74 + (screenWidth / windowWidth) * 0.1;

    // var isResize = false;

    // camDist / 2
    if (!isMobile) {
        // isMouseAnimating = false;
        // if (isResize) {
        //     // globalPosTween.stop()
        //     mouse.x = screenWidth / 2;
        //     mouse.y = screenHeight / 2;
        // }
        for (let i = 0; i < meshArr.length; i++) {
            meshArr[i].scale.set(scaleFactor, scaleFactor, scaleFactor);
            meshArr[i].positionAfterResize.x = ((meshArr[i].innitialposition.x / 100) * screenWidth - (screenWidth / 2));
            meshArr[i].positionAfterResize.y = ((meshArr[i].innitialposition.y / 100) * screenHeight - (screenHeight / 2));

            meshArr[i].position.x = meshArr[i].positionAfterResize.x,
                meshArr[i].position.y = meshArr[i].positionAfterResize.y
            // mousePullStrengthTimeout = 50;
            // isResize=true;
            // var resizetween = new TWEEN.Tween(meshArr[i].position).to({
            //         x: meshArr[i].positionAfterResize.x,
            //         y: meshArr[i].positionAfterResize.y
            //     }, 1000)
            //     .easing(TWEEN.Easing.Cubic.Out).start()
            //     .onComplete(function () {
            //     });




        }


        screenBorders.bottomX = -(screenWidth / 2) * percentOfScreenX;
        screenBorders.topX = (screenWidth / 2) * percentOfScreenX;
        screenBorders.bottomY = -(screenHeight / 2) * percentOfScreenY;
        screenBorders.topY = (screenHeight / 2) * percentOfScreenY;






    } else {
        // take care of mobile resize event

    }
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function distanceVector(v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    // return Math.sqrt( dx * dx + dy * dy + dz * dz );
    return {
        x: dy,
        y: dx
    };
}


var moveEventCount = 0;
var prevMousePos = {
    x: 0,
    y: 0
};

var changeToTriggerAnimation = 0.1;
var mousePullStrength = 2500;
var mousePullStrengthTimeout = 15000;


function onDocumentMouseMove(event) {


    // console.log(event.clientX,event.clientY)
    if (!isMobile) {

        //get mouse positoin

        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        // console.log(mouse.x, mouse.y)
        // Change on 
        if (Math.abs(mouse.x - prevMousePos.x) > changeToTriggerAnimation || Math.abs(mouse.y - prevMousePos.y) > changeToTriggerAnimation) {
            prevMousePos.x = mouse.x;
            prevMousePos.y = mouse.y;
            let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            vector.unproject(camera);
            var dir = vector.sub(camera.position).normalize();
            var distance = -camera.position.z / dir.z;
            var MousePos = camera.position.clone().add(dir.multiplyScalar(distance));

            for (j = 0; j < BoxesNumber; j++) {

                // getting the ovject position into an object
                let tmpObjPso = new THREE.Vector3();
                tmpObjPso.x = meshArr[j].positionAfterResize.x;
                tmpObjPso.y = meshArr[j].positionAfterResize.y;

                // getting the distance vector between mouse and object              
                mouseRelations[j] = distanceVector(MousePos, tmpObjPso);

                // getting the distance length             
                let currdistance = Math.sqrt(mouseRelations[j].x * mouseRelations[j].x + mouseRelations[j].y * mouseRelations[j].y);

                //messuring the influence of the mouse by distance
                let Influence = Math.pow(Math.max(1 - currdistance / mousePullStrength, 0), 2);

                // new value is the innitial position of the mouse plus influence (0-1) times relations (vector of mouse from the innitial position)
                let newXpos = meshArr[j].positionAfterResize.x + Influence * mouseRelations[j].y;
                let newYpos = meshArr[j].positionAfterResize.y + Influence * mouseRelations[j].x;

                // Clamping the new value between the borders
                newXpos = Math.min(Math.max(newXpos, screenBorders.bottomX), screenBorders.topX);
                newYpos = Math.min(Math.max(newYpos, screenBorders.bottomY), screenBorders.topY);

                // Tween to new position

                // if (isResize) {
                //     mousePullStrengthTimeout = 100;
                // }
                globalPosTween = new TWEEN.Tween(meshArr[j].position).to({
                        x: newXpos,
                        y: newYpos
                    }, mousePullStrengthTimeout)
                    .easing(TWEEN.Easing.Cubic.Out).start()
                    .onUpdate(function () {

                    })
                    .onComplete(function () {
                        //         if (isResize)
                        //     {
                        //             isResize = false;
                        // mousePullStrengthTimeout = 15000;    
                        // }
                    });

            }
        }



        // for (j = 0; j < BoxesNumber; j++) {

        //     let tmpObjPso = new THREE.Vector3();
        //     // tmpObjPso.setFromMatrixPosition( meshArr[0].matrixWorld );
        //     tmpObjPso.x = meshArr[j].positionAfterResize.x;
        //     tmpObjPso.y = meshArr[j].positionAfterResize.y;
        //     // tmpObjPso.z = 0;

        //     // mouseRelations[j] = MousePos.distanceTo(tmpObjPso); 
        //     mouseRelations[j] = distanceVector(MousePos, tmpObjPso);

        //     let currdistance = Math.sqrt(mouseRelations[j].x * mouseRelations[j].x + mouseRelations[j].y * mouseRelations[j].y);


        //     // console.log();
        //     let Influence = Math.pow(Math.max(1 - currdistance / 300, 0), 2);
        //     // let infX = Math.max(1-currdistance/1000,0);
        //     meshArr[j].position.x = meshArr[j].positionAfterResize.x + Influence * mouseRelations[j].y;
        //     meshArr[j].position.y = meshArr[j].positionAfterResize.y + Influence * mouseRelations[j].x;

        //     // All follow mouse
        //     //    meshArr[j].position.x = meshArr[j].innitialposition.x +  (mouseRelations[j].y);     
        //     //  meshArr[j].position.y = meshArr[j].innitialposition.y +  (mouseRelations[j].x);     


        //     meshArr[j].direction = dir;


        // }

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
    }
}





function animate() {

    requestAnimationFrame(animate);

    if (!isMobile) {
        for (j = 0; j < BoxesNumber; j++) {
            if (j % 2) { // continuous rotation for Y-Z 
                meshArr[j].rotation.y += (0.05 * (Math.PI / 180));
                meshArr[j].rotation.z += (0.05 * 1.2 * (Math.PI / 180));


            } else { // continuous rotation for Y-Z 
                meshArr[j].rotation.x += (0.1 * (Math.PI / 180));
                meshArr[j].rotation.z += (0.05 * 1.2 * (Math.PI / 180));
            }

            // Continues movement
            if (mouseRelations[j]) {
                let currdistance = Math.sqrt(mouseRelations[j].x * mouseRelations[j].x + mouseRelations[j].y * mouseRelations[j].y);

                if (currdistance < 400) // all shapes gets the bounce rotation effect"
                {
                    let CalcRoataionStage = Math.floor(mouseMoveInterval / currdistance); // the groth is exp (making more rotations when the pointer is near)
                    CalcRoataionStage = Math.min(Math.max(CalcRoataionStage, 0), 6); // clamp number of rotations to 2 ()

                    if (CalcRoataionStage != meshArr[j].rotationnum) // rotationnum keeps the current rotation position
                    {
                        meshArr[j].rotationnum = CalcRoataionStage;
                        new TWEEN.Tween(meshArr[j].rotation).to({
                                z: (CalcRoataionStage * 45 * (Math.PI / 180))
                            }, 2000)
                            .easing(TWEEN.Easing.Bounce.Out).start();
                    }
                } else {




                }
            }

        }
        camera.lookAt(scene.position);

    } else {
        // Update mobile gyro controler
        controls.update();
    }

    light.position.set(camera.position.x, camera.position.y, camera.position.z).normalize();
    render();
}

function render() {

    TWEEN.update();
    renderer.render(scene, camera);

}

