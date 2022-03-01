var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };
var canvas = document.createElement('canvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
canvas.style = "position:absolute; left: 50%; width: 400px; margin-left: -200px; margin-top: +50px;";
var context = canvas.getContext('2d');
let score = 0;
var brickWidth = 50;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30 
var brickOffsetLeft = 30;
var playing = false;
var level = -1;
var lives = 3;
var practice = false;
var hyperSensitive = false;
var antigravityball = false;
var slowBall = false;
var schlongPaddle = false;
var schortPaddle = false;
var currentpowerup = ""

// Win Condition
var stroudoniaBuff = false;

window.onload = function() 
{
    document.body.appendChild(canvas);
    document.getElementById("practice").addEventListener("click", startPractice);
    document.getElementById("game").addEventListener("click", startGame);
}

function startPractice() 
{
  practice = true;
  if(!playing)
  {
    animate(step);
    playing = true;
    level = 0;
  }
  if(level==0)
  {
    level = 5;
    loadlevel(9,6);
  }
  level = ": Practice";
  lives = 99999999;
}
function startGame()
{
  if(!playing)
  {
    animate(step);
    playing = true;
    level = 1;
  }
  if(level==1)
  {
    loadlevel(1,5);
  }
}
function nextLevel()
{
  if(practice)
  {
    loadlevel(1,1);
  }
  if(!practice)
  {
    level += 1;
    if(level>5)
    {
      playing = false;
      winGame();
    }
    if(level==2)
    {
      loadlevel(2,5);
    }
    if(level==3)
    {
      loadlevel(3,5);
    }
    if(level==4)
    {
      loadlevel(4,5);
    }
    if(level==5)
    {
      loadlevel(5,5);
    }
  }
}
var render = function() 
{
  context.fillStyle = "#1C1C1E";
  context.fillRect(0, 0, width, height);
  player.render();
  ball.render();
  drawBricks();
  drawScore();
}
function winGame()
{
  context.font = '32px Calibri';
  context.fillStyle = "#C724B1";
  context=null;
  alert('Victory! You Win!');
}
function winGameStroud()
{
  context.font = '32px Calibri';
  context.fillStyle = "#C724B1";
  context=null;
  alert('Stroudonia has blessed you! You Instantly Win!');
}
function drawScore() 
{
  context.font = "19px Calibri";
  context.fillStyle = "#C724B1";
  context.fillText("Score: "+score, 8, 20);
  context.fillText("Health: "+lives, 325, 20);
  drawPowerUp(); 
  context.font = "19px Calibri";
  context.fillStyle = "#C724B1";
  if(practice)
    context.fillText('Practice Mode', 135, 20);
  else
    context.fillText('Level '+level, 175, 20);
}
var step = function()
{
  if(lives>0)
  {
    // console.log('1');
    update();
    render();
    animate(step);
    collisionDetection();
  }
  else
  {
    context.font = '32px Calibri';
    context.fillStyle = "#C724B1";
    context.fillText('Game Over.', 50, canvas.height/2);
  }
}
var bricks = [];
var brickRowCount = 0;
var brickColumnCount = 0;
function loadlevel(rows,cols)
{
  brickRowCount = rows;
  brickColumnCount = cols;
  for(var c=0; c<brickColumnCount; c++) 
  {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) 
    {
      temp = getRandomInt(1,level+1);
      bricks[c][r] = { x: 0, y: 0 ,status: temp};
    }
  }
}
function getRandomInt(min, max) 
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function drawBricks() 
{
  clearchecker = 0;
  for(var c=0; c<brickColumnCount; c++) 
  {
      for(var r=0; r<brickRowCount; r++) 
      {
          if(bricks[c][r].status >0) 
          {
              var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
              var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
              bricks[c][r].x = brickX;
              bricks[c][r].y = brickY;
              context.beginPath();
              context.rect(brickX, brickY, brickWidth, brickHeight);
              if(bricks[c][r].status == 1)
              {
                context.fillStyle = "#0095DD";
              }
              else if(bricks[c][r].status == 2)
              {
                context.fillStyle = "#0DFB84";
              }
              else if(bricks[c][r].status == 3)
              {
                context.fillStyle = "#BEFB0D";
              }
              else if(bricks[c][r].status == 4)
              {
                context.fillStyle = "#FBB30D";
              }
              else if(bricks[c][r].status == 5)
              {
                context.fillStyle = "#FB0D0D";
              }
              context.fill();
              context.closePath();
              clearchecker = 1;
          }
      }
  }
  if(clearchecker == 0)
    nextLevel();
}

