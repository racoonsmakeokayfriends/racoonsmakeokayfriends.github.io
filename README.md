This is where I'm storing a portfolio of projects and games I've made.

Here are things I've done:

* Added:
	* Drench
	* Pin the Bow
	* Kitty Bejeweled
	* Color Scale
	* Color Scale 2D
* Added the kitty images to the assets folder (the images on postimage are gone).
* Got a black knight chess piece for a favicon

Things I need to do:

* Link back to the home page
* Add a contact me/about me section
* Add the arch inkscape extension
* Write about my pothole reporter app and it's pitfalls </3
* Add the star rating
* Seperate games from tools













*, *:after, *:before {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

$game_size: 16;
$board_width: 600px;

/* body */
$bg_col : #373633;
$font_family : 'Lato', Calibri, Arial, sans-serif; 
$main_font_color: #ffffff;

$btn_color: #40805C;
$btn_shadow_col: #286844;

/* grid */
$grid_bg_col: none;
$grid_border: none;
$grid_cells_bg_col: #ff0000;
$grid_cells_border: 2px solid rgba(255,255,255,0.9);

$col1: #7fc97f;
$col2: #beaed4;
$col3: #fdc086;
$col4: #ffff99;
$col5: #386cb0;
$col6: #D74592;

$col1s: #50A950;
$col2s: #957EB5;
$col3s: #D89454;
$col4s: #D8D861;
$col5s: #1A56A4;
$col6s: #CB257D;

$lb_bg_col: #91B9A2;
$lb_divider: none;
$lb_hd_bg_col: #40805C;

/* modals */
$md_bg_col: #63997A;
$md_hd_bg_color: #40805C;
$md_overlay_col: rgba(0,0,0,0.9);
$md_col: #ffffff;

body   {
  background-color: $bg_col;
  font-family: $font_family;
  color: $main_font_color;
}

button {
  border: none;
  color: inherit;
  background-color: $btn_color;
  cursor: pointer;
  padding: 12px 40px;
  border-radius: 10px;
  display: inline-block;
  margin: 15px 30px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  position: relative;
  box-shadow: 0 4px $btn_shadow_col;
}

button:hover {
	box-shadow: 0 3px $btn_shadow_col;
	top: 1px;
}

button:active {
	box-shadow: 0 0 $btn_shadow_col;
	top: 4px;
}

.board  {
  background-color: $grid_bg_col;
  border: $grid_border;
  width: $board_width;
  // text-align: center;
  
}

// .board:after {
//   content: "";
//   display: table;
//   clear: both;
// }

.space {
  float: left;
  padding:5px;
  width: $board_width / $game_size;
  height: $board_width / $game_size;
}

#control_board   {
  width:$board_width / $game_size * 16;
  height:150px;
  // float:left;
  // padding:50px;
  text-align: center;
  font-size: 32pt;
}



/* 
credit for buttons:
http://tympanus.net/Development/CreativeButtons/
*/

.control   {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  margin: 5px;
  padding: 0;
  -webkit-transition: none;
  -moz-transition: none;
  transition: none;
}

.control:after {
	content: '';
	position: absolute;
	z-index: -1;
	-webkit-transition: all 0.3s;
	-moz-transition: all 0.3s;	
}

.control:hover   {
  top: 1px;
}

.control:active {
	top: 3px;
}

.c1   {  background-color: $col1;  }
.c2   {  background-color: $col2;  }
.c3   {  background-color: $col3;  }
.c4   {  background-color: $col4;  }
.c5   {  background-color: $col5;  }
.c6   {  background-color: $col6;  }

// button   {
//   border: none;
//   cursor: pointer;
//   display: inline-block;
//   outline: none;
//   position: relative;
// }

.control.c1  {  box-shadow: 0 3px $col1s;  }
.control.c2  {  box-shadow: 0 3px $col2s;  }
.control.c3  {  box-shadow: 0 3px $col3s;  }
.control.c4  {  box-shadow: 0 3px $col4s;  }
.control.c5  {  box-shadow: 0 3px $col5s;  }
.control.c6  {  box-shadow: 0 3px $col6s;  }

.control.c1:hover  {  box-shadow: 0 2px $col1s;  }
.control.c2:hover  {  box-shadow: 0 2px $col2s;  }
.control.c3:hover  {  box-shadow: 0 2px $col3s;  }
.control.c4:hover  {  box-shadow: 0 2px $col4s;  }
.control.c5:hover  {  box-shadow: 0 2px $col5s;  }
.control.c6:hover  {  box-shadow: 0 2px $col6s;  }

.control.c1:active  {  box-shadow: 0 0 $col1s;  }
.control.c2:active  {  box-shadow: 0 0 $col2s;  }
.control.c3:active  {  box-shadow: 0 0 $col3s;  }
.control.c4:active  {  box-shadow: 0 0 $col4s;  }
.control.c5:active  {  box-shadow: 0 0 $col5s;  }
.control.c6:active  {  box-shadow: 0 0 $col6s;  }



/***********************************
 *           MODAL STUFF           *
 ***********************************/

.md {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $md_overlay_col;
  z-index: 100;
  color:$md_col;
}

.md-content {
  background-color: $md_bg_col;
  position: relative;
  width: 500px;
  margin: 100px auto;
  padding-bottom: 20px;
  text-align: center;
}

/*------------
    Variants  
  ------------*/

.md-hd {
  margin-bottom: 10px;
  padding: 0.4em;
  text-align: center;
  font-size: 1.2em;
  font-weight: 600;
  letter-spacing: 1px;
  background-color: $md_hd_bg_color;
}

.md-ft {
  /* modal footer */
}

.left   {
  float: left;
}

.right   {
  float: right;
}

.hidden   {
  display: none;
}

#leaderboard_md .md-content {
  overflow: auto;
  color: $md_col;
  padding-top:20px;
}

#leaderboard_md table {
  width: 75%;
/*  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;*/
  margin:20px auto 20px auto;
  border-collapse: collapse;
  background-color: $lb_bg_col;
}

#leaderboard_md table th {
  background: $lb_hd_bg_col;
  font-size: 12px;
  color: $md_col;
  padding: 5px 10px;
  margin-top: 20px;
}

#leaderboard_md table td {
  border-top: $lb_divider;
  padding: 5px;
  color: $md_col; 
}
#leaderboard_md table td em {
  font-style: normal;
  font-weight: bold;
  color: $md_col;
}


input {
  border: none;
  outline: none;
  padding: 3px;
  margin-bottom: 10px;
  border-radius: 2px;
}


