var camera, scene, light, renderer, raycaster, mouse, controls;
var exportButton, floatingDiv;
var mouseX = 0,
    mouseY = 0;
// var isMobile = false;
var screenWidth = window.screen.width;
var screenHeight = window.screen.height;
var windowWidth = window.screen.width;
var windowHeight = window.screen.height;


if (window.innerWidth < 640) {
    var isMobile = true;

}


var mouseMoveInterval = 144; // This is for the "jumping" animation. 
var mouseRelations = []; // Arr to keep distance from mouse pointer.


var BoxesNumber = 13;
var PosArr = [];

// Positions of rocks

// for (j=0;j<BoxesNumber;j++)
// {
//     let tmpX = Math.floor((Math.random() * 100));
//     let tmpY = Math.floor((Math.random() * 100));
//     let tmpZ = Math.floor((Math.random() * 100)-50);
// PosArr.push([tmpX,tmpY,tmpZ]);
// console.log('['+tmpX+','+tmpY+','+tmpZ+',],');
// }



PosArr = [
    [90, 36, 0],
    [0, 66, 0],
    [68, 90, 0],
    [19, 25, 0],
    [18, 89, 0],
    [62, 58, 0],
    [88, 83, 0],
    [40, 19, 40],
    [20, 48, 0],
    [83, 9, 0],
    [70, 19, 40],
    [11, 11, 0],
    [100, 100, 0]
];


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

var TZAtxtArr = ['img/check1.jpg', 'img/check2.jpg', 'img/check3.jpg', 'img/check4.jpg'];
var TZAMaterial = [];
var TXTMaterial = [];
var TXTMaterialScale2 = [];


for (let i = 0; i < txtArr.length; i++) {
    let TMPtexture = THREE.ImageUtils.loadTexture(txtArr[i]);
    TMPtexture.wrapS = TMPtexture.wrapT = THREE.RepeatWrapping;
    TMPtexture.offset.set(0, 0);
    TMPtexture.repeat.set(1, 1);    

      let TMPtextureScale2 = THREE.ImageUtils.loadTexture(txtArr[i]);
    TMPtextureScale2.wrapS = TMPtextureScale2.wrapT = THREE.RepeatWrapping;
    TMPtextureScale2.offset.set(0, 0);
    TMPtextureScale2.repeat.set(0.5, 0.5);    


    TXTMaterial[i] = new THREE.MeshBasicMaterial({
        map: TMPtexture,
        overdraw: true
    });
    TXTMaterialScale2[i] =  new THREE.MeshBasicMaterial({
        map: TMPtextureScale2,
        overdraw: true
    });
}