function Paddle(x, y, width, height) 
{
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() 
{
  context.fillStyle = "#0000FF";
  context.fillRect(this.x, this.y, this.width, this.height);
}
function Player() 
{
  this.paddle = new Paddle(175, 580, 50, 10);
}
Player.prototype.render = function() 
{
  this.paddle.render();
}
function Ball(x, y) 
{
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 5;
}

Ball.prototype.render = function() 
{
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  context.fillStyle = "#C724B1";
  context.fill();
}
var player = new Player();
var ball = new Ball(200, 300);

Ball.prototype.update = function(paddle1) 
{
  if(hyperSensitive)
  {
    this.x += this.x_speed*2;
    this.y += this.y_speed*2;
  }
  if(slowBall)
  {
    this.x += this.x_speed*0.25;
    this.y += this.y_speed*0.25;
  }
  else
  {
    this.x += this.x_speed*0.65;
    this.y += this.y_speed*0.65;
  }
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;
  if(this.y>canvas.width-100 && antigravityball)
  {
    this.y_speed =-this.y_speed;
  }
  if(this.y<0)
  {
    this.y = 0;
    this.y_speed = -this.y_speed
  }
  if(this.x - 5 < 0) 
  { 
    // hitting the left wall
    this.x = 5;
    this.x_speed = -this.x_speed;
  } 
  else if(this.x + 5 > 400) 
  { 
    // hitting the right wall
    this.x = 395;
    this.x_speed = -this.x_speed;
  }
  if(this.y > 600) 
  { 
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
    // console.log("Hit Bot");
    lives -= 1;
  }
  if(top_y > 300) 
  {
    if(top_y <= (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) 
    {
      // hit the player's paddle
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
    }
  }
}
var update = function() 
{
  ball.update(player.paddle);
}
document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) 
{
  // hyperSensitive = true;
  // hyperMouse = true;
  var relativeX = e.clientX - canvas.offsetLeft;
  if(!hyperSensitive && relativeX > 0 && relativeX < canvas.width) 
  {
    player.paddle.x_speed = player.paddle.x-relativeX;
    player.paddle.x = relativeX;
  }
  else if(hyperSensitive && relativeX > 0 && relativeX < canvas.width)
  {
    player.paddle.x_speed = player.paddle.x-relativeX;
    player.paddle.x = relativeX;
  }
  if(player.paddle.x < 0)
  {
    player.paddle.x = 0;
    player.paddle.x_speed = 0;
  }
  if (player.paddle.x + player.paddle.width > 400) 
  { 
    player.paddle.x = 400 - player.paddle.width;
    player.paddle.x_speed = 0;
  }
}
Paddle.prototype.move = function(x, y) 
{
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) 
  { 
    // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } 
  else if (this.x + this.width > 400) 
  { 
    // all the way to the right
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
}
var poweruptimes = 0;
function collisionDetection() 
{
  
  for(var c=0; c<brickColumnCount; c++) 
  {
      for(var r=0; r<brickRowCount; r++) 
      {
          var b = bricks[c][r];
          if(b.status >= 1) 
          {
              if(ball.x > b.x && ball.x < b.x+brickWidth && ball.y > b.y && ball.y < b.y+brickHeight) 
              {
                if(level>1 || level==": Practice")
                {
                  temp = getRandomInt(1,20);
                  if(temp==1)
                  {
                    hyperSensitive = true;
                    drawPowerUp();
                    slowBall = false;
                    currentpowerup = "hyper sensitivity";
                  }
                  if(temp==2)
                  {
                    slowBall = true;
                    drawPowerUp();
                    hyperSensitive = false;
                    currentpowerup = "time slows down!!"
                  }
                  // if(temp==3)
                  // {
                  //   schlongPaddle = true;
                  //   drawPowerUp("longer paddle!");
                  // }
                  // if(temp==4)
                  // {
                  //   schortPaddle = true;
                  //   drawPowerUp("shorter paddle!");
                  // }
                  if(temp==5)
                  {
                    if(getRandomInt(1,100)<5)
                    {
                      drawPowerUp();
                      currentpowerup = "Stroudonia Boost: Instant Win!"
                      winGameStroud();
                    }
                  }
                  else if(poweruptimes>3)
                  {
                    currentpowerup = "";
                    hyperSensitive = false;
                    slowBall = false;
                    poweruptimes = 0;
                  }
                }
                tempstatus = b.status-1;
                ball.y_speed = -ball.y_speed;
                bricks[c][r] = { x: 0, y: 0 , status: tempstatus};
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                if(tempstatus == 0)
                {
                  context.beginPath();
                  context.rect(brickX, brickY, brickWidth, brickHeight);
                  context.fillStyle = "#808080";
                  context.fill();
                  context.closePath();
                }
                score += 1;
                poweruptimes += 1;
              }
          }
      }
  }
}
function drawPowerUp() 
{
  context.font = "30px Calibri";
  context.fillStyle = "#C724B1";
  context.fillText(currentpowerup, 50, canvas.width/2+200);
}