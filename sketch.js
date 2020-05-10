// ml5.js: Pose Estimation with PoseNet
// found the image from https://github.com/lepunk/react-native-videos/tree/whack-a-mole/WhackAMole/assets/img

let moleWindow;

let video;
let poseNet;
let pose;
let skeleton;
let imgBackground;
let pg;

let cameraCanvas = function (sketch) {
    sketch.setup = function () {
        sketch.createCanvas(640, 480);

        video = sketch.createCapture(sketch.VIDEO);
        video.hide();
        poseNet = ml5.poseNet(video, modelLoaded);
        poseNet.on('pose', gotPoses);
    };

    function gotPoses(poses) {
        //console.log(poses);
        if (poses.length > 0) {
            pose = poses[0].pose;
            skeleton = poses[0].skeleton;
        }
    }

    function modelLoaded() {
        console.log('poseNet ready');
    }

    sketch.draw = function () {
        sketch.image(video, 0, 0);

        if (pose) {
            let eyeR = pose.rightEye;
            let eyeL = pose.leftEye;
            let d = sketch.dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
            sketch.fill(255, 0, 0);
            sketch.ellipse(pose.nose.x, pose.nose.y, d);
            sketch.fill(0, 0, 255);
            sketch.ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
            sketch.ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

            for (let i = 0; i < pose.keypoints.length; i++) {
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                sketch.fill(0, 255, 0);
                sketch.ellipse(x, y, 16, 16);
            }

            for (let i = 0; i < skeleton.length; i++) {
                let a = skeleton[i][0];
                let b = skeleton[i][1];
                sketch.strokeWeight(2);
                sketch.stroke(255);
                sketch.line(a.position.x, a.position.y, b.position.x, b.position.y);
            }
        }
    };
};

var moleCanvas = function (sketch) {
    let spritesheet;
    let spritedata;
    let animation = {};
    const canvasWidth = 400;
    const canvasHeight = 600;
    // const moleWidth = 190 * 0.666;
    // const moleHeight = 144 * 0.666;

    sketch.preload = function () {
        imgBackground = sketch.loadImage('assets/background.png');
        spritesheet = sketch.loadImage('assets/sprites.png');
        spritedata = sketch.loadJSON('assets/mole.json');
    };

    sketch.setup = function () {
        sketch.createCanvas(canvasWidth, canvasHeight);

        /**
         * sprite info
         * 0-3: come out
         * 4-16: out
         * 36-38, 42-44: kicked
         */
        const moleSprite = {
            comeOut: [0, 1, 2, 3],
            out: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            backIn: [5, 4, 3, 2, 1, 0],
            kicked: [36, 37, 38, 42, 43, 44],
        };

        let frames = spritedata.frames;

        // load sprite by animation
        Object.entries(moleSprite).map((key) => {
            let moleAction = [];
            key[1].map((sprite) => {
                let pos = frames[sprite].position;
                let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
                moleAction.push(img);
            });
            animation[key[0]] = moleAction;
        });
        console.log(animation);
    };

    // Initiallize moles
    const moles = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const mole = new Mole(sketch, animation, [i, j]);
            mole.moleController();
            moles.push(mole);
        }
    }

    sketch.draw = function () {
        //for canvas 2
        sketch.image(imgBackground, 0, 0, canvasWidth, canvasHeight);
        // moles.draw();
        moles.map((mole) => mole.draw());

        sketch.frameRate(4);
    };
};

// create a new instance of p5 and pass in the function for sketch 1
let cameraWindow = new p5(cameraCanvas);
// create the second instance of p5 and pass in the function for sketch 2
moleWindow = new p5(moleCanvas);