for (let i = 0; i < TZAtxtArr.length; i++) {
    let TZATexture = new THREE.TextureLoader().load(TZAtxtArr[i]);
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

for (let i = 0; i < txtBoxSideArr.length; i++) {
    // Box side
    let textureBoxSideArr = THREE.ImageUtils.loadTexture(txtBoxSideArr[i]);
    textureBoxSideArr.wrapS = textureBoxSideArr.wrapT = THREE.RepeatWrapping;
    textureBoxSideArr.repeat.set(1, 0.666666);
    textureBoxSideArr.offset.set(0, 0.33333);
    TXTBoxSideMaterial[i] = new THREE.MeshBasicMaterial({
        map: textureBoxSideArr,
        overdraw: true
    });
    // Box square
    let textureBoxSQ = THREE.ImageUtils.loadTexture(txtBoxSideArr[i]);
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



            if (j == 1 || j == 3 || j == 5 || j == 7) { // create box

                let tmpCylinder = new THREE.CylinderGeometry((boxWidth/1.3), (boxWidth/1.3) * .8, boxHeight, 4);
                tmpCylinder.materials = [TXTMaterial[j],TXTMaterialScale2[j], TZAMaterial[Math.floor(Math.random() * 4)]];
                for (m = 0; m < tmpCylinder.faces.length; m++) {
                    if (m == 0 || m == 1 || m == 4 || m == 5) {
                        tmpCylinder.faces[m].materialIndex = 0; // side 2
                    } else  if (m ==2 ||m ==3 ||m ==6 ||m ==7 ){
                        tmpCylinder.faces[m].materialIndex = 2; // side 1 
                    } else {
                        tmpCylinder.faces[m].materialIndex = 1; // edge squaer
                        
                    }
                }

                // console.log(result.faces.length);

                meshArr[j] = new THREE.Mesh(tmpCylinder, tmpCylinder.materials);



            } else if (j == 0 || j == 2 || j == 4 || j == 6) { // create triangle cylincer
                tmpCylinder = new THREE.CylinderGeometry(cylBase*1.3, cylBase*1.1, boxHeight, 3);
                tmpCylinder.materials = [TXTMaterial[j], TZAMaterial[Math.floor(Math.random() * 4)]];
                for (m = 0; m < tmpCylinder.faces.length; m++) {
                    if (m < tmpCylinder.faces.length - 6) {
                        tmpCylinder.faces[m].materialIndex = 1; // material - map

                    } else {
                        tmpCylinder.faces[m].materialIndex = 0; // material - color pattern

                    }
                }

                // console.log(result.faces.length);

                meshArr[j] = new THREE.Mesh(tmpCylinder, tmpCylinder.materials);

            } else { // create cylinder
                cylcount++;
                tmpCylinder = new THREE.CylinderGeometry(cylBase, cylBase, boxHeight * 2, 120);
                tmpCylinderGeo = new THREE.Mesh(tmpCylinder);
                tmpCylinderGeo.position.y = 0;
                tmpCylinderBsp = new ThreeBSP(tmpCylinderGeo);
                var sphere_geometry = new THREE.CubeGeometry(300, cylBase * 2.5, 300);
                var cube1 = new THREE.Mesh(sphere_geometry);
                cube1.position.y = boxHeight;

                cube1.rotation.z = Math.random();

                var cube1_bsp = new ThreeBSP(cube1);

                var cube2 = new THREE.Mesh(sphere_geometry);
                cube2.position.y = (boxHeight) * -1;

                cube2.rotation.z = -Math.random();

                var cube2_bsp = new ThreeBSP(cube2);

                var subtract_bsp = tmpCylinderBsp.subtract(cube2_bsp.union(cube1_bsp));

                var result = subtract_bsp.toGeometry();

                // result.geometry.computeVertexNormals();

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
            // scene.add(  meshArr[j] );

            // tmpCylinder = new THREE.CylinderGeometry(cylBase,cylBase,boxHeight,30);
            // tmpSphere   = new THREE.SphereGeometry(100,16,12);


            // boxArr[j] = new THREE.CylinderGeometry(cylBase,cylBase,boxHeight,30);



            // var a = CSG.cube({ center: [-0.25, -0.25, -0.25] });
            // var b = CSG.sphere({ radius: 1.3, center: [0.25, 0.25, 0.25] });
            // boxArr[j] = THREE.CSG.fromCSG(a.subtract(b));
            // console.log(boxArr[j]);


            meshArr[j].innitialposition = {};
            meshArr[j].velocity = {};
            meshArr[j].positionAfterResize = {};
            // meshArr[j].innitialposition.x = Math.floor((Math.random() * screenWidth) - screenWidth / 2);
            meshArr[j].innitialposition.x = PosArr[j][0];
            meshArr[j].innitialposition.y = PosArr[j][1];

            meshArr[j].position.z = -(Math.random() * 800) - 1000; // for innitial fade in

            // Logging the positions
            // console.log("[" + meshArr[j].innitialposition.x + "," + meshArr[j].innitialposition.y + "," + meshArr[j].position.z + "]");

            meshArr[j].rotation.z = Math.random();
            meshArr[j].rotation.x = Math.random();
            meshArr[j].rotation.y = Math.random();
            meshArr[j].rotationnum = 0;

            scene.add(meshArr[j]);

            new TWEEN.Tween(meshArr[j].position).to({
                    z: PosArr[j][2]
                }, 2000 + Math.random() * 1000)
                .easing(TWEEN.Easing.Circular.Out).start();




        }
    }


    scene.updateMatrixWorld(true);
    onWindowResize();





    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseover', onDocumentMouseMove, false);
    document.addEventListener('click', exitAnimation, false); // TODO: Better detect the click without document object

}



