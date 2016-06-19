/*
	TO DO:
	*** prettiness ***
	{x} make title prettier
	{x} make bows
	{x} make cleo
	{x} make smokes
	{x} make nixey
	{x} make bubbs
	{x} timer
		{ } round the number down by like 10 or 100
	{x} points
	{x} game over mode (prettification)
	{x} about

	*** basics ***
	{x} show picture of cat on board
	{x} clicking picture of cat functionality
	{x} moving around img
	{?} resizing img 
	{x} bounds for bow
	{x} points
	{x} timer
	{x} speed up kitty
	{x} game over
	{x} work on kinks with pinning kitty ?
	{ } high scores ???
	{x} support for WASD
	{x} back from about mode
	{x} pause game if about mode is open
*/


/*
    var cleo = "https://scontent-a-sjc.xx.fbcdn.net/hphotos-prn2/t1/9744_196134797226042_1136239650_n.jpg";
	var nixon = "https://scontent-b-sjc.xx.fbcdn.net/hphotos-ash3/t1/21402_187954384710750_308514796_n.jpg";
	var bubbs = "https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash3/t1/11344_132610980245091_984962260_n.jpg";
	kitties
	http://makepixelart.com/peoplepods/files/images/878168.original.png
	bows
	http://makepixelart.com/peoplepods/files/images/1113465.original.png
*/
$(document).ready(function()    {

    /**** initializing the game ****/
    function populate_cat_images()    {
		cats = [];
		cats[0] = "./assets/pin-the-bow/clee.png";
		cats[1] = "./assets/pin-the-bow/nixy.png";
		cats[2] = "./assets/pin-the-bow/bubb.png";
		cats[3] = "./assets/pin-the-bow/smok.png";
		return cats;
    };

    function populate_bow_images()    {
        bows = [];
        bows[0] = "http://s6.postimg.org/4w2s6ly0t/bt1.png";
        bows[1] = "http://s6.postimg.org/96hg2733x/bt2.png";
        bows[2] = "http://s6.postimg.org/p603lqz5p/bt3.png";
        bows[3] = "http://s6.postimg.org/jfo5wmc8t/bt4.png";
        bows[4] = "http://s6.postimg.org/4na9dsrjx/bt5.png";
        bows[5] = "http://s6.postimg.org/ntnggz81p/bt6.png";
        return bows;
    };

    var cat_imgs = populate_cat_images();
    var bow_imgs = populate_bow_images();
    var round = {};
    var score = 0;
    var level = 0;

    var ctx = $('canvas')[0].getContext("2d");
    var canvas_h = 500;
    var canvas_w = 500;
    var cat_h = 100;
    var cat_w = 125;
    var bow_h = 30;
    var bow_w = 50;
    var num_cats = 4;
    var num_bows = 6;    
    var timer;

    function start_game()	{
    	$('#a').show();
    	$('#score_board').show();
    	main();
    }

    /**** gameplay functions ****/

/* Background image
	var bgReady = false;
	var bgImage = new Image();
	bgImage.onload = function () {
		bgReady = true;
	};
	bgImage.src = "images/background.png";
*/

	// bow image (player)
	var bowReady = false;
	var bowImage = new Image();
	bowImage.onload = function () {
		bowReady = true;
	};
	bowImage.src = bow_imgs[0];

	// kitty image
	var catReady = false;
	var catImage = new Image();
	catImage.onload = function () {
		catReady = true;
	};
	catImage.src = cat_imgs[0];

	// Game objects
	var bow = {
		speed: 256 // movement in pixels per second
	};
	var cat = {};
	var catsPinned;

	// Handle keyboard controls
	var keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

	var catTouchingBow = function()	{
		if (
			bow.x <= (cat.x + 100)
			&& cat.x <= (bow.x + 100)
			&& bow.y <= (cat.y + 100)
			&& cat.y <= (bow.y + 100)
		)
			return true;
		return false;
	}
	// Reset the game when the player catches a cat
	var reset = function () {
		bow.x = canvas_w / 2;
		bow.y = canvas_h / 2;

		// Throw the cat somewhere on the screen randomly
		cat.x = 32 + (Math.random() * (canvas_w - 157));
		cat.y = 0 + (Math.random() * (canvas_h - 100));

		// ensure the cat isn't already touching the bow
		while (catTouchingBow())	{
			cat.x = 32 + (Math.random() * (canvas_w - 157));
			cat.y = 0 + (Math.random() * (canvas_h - 100));			
		}


		bowImage.src = bow_imgs[Math.floor(Math.random()*num_bows)];
		catImage.src = cat_imgs[Math.floor(Math.random()*num_cats)];
	};

	var moveKitty = function(speed, dir_x, dir_y)	{
		if (cat.x <= 0 || cat.x >= canvas_w - cat_w)	{
			dir_x *= -1;
		}
		if (cat.y <= 0 || cat.y >= canvas_h - cat_h)	{
			dir_y *= -1;
		}
		cat.x += dir_x * speed;
		cat.y += dir_y * speed;
		return [dir_x, dir_y];
	}

	var moveBow = function(modifier)	{
		if ((38 in keysDown || 87 in keysDown) && bow.y > 0) { // Player holding up
			bow.y -= bow.speed * modifier;
		}
		if ((40 in keysDown || 83 in keysDown) && bow.y < canvas_h - bow_h) { // Player holding down
			bow.y += bow.speed * modifier;
		}
		if ((37 in keysDown || 65 in keysDown) && bow.x > 0) { // Player holding left
			bow.x -= bow.speed * modifier;
		}
		if ((39 in keysDown || 68 in keysDown) && bow.x < canvas_w - bow_w) { // Player holding right
			bow.x += bow.speed * modifier;
		}
	}

	// Update game objects
	var update = function (modifier, kittySpeed, dir_x, dir_y) {
		moveBow(modifier);
		// Are they touching?
		if (
			bow.x <= (cat.x + 100)
			&& cat.x <= (bow.x + 100)
			&& bow.y <= (cat.y + 100)
			&& cat.y <= (bow.y + 100)
		) {
			++catsPinned;
			$('#points').html(catsPinned);
			if (catsPinned % 5 == 0)	{
				catSpeed += 0.2;
			}
			reset();
		}

		// move kitty
		return moveKitty(kittySpeed, dir_x, dir_y);
	};

	// Draw everything
	var render = function () {
		// todo: background
		// if (bgReady) {
		// 	ctx.drawImage(bgImage, 0, 0);
		// }

		ctx.clearRect(0,0,canvas_w,canvas_h);

		if (bowReady) {
			ctx.drawImage(bowImage, bow.x, bow.y);
		}

		if (catReady) {
			ctx.drawImage(catImage, cat.x, cat.y);
		}
	};

	var gameOver = function()	{
		clearInterval(refreshIntervalId);
		gameOn = false;
		$('#a').hide();
    	$('#score_board').hide();
    	$('#game_score').html("You pinned " + catsPinned + " cats this round!");
    	$('#game_over').show();
	};

	// The main game loop
	var mainLoop = function () {
		var now = Date.now();
		var delta = now - then;

		newDir = update(delta / 1000, catSpeed, dirX, dirY);
		dirX = newDir[0];
		dirY = newDir[1];		
		render();

		then = now;
		timer -= delta;
		if (timer <= 0)	{
			gameOver();
		}
		$('#timer').html(timer);
	};

	var then;
	var dirX;
	var dirY;
	var catSpeed;
	var refreshIntervalId
	var gameOn = false;

	var main = function()	{
		// Let's play this game!
		reset();
		then = Date.now();
		dirX = 1;
		dirY = 1;
		catSpeed = 0.2;
		catsPinned = 0;
		timer = 40000;
		gameOn = true;
		$('#points').html(catsPinned);
		refreshIntervalId = setInterval(mainLoop, 1); // Execute as fast as possible
	}
	
    /**** end of gameplay ****/

    $('#init_game_btn').click(function()    {
        $('#init_game').fadeOut('slow');
        start_game();
    });

    $('#play_again_yes').click(function()    {
        $('#game_over').fadeOut('slow');
        ctx.clearRect(0,0,canvas_w,canvas_h);
        start_game();
    });

    $('#play_again_no').click(function()    {
        $('#game_over').fadeOut('slow');
    });

    $('#about_btn').click(function()	{
    	$('#about').show();
    	if (gameOn)	{
 			clearInterval(refreshIntervalId);   		
    	}

    });

    $('#about_back_btn').click(function()	{
    	$('#about').hide();
    	if (gameOn)	{
	    	refreshIntervalId = setInterval(mainLoop, 1); // Execute as fast as possible
	    	then = Date.now();    		
    	}
    });
});


/* all the id's

init_game = the div for starting the game
init_game_dir = the directions for starting the game
init_game_btn = the button to start the game!

init_round = the div for initializing a round
init_round_dir = the directions for starting a round
init_round_btn = the button to start the round with the phrase to guess
    
*/



