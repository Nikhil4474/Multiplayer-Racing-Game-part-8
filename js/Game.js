class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderBoardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.leftKeyActive = false;
  }
  //BP
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
      // console.log(gameState);
    });
  }
  //BP
  updateState(state) {
    database.ref("/").update({
      gameState: state,
    });
  }

  // TA
  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    // Creat Car 1
    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.addImage("blast", blastImage)
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car1.addImage("blast", blastImage)
    car2.scale = 0.07;

    cars = [car1, car2];

    fuelGroup = new Group();
    coinGroup = new Group();
    obstacles1Group = new Group();
    obstacles2Group = new Group();

    // function call
    this.addSprites(fuelGroup, 30, fuelImage, 0.02);
    this.addSprites(coinGroup, 20, coinImage, 0.15);
    this.addSprites(obstacles1Group, 4, obstacle1, 0.05);
    this.addSprites(obstacles2Group, 4, obstacle2, 0.05);
  }

  addSprites(spriteGroup, numSprites, SpriteImg, SpriteScale) {
    for (var i = 0; i < numSprites; i++) {
      var x, y;
      y = random(-height * 5, height - 100);
      x = random(width / 2 + 150, width / 2 - 150);
      var sprite = createSprite(x, y);
      sprite.addImage("Sprite", SpriteImg);
      sprite.scale = SpriteScale;
      spriteGroup.add(sprite);
    }
  }

  handleFuel(carsIndex) {
    cars[carsIndex - 1].overlap(fuelGroup, function (collector, collider) {
      if (player.fuel <= 180) {
        player.fuel += 20;
      }
      player.update();
      collider.remove();
      // console.log("Fuel Removed");
    });

    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3;
    }
    if (player.fuel < 0) {
      gameState = 2;
      this.gameOver();
    }
  }
  handleCoin(coinsIndex) {
    cars[coinsIndex - 1].overlap(coinGroup, function (collector, collider) {
      if (player.score <= 180) {
        player.score += 20;
      }
      player.update();
      collider.remove();
      // console.log("Coin Removed");
    });

    if (player.score > 0 && this.playerMoving) {
      player.score -= 0.3;
    }
    if (player.score < 0) {
      gameState = 2;
      // this.gameOver();
    }
  }

  // BP
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Restart Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 520, height / 2 - 400);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 450, height / 2 - 400);

    this.leaderBoardTitle.html("Leader Board");
    this.leaderBoardTitle.class("resetText");
    this.leaderBoardTitle.position(width / 2 - 720, height / 2 - 300);

    this.leader1.class("Leader1Text");
    this.leader1.position(width / 2 - 715, height / 2 - 250);

    this.leader2.class("leader2Text");
    this.leader2.position(width / 2 - 715, height / 2 - 200);
  }

  // //SA
  play() {
    // Function calls

    this.handleElements();
    this.handleResetButton();
    Player.getPlayerInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      // image(x,y,w,h)
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderBoard();
      this.showLife();
      this.showFuel();

      // for loop to get individual player index
      var index = 0;
      for (var i in allPlayers) {
        // console.log(i)
        // by using database getting x and y direction of allPlayers(i)
        var x = allPlayers[i].positionX;
        var y = height - allPlayers[i].positionY;
        // console.log(y);

        
        // increasing index
        index = index + 1;
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

// Changing anmation to blast when lifetime
        var currentLife = allPlayers[i].life
        if(currentLife<=0){
          cars[index-1].changeImage("blast", blastImage)
          cars[index-1].scale=0.3
        }

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          textSize(30);
          fill("black");
          textAlign(CENTER);
          text(player.name, x, y + 80);

          // camera.position.x=cars[index-1].position.x
          camera.position.y = cars[index - 1].position.y;

          console.log(player.index);
          this.handleFuel(index);
          this.handleCoin(index);
          this.handleObstacles(index);

          // if(cars[index-1].collide(obstacle1) || cars[index-1].collide(obstacle2)){
          //   console.log("collided")
          // }

          // this.handleObstacles2(index)
        }
      }

      // Move Car up
      if (keyIsDown(UP_ARROW)) {
        this.playerMoving = true;
        player.positionY += 10;
        player.update();
      }
      // // Move car down
      // if (keyIsDown(DOWN_ARROW)) {
      //   this.playerMoving = true
      //   player.positionY -= 10;
      //   player.update();
      // }
      // Move car right
      if (keyIsDown(RIGHT_ARROW) && player.positionX < 1250) {
        this.playerMoving = true;
        this.leftkey = false;
        player.positionX += 10;
        player.update();
      }
      // Move car left
      if (keyIsDown(LEFT_ARROW) && player.positionX > 550) {
        this.playerMoving = true;
        this.leftkey = true;
        player.positionX -= 10;
        player.update();
      }

      const finishLine = height * 6 - 100;
      if (player.positionY > finishLine) {
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"} Rank${"\n"}${
        player.rank
      }\n Score${"\n"}${Math.round(player.score)}`,
      text: "You reached the finish line",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok",
    });
  }

  gameOver() {
    swal({
      title: "Game over",
      text: "Oh No! You Lost!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Ok",
    });
  }

  carCrash() {
    swal({
      title: "Game over",
      text: "Oh No! You Crashed Into An Obstacle",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Ok",
    });
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        players: {},
        CarsAtEnd: 0,
      });
      window.location.reload();
    });
  }

  showLeaderBoard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    // console.log(players)

    // if first player rank is 0
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }
    // if second player rank is 1
    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 100, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 100, 180, 20);
    fill("red");
    rect(width / 2 - 100, height - player.positionY - 100, player.life, 20);
    noStroke();
    pop();
  }

  showFuel() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 140, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 140, 180, 20);
    fill("yellow");
    rect(width / 2 - 100, height - player.positionY - 140, player.fuel, 20);
    noStroke();
    pop();
  }

  handleObstacles(index) {
    // Sprite.collide(target)
    if (cars[index - 1].collide(obstacles1Group) || cars[index - 1].collide(obstacles2Group)) {
      if(this.leftkey){
        player.positionX+=100
      }
      else{
        player.positionX-=100
      }

      if (player.life > 0 && this.playerMoving) {
        player.life -= 185 / 4;
        console.log("Collided");
      }
      player.update();
      if (player.life <= 0) {
        gameState = 2;
        this.carCrash();
      }
    }
  }

// if(playerLife <= 0){
//   // this.gameover
// }
}