function exitAnimation() {
    console.log('ending animation');
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
            .easing(TWEEN.Easing.Elastic.Out).start();
    }
}



function onWindowResize() {

    // Resize - responsive regrouping of objects

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    let scaleFactor = 0.7 + (screenWidth / windowWidth) * 0.1;



    // camDist / 2
    if (!isMobile) {
        for (let i = 0; i < meshArr.length; i++) {
            meshArr[i].scale.set(scaleFactor, scaleFactor, scaleFactor);
            meshArr[i].positionAfterResize.x = 1.2 * ((meshArr[i].innitialposition.x / 100) * screenWidth - (screenWidth / 2));
            meshArr[i].positionAfterResize.y = ((meshArr[i].innitialposition.y / 100) * screenHeight - (screenHeight / 2));

            meshArr[i].position.x = meshArr[i].positionAfterResize.x;
            meshArr[i].position.y = meshArr[i].positionAfterResize.y;

        }


        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

    }


    renderer.setSize(window.innerWidth, window.innerHeight);
    if (isMobile) {

    }
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


function onDocumentMouseMove(event) {

    if (!isMobile) {
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        var dir = vector.sub(camera.position).normalize();
        var distance = -camera.position.z / dir.z;
        var MousePos = camera.position.clone().add(dir.multiplyScalar(distance));

        for (j = 0; j < BoxesNumber; j++) {

            let tmpObjPso = new THREE.Vector3();
            // tmpObjPso.setFromMatrixPosition( meshArr[0].matrixWorld );
            tmpObjPso.x = meshArr[j].positionAfterResize.x;
            tmpObjPso.y = meshArr[j].positionAfterResize.y;
            // tmpObjPso.z = 0;

            // mouseRelations[j] = MousePos.distanceTo(tmpObjPso); 
            mouseRelations[j] = distanceVector(MousePos, tmpObjPso);

            let currdistance = Math.sqrt(mouseRelations[j].x * mouseRelations[j].x + mouseRelations[j].y * mouseRelations[j].y);


            // console.log();
            let Influence = Math.pow(Math.max(1 - currdistance / 300, 0), 2);
            // let infX = Math.max(1-currdistance/1000,0);
            meshArr[j].position.x = meshArr[j].positionAfterResize.x + Influence * mouseRelations[j].y;
            meshArr[j].position.y = meshArr[j].positionAfterResize.y + Influence * mouseRelations[j].x;

            // All follow mouse
            //    meshArr[j].position.x = meshArr[j].innitialposition.x +  (mouseRelations[j].y);     
            //  meshArr[j].position.y = meshArr[j].innitialposition.y +  (mouseRelations[j].x);     


            meshArr[j].direction = dir;


        }
        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
    }
}



var rotationSpeed = 0.1;


function animate() {

    requestAnimationFrame(animate);

    if (!isMobile) {
        var timer = Date.now() * 0.00005;

        for (j = 0; j < BoxesNumber; j++) {
            // Continues movement
            if (mouseRelations[j]) {
                let currdistance = Math.sqrt(mouseRelations[j].x * mouseRelations[j].x + mouseRelations[j].y * mouseRelations[j].y);
                if (true) // all shapes gets the bounce rotation effect"
                {
                    let CalcRoataionStage = Math.floor(250 / currdistance); // the groth is exp (making more rotations when the pointer is near)
                    CalcRoataionStage = Math.min(Math.max(CalcRoataionStage, 0), 16); // clamp number of rotations to 2 ()
                    
                    if (CalcRoataionStage != meshArr[j].rotationnum) // rotationnum keeps the current rotation position
                    {
                        meshArr[j].rotationnum = CalcRoataionStage;
                        new TWEEN.Tween(meshArr[j].rotation).to({
                                z: (CalcRoataionStage * 45 * (Math.PI / 180))
                        }, 1500)
                            .easing(TWEEN.Easing.Bounce.Out).start();
                    }
                }
                if (j % 2) {
                    let CalcRoataionStage = currdistance * rotationSpeed / 1000;
                    meshArr[j].rotation.y += (CalcRoataionStage * (Math.PI / 180));
                    meshArr[j].rotation.z += (CalcRoataionStage*1.2 * (Math.PI / 180));
                    

                } else {
                    let CalcRoataionStage = currdistance * rotationSpeed / 1000;
                    meshArr[j].rotation.x += (CalcRoataionStage * (Math.PI / 180));
                    meshArr[j].rotation.z += (CalcRoataionStage*1.2 * (Math.PI / 180));
                }

                let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
                vector.unproject(camera);
                var dir = vector.sub(camera.position).normalize();
                var distance = -camera.position.z / dir.z;
                var MousePos = camera.position.clone().add(dir.multiplyScalar(distance));

                if (j == 1) {
                    // console.log(dir.x, currdistance)

                }


                // let Fx = -0.5 * Cd * A * rho * meshArr[j].velocity.x * meshArr[j].velocity.x * meshArr[j].velocity.x / Math.abs(meshArr[j].velocity.x);
                // let Fy = -0.5 * Cd * A * rho * meshArr[j].velocity.y * meshArr[j].velocity.y * meshArr[j].velocity.y / Math.abs(meshArr[j].velocity.y);
                // Fx = (isNaN(Fx) ? 0 : Fx);
                // Fy = (isNaN(Fy) ? 0 : Fy);

                // Integrate to get position

                let DistX = MousePos.x - meshArr[j].position.x;
                let DistY = MousePos.y - meshArr[j].position.y;

                // if (DistX < 200) {
                //     meshArr[j].position.x += (DistX) / 4000;
                // }

                // if (DistY < 200) {
                //     meshArr[j].position.y += (DistY) / 4000;
                // }
                //    meshArr[j].position.y += (DistY)/1000;  



                // meshArr[j].position.x += MousePos.x / 100;
                // meshArr[j].position.y += MousePos.y / 100;

                // console.log(timer);

                // Ease in - 
                // if ( meshArr[j].position.z < PosArr[j][2]) // Fade in animation
                // {
                // let d = -400 - PosArr[j][2]; 
                // let currd = meshArr[j].position.z - PosArr[j][2];
                // let percentOfchange = currd/d;
                //     meshArr[j].position.z += (timer/5000000)*percentOfchange; //TODO: dix rythem
                // }

                // meshArr[j].rotation.y += (CalcRoataionStage * (Math.PI / 180));
                // meshArr[j].rotation.x = -(mouseRelations[j].x/1000);
            }


            //    meshArr[j].position.x =  mouseRelations[j]/3000
            // meshArr[j].rotation.x = (meshArr[j].position.y * (mouseY) / screenHeight *  mouseRelations[j]/screenWidth);


            //    let micoMoveX = ((mouseX) / screenWidth) * 0.3;
            //    let micoMoveY = ((mouseY) / screenHeight) * 0.3;

            // jumping movement
            // meshArr[j].rotation.z = (meshArr[j].position.x * Math.floor(mouseX/mouseMoveInterval));
            // meshArr[j].rotation.x = (meshArr[j].position.y * Math.floor(mouseY/mouseMoveInterval));



        }
        camera.lookAt(scene.position);
    } else {

        //Trowaray:


        controls.update();

        // var timer = Date.now() * 0.00005;
        // camera.position.x = Math.cos(timer) * 300; // distance from obj
        // camera.position.z = Math.sin(timer) * 300;
        // camera.position.y = 0;

        for (j = 0; j < 3; j++) {
            // meshArr[j].rotation.z +=  0.0003;


            /// Different direction: throwaway
            // if (j==1)
            // {
            // meshArr[j].rotation.z -=  0.0010;

            // }

            // meshArr[j].rotation.y +=  0.03;



            // console.log(meshArr[j].rotation.y);
        }


        // camera.lookAt(scene.position);

    }

    light.position.set(camera.position.x, camera.position.y, camera.position.z).normalize();
    render();
}

function render() {

    TWEEN.update();
    renderer.render(scene, camera);

}

let time = 0;
init();
animate();