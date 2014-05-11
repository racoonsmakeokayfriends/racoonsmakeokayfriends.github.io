/*********************
 ***** Constants *****
 *********************/
var BOARD_WIDTH = 8;
var BOARD_HEIGHT = 8;
var TILE_SIZE = 75;
var MARGIN_X = 100;
var MARGIN_Y = 50;
var GAME_WIDTH = MARGIN_X*2 + BOARD_WIDTH*TILE_SIZE;
// add extra for scoreboard
GAME_WIDTH += 200;
var GAME_HEIGHT = MARGIN_Y*2 + BOARD_HEIGHT*TILE_SIZE;

var NUM_TILES = 5;
var MIN_MATCH_NUM = 5;

var BACKGROUND_COLOR_S = 0xA6C848;
var BACKGROUND_COLOR_B = '#A6C848';
var CHOOSEN_BORDER = 0xFBB829;

var BOARD_BOX_X0 = MARGIN_X;
var BOARD_BOX_X1 = MARGIN_X + BOARD_WIDTH*TILE_SIZE;
var BOARD_BOX_Y0 = MARGIN_Y;
var BOARD_BOX_Y1 = MARGIN_Y + BOARD_HEIGHT*TILE_SIZE;

var texture_list = [];

function get_x_pos(c) { return c*TILE_SIZE + MARGIN_X; }
function get_y_pos(r) { return r*TILE_SIZE + MARGIN_Y; }

/************************
 ***** Global State *****
 ************************/
var board = [];
var tiles = [];
var score_board = [];
var choosen_tile;
var border;

var m = new M();
var renderer;
var stage;
var graphics;

/**********************************
 ***** Game Functions [LOGIC] *****
 **********************************/
function move_row(row,delta)	{
	if (delta > 0)	{	// forward shift
		board[row] = m.shift_forward_n(board[row],delta);
		tiles[row] = m.shift_forward_n(tiles[row],delta);
	}
	else	{	// backward shift
		board[row] = m.shift_backward_n(board[row],delta*-1);
		tiles[row] = m.shift_backward_n(tiles[row],delta*-1);
	}

	for (var c=0; c<BOARD_WIDTH; c++)	{
		tiles[row][c].position.x = get_x_pos(c);
		tiles[row][c].C0 = c;
	}
	has_match();
	update_border();
}

function move_col(col,delta)	{
	var tempB = [];
	var tempT = [];
	for (var i=0; i<BOARD_HEIGHT; i++)	{
		tempB[i] = board[i][col];
		tempT[i] = tiles[i][col];
	}

	if (delta > 0)	{	// forward shift
		tempB = m.shift_forward_n(tempB,delta);
		tempT = m.shift_forward_n(tempT,delta);
	}
	else	{
		tempB = m.shift_backward_n(tempB,delta*-1);	
		tempT = m.shift_backward_n(tempT,delta*-1);	
	}

	for (var i=0; i<BOARD_HEIGHT; i++)	{
		board[i][col] = tempB[i];
		tiles[i][col] = tempT[i];
	}

	for (var r=0; r<BOARD_HEIGHT; r++)	{
		tiles[r][col].position.y = get_y_pos(r);
		tiles[r][col].R0 = r;
	}
	has_match();
	update_border();
}

// NOTE: perhaps combine replace_row + replace_col?
function replace_row(row, a)	{
	// [x] put new tiles in the streak in row row starting at a
	// [x] kill exisiting tiles
	var streak_tile = board[row][a];
	var streak_count = 0;
	for (var c=a; c<BOARD_WIDTH; c++)	{
		if (streak_tile != board[row][c])	{
			return streak_count;
		}
		board[row][c] = Math.floor(Math.random()*NUM_TILES);
		stage.removeChild(tiles[row][c]);
		tiles[row][c] = create_tile(row,c);
		streak_count += 1;
	}
	return streak_count;
}

function replace_col(col, a)	{
	// TODO: put new tiles in the streak in column col starting at a
	var streak_tile = board[a][col];
	var streak_count = 0;
	for (var r=a; r<BOARD_HEIGHT; r++)	{
		if (streak_tile != board[r][col])	{
			return streak_count;
		}
		board[r][col] = Math.floor(Math.random()*NUM_TILES);
		stage.removeChild(tiles[r][col]);
		tiles[r][col] = create_tile(r,col);
		streak_count += 1;
	}
	return streak_count;
}

function num_to_col(num)	{
	colors = ["green", "orange", "blue", "red", "white"];
	return colors[num];
}

function has_match()	{
	// [x] check if there is a winning row (5+)
	// if there is:
	//   [x] replace that row
	//   [ ] score accordingly

	var	streak_count, curr_streak_tile;
	var count;
	// check row
	for (var r=0; r<BOARD_HEIGHT; r++)	{
		streak_count = 1;
		curr_streak_tile = -1;
		for (var c=0; c<BOARD_WIDTH; c++)	{
			if (board[r][c] == curr_streak_tile)	{ 
				streak_count+=1;
				if (streak_count >= MIN_MATCH_NUM)	{
					count = replace_row(r,c-streak_count+1);
					console.log("count: " + count);
					update_score_board(curr_streak_tile,count);
					break;
				}
			}
			else {
				streak_count = 1;
				curr_streak_tile = board[r][c];
			}			
		}
	}
	
	// check column
	for (var c=0; c<BOARD_WIDTH; c++)	{
		streak_count = 1;
		curr_streak_tile = -1;
		for (var r=0; r<BOARD_HEIGHT; r++)	{
			if (board[r][c] == curr_streak_tile)	{ 
				streak_count+=1;
				if (streak_count >= MIN_MATCH_NUM)	{
					count = replace_col(c,r-streak_count+1);
					console.log("count: " + count);
					update_score_board(curr_streak_tile,count);
					break;
				}
			}
			else {
				streak_count = 1;
				curr_streak_tile = board[r][c];
			}
		}
	}
}

