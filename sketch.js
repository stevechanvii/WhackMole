// ml5.js: Pose Estimation with PoseNet
// found the image from https://github.com/lepunk/react-native-videos/tree/whack-a-mole/WhackAMole/assets/img

let moleWindow;

let video;
let poseNet;
let pose;
let skeleton;
let pg;

let score = 0;

// Video canvas
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

// Mole canvas
var moleCanvas = function (sketch) {
    // Set Image and sprite
    let imgBackground;
    let spritesheet;
    let spritedata;
    let iconPlay;
    let iconPlayHover;
    const animation = {};
    const canvasWidth = 400;
    const canvasHeight = 600;

    // Timer variables
    let timer = 30;

    // Game state
    let isStart = false;
    let isPlaying = false;

    sketch.preload = function () {
        imgBackground = sketch.loadImage('assets/background.png');
        spritesheet = sketch.loadImage('assets/sprites.png');
        spritedata = sketch.loadJSON('assets/mole.json');
        iconPlay = sketch.loadImage('assets/icon_play.png');
        iconRestart = sketch.loadImage('assets/icon_restart.png');
    };

    function convertSeconds(s) {
        var min = sketch.floor(s / 60);
        var sec = s % 60;
        return sketch.nf(sec, 2);
    }

    sketch.setup = function () {
        sketch.createCanvas(canvasWidth, canvasHeight);

        /**
         * sprite info
         * 0-3: come out
         * 4-16: out
         * 36-38, 42-44: clicked
         */
        const moleSprite = {
            comeOut: [0, 1, 2, 3],
            out: [4, 5, 6, 7, 8, 9, 10, 11, 14, 16, 11, 6, 7, 6, 7, 6, 7],
            backIn: [5, 4, 3, 2, 1, 0],
            clicked: [36, 37, 38, 42, 43, 44],
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
    const initMoles = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const mole = new Mole(sketch, animation, [i, j]);
                mole.moleController();
                moles.push(mole);
            }
        }
    };

    // Timer
    const timeCounter = () => {
        let timeleft = 30;
        let startTime = 0;
        let currentTime = 0;

        startTime = sketch.millis();

        const params = sketch.getURLParams();
        console.log(params);
        if (params.minute) {
            const min = params.minute;
            timeleft = min * 60;
        }

        timer = convertSeconds(timeleft - currentTime);

        const interval = setInterval(timeIt, 1000);

        function timeIt() {
            currentTime = sketch.floor((sketch.millis() - startTime) / 1000);
            timer = convertSeconds(timeleft - currentTime);
            if (currentTime == timeleft) {
                clearInterval(interval);
                // Set timeout to moles
                moles.map((mole) => mole.timeoutController());
                isPlaying = false;
            }
        }
    };

    // Start Game
    sketch.draw = function () {
        //for canvas 2
        sketch.image(imgBackground, 0, 0, canvasWidth, canvasHeight);

        // Score
        sketch.textSize(25);
        // sketch.textAlign(sketch.CENTER, sketch.LIFT);
        sketch.textFont('Chelsea Market');
        sketch.text('Score: ' + score, 20, 32);

        // Timer
        // sketch.textAlign(sketch.RIGHT);
        sketch.text('Time: ' + timer, canvasWidth - 115, 32);

        if (isPlaying) {
            moles.map((mole) => mole.draw());
        } else {
            // Play game icon
            sketch.imageMode(sketch.CENTER);
            sketch.textAlign(sketch.CENTER);
            if (
                sketch.dist(sketch.mouseX, sketch.mouseY, canvasWidth / 2, canvasHeight / 2 + 20) <
                30
            ) {
                sketch.image(iconPlay, canvasWidth / 2, canvasHeight / 2 + 20, 80, 80);
                sketch.textSize(25);
                sketch.text('Press to Start!', canvasWidth / 2, canvasHeight / 2 + 85);
            } else {
                sketch.image(iconPlay, canvasWidth / 2, canvasHeight / 2 + 20, 70, 70);
                sketch.textSize(20);
                sketch.text('Press to Start!', canvasWidth / 2, canvasHeight / 2 + 85);
            }

            if (score > 0) {
                sketch.textAlign(sketch.CENTER);
                sketch.textSize(25);
                sketch.text('Congratulations!', canvasWidth / 2, canvasHeight / 2 - 100);
                sketch.text(`You Got ${score} Points!`, canvasWidth / 2, canvasHeight / 2 - 50);
            }
        }

        sketch.frameRate(8);
    };

    sketch.mouseClicked = function () {
        console.log(sketch.mouseX);

        if (isPlaying) {
            moles.map((mole) => mole.mouseClick(sketch.mouseX, sketch.mouseY));
        } else {
            const d = sketch.dist(
                sketch.mouseX,
                sketch.mouseY,
                canvasWidth / 2,
                canvasHeight / 2 + 20
            );
            if (d < 40) {
                isPlaying = true;
                timeCounter();
                initMoles();
                score = 0;
            }
        }
    };
};

// create a new instance of p5 and pass in the function for sketch 1
// let cameraWindow = new p5(cameraCanvas);
// create the second instance of p5 and pass in the function for sketch 2
moleWindow = new p5(moleCanvas);
