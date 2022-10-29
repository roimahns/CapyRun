import { useEffect } from "react";

export default function Board() {
    const randInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    useEffect(() => {
        // Seting up canvas
        const canvas = document.getElementById("capyCanvas");
        var ctx = canvas.getContext("2d");

        // This is the bird
        // x, y starting point, dy, d2y down and up speeds?
        var bird = { x: canvas.width / 3, y: canvas.height / 2, dy: 0, d2y: 0 };

        // setting up the variable i for for loops later on
        var i;

        // Current pipe

        // Returning a "Pipe" with attributes, width, x, y, and dx
        function Pipe(width, x, y, dx, drawn) {
            this.width = width;
            this.x = x;
            this.y = y;
            this.dx = dx;
        }

        // This is setting up array for the pipes
        var pipes = [];

        // Initialize space until next pipe
        var spaceUntilNextPipe = 0;

        // Initialize the cool down in between space bar presses (flapping)
        var flapTimer = 0;

        // Initialize score value
        var score = 0;

        // Initialize game start
        var gameStart = false;

        // This function
        const drawBird = () => {
            // Makes the bird go down
            bird.y = bird.y + bird.dy; // Velocity

            // Make the bird's speed increase
            bird.dy = bird.dy + bird.d2y; // Acceleration

            // second 0: y = 0, dy = 10, d2y = 2
            // second 1: y = 10, dy = 12, d2y = 2
            // second 2: y = 22, dy = 14, d2y = 2
            // second 3: y = 36, dy = 16, d2y = 2

            // cool down
            flapTimer -= 20;

            // Drawing stuff the bird
            ctx.beginPath();
            var img = document.createElement("img");
            img.src = "capybara.jpg";
            ctx.arc(bird.x, bird.y, 10, 0, Math.PI * 2);
            //ctx.fillStyle = "A67563";
            //ctx.fill();
            //ctx.strokeStyle = "#000000";
            ctx.stroke();
            ctx.closePath();
        }


        // Adds a pipe or doesn't depending on spaceUntilNextPipe
        const addPipe = () => {
            // when spaceUntilNextPipe hits zero it makes a new pipe, then resets spaceUntilNextPipe
            if (spaceUntilNextPipe <= 0) {
                pipes.push(
                    new Pipe(30, canvas.width, randInt(60, canvas.height - 100), -1)
                );
                spaceUntilNextPipe = 200; // the space between pipes is defined here
            }
            // takes one from spaceUntilNextPipe each time its called.
            spaceUntilNextPipe -= 1;
        };

        // Drawing the pipe (canvas stuff)
        const drawPipe = () => {
            for (i = 0; i < pipes.length; i++) {
                ctx.beginPath();
                ctx.rect(pipes[i].x, pipes[i].y, pipes[i].width, canvas.height);
                ctx.fillStyle = "#22DD22";
                ctx.fill();
                ctx.strokeStyle = "#111111";
                ctx.stroke();
                ctx.closePath();
                pipes[i].x += pipes[i].dx;
            }

            // If the pipe goes off the screen, delete it from the array pipes.
            if (pipes[0].x <= -1 * pipes[0].width) {
                pipes.shift();
            }
        };

        // Handle the bird hitting the edges
        const borderCollision = () => {
            // If the bird is touching the ground (outside of the canvas) then game over
            if (bird.y + 10 >= canvas.height) {
                gameOver();
            } else if (bird.y <= 0) {
                // When the bird touches the top it makes the bird go down fast
                bird.dy *= -2;
            }
        };

        // Handles the bird touching a pipe
        const pipeCollision = () => {
            // goes through every pipe
            for (i = 0; i < pipes.length; i++) {
                // pipes[i].width / 2 is to get the edge of the pipe

                // skips all the pipes that are not next to the bird
                if (
                    pipes[i].x + pipes[i].width / 2 < bird.x ||
                    pipes[i].x > bird.x + pipes[i].width / 2
                ) {
                    // first line: if the pipe is behind the bird: skip
                    // second line: if the pipe is in front the bird: skip
                    continue;
                }

                // if the bird is on a pipe then game over
                if (
                    bird.x + 7 >= pipes[i].x &&
                    bird.x - 7 <= pipes[i].x + pipes[i].width &&
                    bird.y >= pipes[i].y
                ) {
                    gameOver();
                } else if (
                    Math.ceil(bird.x) === Math.ceil(pipes[i].x + pipes[i].width / 2)
                ) {
                    // if the whole number of the bird location is the same as the right side edge of the pipe then you get a point
                    score++;
                }
            }
        };

        // Game over
        const gameOver = () => {
            // makes a dialog (popup)
            alert("Game Over! Your score: " + score.toString() + ".");

            // resets the game
            bird.y = canvas.height / 2;
            bird.dy = 0;
            bird.d2y = 0;
            gameStart = false;
            pipes = [];
            spaceUntilNextPipe = 0;
            flapTimer = 0;
            score = 0;

            // TODO make this go back to home screen
        };

        // The game loop
        const drawGame = () => {
            // draws the main canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // draw the bird and its location
            drawBird();

            // only runs if the game is playing
            if (gameStart) {
                addPipe();
                drawPipe();
                borderCollision();
                pipeCollision();
            }

            // calls draw game many times per second (to make game run)
            requestAnimationFrame(drawGame);
        };

        // checks if the space bar is clicked and then does stuff
        const keyDownHandler = (e) => {
            if (e.keyCode === 38 || e.keyCode === 32) {
                // if the game hasn't started, itl start the game
                if (!gameStart) {
                    // starts the game
                    bird.d2y = 0.1;
                    gameStart = true;
                }

                if (flapTimer <= 0) {
                    // negative speed so you go up
                    bird.dy = -3;

                    // time until you can go up again (flap again)
                    flapTimer = 10;
                }
            }
        };

        // this is listening for if a key is pressed.
        document.addEventListener("keydown", keyDownHandler, false);

        // starts the whole game.

        drawGame();
    }, []);

    return (
        <canvas className="canvas" id="capyCanvas" width="700px" height="500px" />
    );



}


