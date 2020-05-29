'use strict';

// ml5.js: Pose Estimation with PoseNet
// found the image from https://github.com/lepunk/react-native-videos/tree/whack-a-mole/WhackAMole/assets/img
var moleWindow;
var video;
var poseNet;
var pose;
var skeleton;
var pg;
var rightAngle = 0;
var leftAngle = 0;
var score = 0; // Video canvas

var cameraCanvas = function cameraCanvas(sketch) {
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
        // flip x-axis backwards
        sketch.translate(video.width, 0);
        sketch.scale(-1.0, 1.0);
        sketch.image(video, 0, 0);

        if (pose) {
            var eyeR = pose.rightEye;
            var eyeL = pose.leftEye;
            var d = sketch.dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
            sketch.fill(255, 0, 0);
            sketch.ellipse(pose.nose.x, pose.nose.y, d);
            sketch.fill(0, 0, 255);
            sketch.ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
            sketch.ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

            for (var i = 0; i < pose.keypoints.length; i++) {
                var x = pose.keypoints[i].position.x;
                var y = pose.keypoints[i].position.y;
                sketch.fill(0, 255, 0);
                sketch.ellipse(x, y, 16, 16);
            }

            for (var _i = 0; _i < skeleton.length; _i++) {
                var a = skeleton[_i][0];
                var b = skeleton[_i][1];
                sketch.strokeWeight(2);
                sketch.stroke(255);
                sketch.line(a.position.x, a.position.y, b.position.x, b.position.y);
            } // Whack moles

            rightAngle = getAngle(
                [pose.leftShoulder.x, pose.leftShoulder.y],
                [pose.rightShoulder.x, pose.rightShoulder.y],
                [pose.rightWrist.x, pose.rightWrist.y]
            );
            leftAngle = getAngle(
                [pose.rightShoulder.x, pose.rightShoulder.y],
                [pose.leftShoulder.x, pose.leftShoulder.y],
                [pose.leftWrist.x, pose.leftWrist.y]
            ); // sketch.textSize(30);
            // sketch.text(rightAngle, 50, 50);
            // sketch.text(leftAngle, 50, 80);

            sketch.frameRate(15);
        }
    };
}; // Mole canvas

