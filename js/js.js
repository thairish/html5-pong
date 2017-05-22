//Variables needed throughout the program
var canvas = document.getElementById( "gameCanvas" );
var ctx = canvas.getContext( "2d" );

var ballX = 20;
var ballY = 5;
var ballSpeedX = 10;
var ballSpeedY = 7;
var ballRadius = 5;
var ballWidthHeight = 10;

var paddleBallColour = "#ffffff";

var backgroundColour = "#000000";

var paddleWidth = 10;
var paddleHeight = 100;
var paddleLeft = 20;
var paddleRight = canvas.width - 30;
var yPaddleRight = (canvas.height - paddleHeight) / 2; //Starting in center for the computer
var yPaddleLeft; //Calculated from mouse event
var paddleLeftEdge = (paddleLeft + paddleWidth) + (ballRadius / 2);
var paddleRightEdge = (paddleRight - paddleWidth) + (ballRadius / 2);
var paddleRightSpeed = 10;
var differenceFromPaddleCenter = 35; //Used to help stop the computer chasing the ball when it's near

var netWidth = 5;
var netHeight = 20;
var netPaddingIncrement = 40;
var netColour = "#3f3f3f";
var xAlignNet = (canvas.width / 2) ;

var winningScore = 3;
var playerOneScore = 0;
var playerTwoScore = 0;
var differenceY; //Used to determine the speed of the ball when it hits the edge of a paddle

var showWinningScreen = false;
var winningScreenColour = "#ffffff";
var scoreColour = "#3f3f3f";
var winningScoreTextMarginBottom = 20;
var winningScoreText;

window.onload = function() {
  var framesPerSecond = 30;

  setInterval( function() {
    drawShapes();
    moveShapes();
  }, 1000 / framesPerSecond );

  canvas.addEventListener( "mousemove", function( evt ) {
    var mousePosition = calculateMousePosition( evt );
    yPaddleLeft = mousePosition.y - (paddleHeight / 2); //Get the mouse in the middle of the paddle
  });

  canvas.addEventListener( "mousedown", function( evt ) {
    if( showWinningScreen ) {
      showWinningScreen = false;
      playerOneScore = 0;
      playerTwoScore = 0;
      drawShapes();
    }
  });
};

function computerMovement() {
  var paddleRightCenter = yPaddleRight + (paddleHeight / 2);

  if( paddleRightCenter < ballY - differenceFromPaddleCenter ) {
    yPaddleRight += paddleRightSpeed;
  } else if( paddleRightCenter > ballY + differenceFromPaddleCenter ) {
    yPaddleRight -= paddleRightSpeed;
  }
}

function ballReset() {
  if( playerOneScore >= winningScore || playerTwoScore >= winningScore ) {
    var winningPlayer = ( playerOneScore >= winningScore ? "Player One" : "Player Two" );
    winningScoreText = winningPlayer + " won the game. The final score was ";
    winningScoreText += ( playerOneScore >= winningScore ? playerOneScore + "-" + playerTwoScore + "." : playerTwoScore + "-" + playerOneScore + "." );
    playerOneScore = 0;
    playerTwoScore = 0;
    showWinningScreen = true;
  }

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}

function calculateMousePosition( evt ) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  };
}

