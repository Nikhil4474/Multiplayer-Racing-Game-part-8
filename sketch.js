var canvas;
var backgroundImage, bgImg, car1_img, car2_img, track;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2, cars;
var cars = [];
var fuelImage, coinImage;
var fuelGroup, coinGroup;
var lifeImage
var obstacle1, obstacle2
var obstacles1Group;
var obstacles2Group;
var blastImage;
//BP
function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1_img = loadImage("assets/car1.png");
  car2_img = loadImage("assets/car2.png");
  track = loadImage("assets/track.jpg");
  fuelImage = loadImage("assets/fuel.png");
  coinImage = loadImage("assets/goldCoin.png")
  lifeImage = loadImage("assets/life.png");
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  blastImage = loadImage("assets/blast.png");
}

//BP
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  console.log(width);
  console.log(height)
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  // game.handleElements();
 
}

//BP
function draw() {
  background(backgroundImage);
  if(playerCount === 2) {
    game.updateState(1);
  }

  if (gameState === 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