var moleCanvas = function moleCanvas(sketch) {
    // Set Image and sprite
    var imgBackground;
    var spritesheet;
    var spritedata;
    var iconPlay;
    var animation = {}; // const canvasWidth = 500;

    var canvasWidth = sketch.displayWidth < 700 ? sketch.displayWidth : 500; // const canvasHeight = 700;

    var canvasHeight = sketch.displayWidth < 700 ? sketch.displayHeight - 80 : 700; // Timer variables

    var timer = 30; // Game state

    var isPlaying = false;

    sketch.preload = function () {
        imgBackground = sketch.loadImage('assets/background.png');
        spritesheet = sketch.loadImage('assets/sprites.png');
        spritedata = sketch.loadJSON('assets/mole.json');
        iconPlay = sketch.loadImage('assets/icon_play.png');
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

        var moleSprite = {
            comeOut: [0, 1, 2, 3],
            out: [4, 5, 6, 7, 8, 9, 10, 11, 14, 16, 11, 6, 7, 6, 7, 6, 7],
            backIn: [5, 4, 3, 2, 1, 0],
            clicked: [36, 37, 38, 42, 43, 44],
        };
        var frames = spritedata.frames; // load sprite by animation

        Object.entries(moleSprite).map(function (key) {
            var moleAction = [];
            key[1].map(function (sprite) {
                var pos = frames[sprite].position;
                var img = spritesheet.get(pos.x, pos.y, pos.w, pos.h);
                moleAction.push(img);
            });
            animation[key[0]] = moleAction;
        });
        console.log(animation);
    }; // Initiallize moles

    var moles = [];

    var initMoles = function initMoles() {
        moles = [];

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var mole = new Mole(sketch, animation, [i, j]);
                mole.moleController();
                moles.push(mole);
            }
        }
    }; // Timer

    var timeCounter = function timeCounter() {
        var timeleft = 30;
        var startTime = 0;
        var currentTime = 0;
        startTime = sketch.millis();
        var params = sketch.getURLParams();
        console.log(params);

        if (params.minute) {
            var min = params.minute;
            timeleft = min * 60;
        }

        timer = convertSeconds(timeleft - currentTime);
        var interval = setInterval(timeIt, 1000);

        function timeIt() {
            currentTime = sketch.floor((sketch.millis() - startTime) / 1000);
            timer = convertSeconds(timeleft - currentTime);

            if (currentTime == timeleft) {
                clearInterval(interval); // Set timeout to moles

                moles.map(function (mole) {
                    return mole.timeoutController();
                });
                isPlaying = false;
            }
        }
    }; // Start Game

    sketch.draw = function () {
        //for canvas 2
        sketch.imageMode(sketch.CORNER);
        sketch.image(imgBackground, 0, 0, canvasWidth, canvasHeight); // Score

        sketch.textSize(25); // sketch.textAlign(sketch.CENTER, sketch.LIFT);

        sketch.textFont('Chelsea Market');
        sketch.text('Score: ' + score, 70, 32); // Timer
        // sketch.textAlign(sketch.RIGHT);

        sketch.text('Time: ' + timer, canvasWidth - 80, 32);

        if (isPlaying) {
            moles.map(function (mole) {
                return mole.draw();
            }); // check left pose click

            if (canvasWidth > 700) {
                if (leftAngle >= 330 && leftAngle < 360) {
                    moles[0].clicked();
                }

                if ((leftAngle >= 0 && leftAngle < 40) || (leftAngle >= 300 && leftAngle < 330)) {
                    moles[3].clicked();
                }

                if (leftAngle >= 40 && leftAngle < 80) {
                    moles[6].clicked();
                } // check right pose click

                if (rightAngle >= 30 && rightAngle < 70) {
                    moles[2].clicked();
                }

                if (
                    (rightAngle >= 0 && rightAngle < 20) ||
                    (rightAngle >= 340 && rightAngle < 360)
                ) {
                    moles[5].clicked();
                }

                if (rightAngle >= 270 && rightAngle < 330) {
                    moles[8].clicked();
                } // check middle pose click

                if (rightAngle >= 80 && rightAngle < 140 && leftAngle >= 220 && leftAngle < 280) {
                    moles[1].clicked();
                }

                if (rightAngle >= 220 && rightAngle < 290 && leftAngle >= 100 && leftAngle < 160) {
                    moles[4].clicked();
                }

                if (rightAngle >= 250 && rightAngle < 270 && leftAngle >= 90 && leftAngle < 110) {
                    moles[7].clicked();
                }
            }
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
                sketch.text(
                    'You Got '.concat(score, ' Points!'),
                    canvasWidth / 2,
                    canvasHeight / 2 - 50
                );
            }
        }

        sketch.textSize(10);
        sketch.textAlign(sketch.CENTER); // sketch.textAlign(sketch.CENTER, sketch.LIFT);
        // sketch.textFont('Chelsea Market');

        sketch.text(
            "Developed by Steve Chan | Image assets found in lepunk's repo",
            canvasWidth / 2,
            canvasHeight - 5
        );
        sketch.frameRate(8);
    };

    sketch.mouseClicked = function () {
        console.log(sketch.mouseX);

        if (isPlaying) {
            moles.map(function (mole) {
                return mole.mouseClick(sketch.mouseX, sketch.mouseY);
            });
        } else {
            var d = sketch.dist(
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
}; // create a new instance of p5 and pass in the function for sketch 1

if (window.innerWidth > 700) {
    console.log(window.innerWidth);
    var cameraWindow = new p5(cameraCanvas);
} // create the second instance of p5 and pass in the function for sketch 2

moleWindow = new p5(moleCanvas);
