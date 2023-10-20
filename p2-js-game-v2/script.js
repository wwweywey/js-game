const gameElement = document.querySelector('.game');
const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');
const ball = document.getElementById('ball');
const playerOneScoreBar = document.getElementById('playerOneScore');
const playerTwoScoreBar = document.getElementById('playerTwoScore');
const menuButton = document.querySelectorAll('button');
const overlayMenu = document.querySelectorAll('.overlayMenu');
const backgroundAudio = document.getElementById('backgroundAudio');
const gameWidth = 800
const gameHeight = 400
const paddleHeight = 120;
const paddleSpeed = 50;
const timeLimit = 10;

let gameStarted = false;
let leftPaddleY = gameHeight / 2 - paddleHeight / 2;
let rightPaddleY = gameHeight / 2 - paddleHeight / 2;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let leftBorderColor = 'red';
let rightBorderColor = 'red';
let timerCounter = 0;
let timerInterval = null;
let ballSpeedX = 10;
let ballSpeedY = 10;
let score = {
    left: 0,
    right: 0
};

backgroundAudio.play();
backgroundAudio.volume = 0.3;

function update() {

    if (gameStarted) {
        moveBall();
    }

    if (ballY <= 0 || ballY + 20 >= gameHeight) {
        ballSpeedY = -ballSpeedY;

        if (ballY <= 0) {
            ballY = 0;
        } else {
            ballY = gameHeight - 20;
        }
    }

    if (
        ballX <= 35 &&
        ballY + 20 >= leftPaddleY &&
        ballY <= leftPaddleY + paddleHeight
    ) {
        ballSpeedX = Math.abs(ballSpeedX);
        winningPaddle = 'left';
    } else if (
        ballX + 20 >= gameWidth - 35 &&
        ballY + 20 >= rightPaddleY &&
        ballY <= rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -Math.abs(ballSpeedX);
        winningPaddle = 'right';
    }

    if (ballY < 0) {
        ballY = 0;
    } else if (ballY + 20 > gameHeight) {
        ballY = gameHeight - 20;
    }

    const { left, right } = score;

    if (ballX <= 0) {
        score = { ...score, right: right + 1 };
        leftBorderColor = 'red';
        rightBorderColor = 'green';
        resetGame('right');
    } else if (ballX + 20 >= gameWidth) {
        score = { ...score, left: left + 1 };
        leftBorderColor = 'green';
        rightBorderColor = 'red';
        resetGame('left');
    }

    if (timerCounter >= timeLimit) {
        if (score.left === score.right) {
            leftBorderColor = 'red';
            rightBorderColor = 'red';
        } else if (score.left > score.right) {
            leftBorderColor = 'green';
            rightBorderColor = 'red';
        } else {
            leftBorderColor = 'red';
            rightBorderColor = 'green';
        }
    }

    gameElement.style.borderLeft = `5px solid ${leftBorderColor}`;
    gameElement.style.borderRight = `5px solid ${rightBorderColor}`;

    startTimer()

    requestAnimationFrame(update);

    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';

}
update();
moveBall()

function moveBall() {
    if (gameStarted) {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
    }
}

function onStartGame(event) {

    if (event.code === 'Space') {
        gameStarted = true;
        moveBall();
        startGameOverlay();
    }
}

function onSpaceKeyDown(event) {
    if (gameStarted && event.code === 'Space' && winningPaddle) {
        winningPaddle = null;
        ballSpeedX = Math.random() > 0.5 ? 10 : -10;
        ballSpeedY = 5;

        if (ballX < gameWidth / 2) {
            if (gameBorderColor === 'red') {
                score.right++;
            }
        } else {
            if (gameBorderColor === 'red') {
                score.left++;
            }
        }
    }
}

function startTimer() {
    timerInterval = setInterval(function () {
        timerCounter++;
        if (timerCounter >= 3) {
            clearInterval(timerInterval);
            return;
        }
    }, 3000);
}

function resetGame(winner) {

    ballY = gameHeight / 2 - 20;
    ballSpeedX = 0;
    ballSpeedY = 0;

    if (winner === 'left') {
        ballX = 30;
    } else {
        ballX = gameWidth - 30 - 20;
    }

    leftPaddleY = gameHeight / 2 - paddleHeight / 2;
    rightPaddleY = gameHeight / 2 - paddleHeight / 2;

    leftBorderColor = 'red';
    rightBorderColor = 'red';

}

function onKeyDown(event) {

    if (event.key === 'w') {
        leftPaddleY = Math.max(leftPaddleY - paddleSpeed, 0);
        ball.style.top = leftPaddleY + 'px';
    } else if (event.key === 's') {
        leftPaddleY = Math.min(leftPaddleY + paddleSpeed, gameHeight - paddleHeight);
        ball.style.top = leftPaddleY + 'px';
    } else if (event.key === 'ArrowUp') {
        rightPaddleY = Math.max(rightPaddleY - paddleSpeed, 0);
        ball.style.top = rightPaddleY + 'px';
    } else if (event.key === 'ArrowDown') {
        rightPaddleY = Math.min(rightPaddleY + paddleSpeed, gameHeight - paddleHeight);
        ball.style.top = rightPaddleY + 'px';
    }
}

function startGameOverlay() {

    const overlay = document.querySelector('#titleOverlay');
    const menu = document.querySelector('#menuButton');

    overlay.style.visibility = 'hidden';
    menu.style.visibility = 'visible';

}


function showOverlay() {
    const overlay = document.querySelectorAll('#overlayMenu');

    if (overlay.length > 0) {
        const computedStyle = getComputedStyle(overlay[0]);

        if (computedStyle.visibility === 'visible') {
            overlay[0].style.visibility = 'hidden';
        } else {
            overlay[0].style.visibility = 'visible';
        }
    }
}

function quitGame() {

    score.left = 0;
    score.right = 0;

    ballX = gameWidth / 2;
    ballY = gameHeight / 2;

    hideOverlay();
}
function hideOverlay() {
    const overlay = document.querySelector('#overlayMenu');
    overlay.style.visibility = 'hidden';
}
function resetButton() {
    const overlay = document.querySelector('#overlayMenu');

    overlay.style.visibility = 'hidden';
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballColor = 'green';

}

document.addEventListener('keydown', onStartGame);
document.addEventListener('keydown', onKeyDown);

const quitButton = document.querySelector('#quitButton');
quitButton.addEventListener('click', quitGame);

const resetBttn = document.querySelector('#resetButton');
resetBttn.addEventListener('click', resetButton);