function moveShapes() {
  //Set ball positions
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  computerMovement();

  /* Check if the ball hits the left paddle edge and bounces it back or if it
   * passes the left paddle onto the edge reset the ball as a point has been scored.
   */
  if(
    ballX < paddleLeftEdge &&
    ballY > yPaddleLeft &&
    ballY < yPaddleLeft + paddleHeight
    ) {
      ballSpeedX = - ballSpeedX;

      differenceY = ballY - (yPaddleLeft + paddleHeight / 2);
      ballSpeedY = differenceY * 0.33;
    }

  if( ballX < 0 ) {
    playerTwoScore++; //Must be before ballReset() is called or winning condition will not work
    ballReset();
  }

  /* Check if the ball hits the right paddle edge and bounces it back or if it
   * passes the right paddle onto the edge reset the ball as a point has been scored.
   */
  if(
    ballX > paddleRightEdge &&
    ballY > yPaddleRight &&
    ballY < yPaddleRight + paddleHeight
    ) {
      ballSpeedX = - ballSpeedX;

      differenceY = ballY - (yPaddleRight + paddleHeight / 2);
      ballSpeedY = differenceY * 0.33;
    }

  if( ballX > canvas.width ) {
    playerOneScore++; //Must be before ballReset() is called or winning condition will not work
    ballReset();
  }

  //Allows the ball to bounce vertically
  if( ballY > canvas.height ) {
    ballSpeedY = -ballSpeedY;
  }

  if( ballY < 0 ) {
    ballSpeedY = -ballSpeedY;
  }

}

function drawShapes() {
  if( showWinningScreen ) {
    var newGameText = "Click the screen to start a new game.";
    var newGameTextX = (canvas.width / 2) - (ctx.measureText( newGameText ).width / 2);
    var winningTextX = (canvas.width / 2) - (ctx.measureText( winningScoreText ).width / 2);
    var newGameTextY = (parseInt( ctx.font ) * 2) * (0.5) + (canvas.height * 0.5); //parseInt is used to get height of the text
    var winningTextY = (parseInt( ctx.font ) * 0.5 ) + (canvas.height * 0.5) - (winningScoreTextMarginBottom); //parseInt is used to get height of the text

    ctx.fillStyle = backgroundColour;
    ctx.fillRect( 0, 0, canvas.width, canvas.height );

    ctx.fillStyle = winningScreenColour;
    ctx.font = "30px Calibri";
    ctx.fillText( winningScoreText, winningTextX, winningTextY );
    ctx.fillText( newGameText, newGameTextX, newGameTextY );

    return;
  }

  //Sequential drawing
  var netPadding = 10; //Starts at 10 to give start and end padding

  //Background shape
  ctx.fillStyle = backgroundColour;
  ctx.fillRect( 0, 0, canvas.width, canvas.height );

  //Player one score
  var playerScoreLeftX = (canvas.width / 4) - (ctx.measureText( playerOneScore ).width / 2);
  var playerScoreRightX = (canvas.width) - (canvas.width / 4) - (ctx.measureText( playerTwoScore ).width / 2);
  var playerScoreY = (parseInt( ctx.font ) * 0.2 ) + (canvas.height * 0.2); //parseInt is used to get height of the text

  ctx.fillStyle = scoreColour;
  ctx.font = "100px Calibri";
  ctx.fillText( playerOneScore, playerScoreLeftX, playerScoreY );

  //Player two score
  var playerRightX = (canvas.width) - (canvas.width / 4) - (ctx.measureText( playerTwoScore ).width / 2);
  ctx.fillText( playerTwoScore, playerScoreRightX, playerScoreY );

  //Left player shape
  ctx.fillStyle = paddleBallColour;
  ctx.fillRect( paddleLeft, yPaddleLeft, paddleWidth, paddleHeight );

  //Right player shape
  ctx.fillStyle = paddleBallColour;
  ctx.fillRect( paddleRight, yPaddleRight, paddleWidth, paddleHeight );

  //Net shapes
  for( var i=0; i<canvas.height/netPaddingIncrement; i++ ) {
    ctx.fillStyle = netColour;
    ctx.fillRect( xAlignNet, netPadding, netWidth, netHeight );
    netPadding += netPaddingIncrement;
  }

  //Ball shape
  createCircle( ballX, ballY, ballRadius, paddleBallColour );
}

function createCircle( centerX, centerY, radius, ballColour ) {
  ctx.fillStyle = ballColour;
  ctx.beginPath();
  ctx.arc( centerX, centerY, radius, 0, 2 * Math.PI );
  ctx.fill();
}