function new_board()	{
	for (var r=0; r<BOARD_HEIGHT; r++)	{
		board[r] = [];
		tiles[r] = [];
		for (var c=0; c<BOARD_WIDTH; c++)	{
			board[r][c] = Math.floor(Math.random()*NUM_TILES);
			tiles[r][c] = create_tile(r,c);
		}
	}
}


/************************************
 ***** Game Functions [DISPLAY] *****
 ************************************/

function init_texture_list()	{
	texture_list[0] = new PIXI.Texture.fromImage("assets/c2.png");
	texture_list[1] = new PIXI.Texture.fromImage("assets/n2.png");
	texture_list[2] = new PIXI.Texture.fromImage("assets/s2.png");
	texture_list[3] = new PIXI.Texture.fromImage("assets/b2.png");
	texture_list[4] = new PIXI.Texture.fromImage("assets/g2.png");
}

function init()	{
	init_texture_list();
}

function create_tile(r, c)	{
	var tile = new PIXI.Sprite(texture_list[board[r][c]]);
	tile.interactive = true;
	tile.buttonMode = true;
	tile.anchor.x = 0.0;
	tile.anchor.y = 0.0;
	tile.R0 = r;
	tile.C0 = c;
	tile.num = board[r][c];

	tile.mouseup = tile.mouseupoutside = tile.touchend = tile.touchendoutside = function(data)
	{
		if (choosen_tile != null)	{
			choosen_tile.alpha = 1.0;
		}
		choosen_tile = this;
		choosen_tile.alpha = 0.5;
		update_border();
	};

	tile.position.x = get_x_pos(tile.C0);
	tile.position.y = get_y_pos(tile.R0);

	stage.addChild(tile);
	return tile;
}


function init_score_board()	{
	for (var i=0; i<NUM_TILES; i++)	{
		var tile = new PIXI.Sprite(texture_list[i]);
		tile.position.x = MARGIN_X*2 + BOARD_WIDTH*TILE_SIZE;
		tile.position.y = MARGIN_Y + (i+1)*(TILE_SIZE+10);
		stage.addChild(tile);
		var txt = new PIXI.Text("0", {font: "35px sans-serif", fill: "white", align: "left"});
		txt.position.x = tile.position.x + TILE_SIZE + 10;
		txt.position.y = tile.position.y + 20;
		txt.anchor.y = 0.0;
		txt.val = 0;
		stage.addChild(txt);
		score_board[i] = txt;
	}
}

function update_score_board(tile,delta)	{
	var txt = score_board[tile];
	console.log(delta);
	txt.val += delta;
	console.log(txt.val);
	txt.setText(txt.val);
}

function update_border()	{
	stage.removeChild(border);
	// update border
	border.clear();
	border.lineStyle(4, CHOOSEN_BORDER, 1);
	border.drawRect(get_x_pos(choosen_tile.C0),get_y_pos(choosen_tile.R0),TILE_SIZE,TILE_SIZE);
	stage.addChild(border);
}
/**********************************
 ***** Game Functions [INPUT] *****
 **********************************/


$(document).ready(function()	{

	init();

	stage = new PIXI.Stage(BACKGROUND_COLOR_S,true);
	$('body').css('background-color',BACKGROUND_COLOR_B);
	renderer = PIXI.autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, null);
	$('#directions_btn').before(renderer.view);

	// some css magic to make game centered
	$('#game').css('width',GAME_WIDTH);
	var margin_width = ($('body').width() - GAME_WIDTH)/2;
	console.log(margin_width);
	$('#game').css('margin-left',margin_width);

	// create white background so choosen tile 'glows'
	var backdrop = new PIXI.Graphics();
	backdrop.beginFill(0xFFFFFF, 1);
	backdrop.drawRect(MARGIN_X,MARGIN_Y,BOARD_WIDTH*TILE_SIZE,BOARD_HEIGHT*TILE_SIZE);
	stage.addChild(backdrop);

	new_board();

	// create border to wrap around choosen tile
	border = new PIXI.Graphics();
	stage.addChild(border);

	// initialize the score_board
	init_score_board();

	requestAnimFrame(animate);

	function animate() {
    requestAnimFrame(animate);  
    renderer.render(stage);
	}

	// user keyboard input
  $(document).keydown(function(key)  {
  	if (choosen_tile != null)	{
  		switch(parseInt(key.which,10)) {
  		// left
  		case 37:
			case 65:
				move_row(choosen_tile.R0,-1);
				break;
			// down
			case 40:
			case 83:
				move_col(choosen_tile.C0,1);
				break;
			// up
			case 38:
			case 87:
				move_col(choosen_tile.C0,-1);
				break;
			// right
			case 39:
			case 68:
				move_row(choosen_tile.R0,1);
				break;
			default:
				break;
			}			
  	}      
  });

  $('#start_game_btn').click(function()	{
  	$('#directions').hide();
  	$('#game').show();
  });

  $('#directions_btn').click(function()	{
  	$('#game').hide();
  	$('#directions').show();
  });
});

/*************
 *** TO DO ***
 *************/

		// {x} graphics
		// {x} user input
		// 		{x} tile clicked has glow
		//				{x} put white background
		//    {x} WASD/arrow
		// {x} clean up margin_y crap >.<
		// {x} directions
		// { } scoring
		//		{x} call has_match()
		//  	{x} has_match() does something when match is had
		//		{ } score
		//		{x} replace streak
		// {x} make it BIG
		// { } make divider
		// { } make header