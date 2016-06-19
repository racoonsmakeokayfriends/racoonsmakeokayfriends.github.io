$(document).ready(function()   {
  
  /* =========================================================
                       INITIALIZE GAME
     ========================================================= */
  var GAME_SIZE = 16;
  var NUM_COLORS = 6;
  
  var R0 = '1';
  var C0 = '1';
  var NUM_MOVES;
  var OLD_NUM_MOVES;
  
  function init_game()   {
    $('#game_board').html('');
    var col, html_str, row_str;
    for (var i=1; i<=GAME_SIZE; i++)  {
      row_str ='<div class="row">';
      for (var j=1; j<=GAME_SIZE; j++)  {
        col = Math.floor(Math.random()*NUM_COLORS)+1;
        col = col.toString();
        html_str = '<div class="space c'+col;
        html_str += '" row="'+i.toString();
        html_str += '" col="'+j.toString();
        html_str += '"></div>'
        row_str += html_str;
      }
      row_str += '</div>'
      $('#game_board').append(row_str);
    }

    NUM_MOVES = 0;
    $('#num_moves').html(NUM_MOVES.toString());
    
  }
  
  init_game();

  /* =========================================================
                       LOGIC FUNCTIONS
     ========================================================= */
  
  function set_color(r,c,color)   {
    var jq = '.space[row="'+r+'"][col="'+c+'"]';
    $(jq).attr('class','space');
    $(jq).addClass(color);
  }
  
  function get_color(r,c)   {
    // TODO: better way :(
    var jq = '.space[row="'+r+'"][col="'+c+'"]';
    if ($(jq).hasClass('c1')) {  return 'c1';  }
    if ($(jq).hasClass('c2')) {  return 'c2';  }
    if ($(jq).hasClass('c3')) {  return 'c3';  }
    if ($(jq).hasClass('c4')) {  return 'c4';  }
    if ($(jq).hasClass('c5')) {  return 'c5';  }
    if ($(jq).hasClass('c6')) {  return 'c6';  }
  }
  
  function has_won(new_color) {
    var jq = '.space.'+new_color;
    return $(jq).length == GAME_SIZE*GAME_SIZE;      
  }
  
  function game_won() {
    hi_score_prompt();
    OLD_NUM_MOVES = NUM_MOVES;
    init_game();
  }
  
  function hi_score_prompt()   {
    $('#hi_score_prompt').removeClass('hidden');
    $('#hi_score_prompt p').html('your score is '+NUM_MOVES.toString());
  }
  
  // completes the turn by absorbing all ajacent matching blocks
  function color_blocks(new_color)   {
    // credit: 
    // http://www.codeproject.com/Articles/631666/Zyan-Drench-A-Game-for-Android-with-Wifi-Support
    var color = get_color(R0,C0);
    // this is so we don't increment the number of moves if the same color was clicked
    if (color == new_color)   {
      return false;
    }
    
    var points = [];
    var queue = [[R0,C0]];
    var adjacents = [[1,0],[0,1],[-1,0],[0,-1]];
    
    while (queue.length > 0)   {
      var p = queue[0];
      queue = queue.slice(1,queue.length);            
      points.push(p);
      set_color(p[0],p[1],new_color);      
      
      // process adjacent points of the same color
      for (var i=0; i<adjacents.length;i++)   {
        var newR = parseInt(p[0])+adjacents[i][0];
        var newC = parseInt(p[1])+adjacents[i][1];
        
        
        // skip invalid point  (edges)
        if (newR < 1 || newR > GAME_SIZE || newC < 1 || newC > GAME_SIZE) {
          continue;
        }

        newR = newR.toString();
        newC = newC.toString();

        // skip blocks of other colors
        var jq = '.space[row="'+newR+'"][col="'+newC+'"]';
        if (!$(jq).hasClass(color)) {
          continue;
        }  

        // skip already processed blocks
        var newP = [newR,newC]
        if (is_here(points,newP) || is_here(queue,newP)) {
          continue;          
        }  

        // schedule block for processing
        queue.push(newP);
      }
    }
    

    
    return true;
  }
  


  /* =========================================================
                       USER INTERACTIONS
     ========================================================= */
  
  $('#debug_btn').click(function() {
    game_won();
  });
  
  $('.control').click(function() {
    var val = $(this).attr('val');    
    if (color_blocks('c' + val)) {
      NUM_MOVES += 1;
      $('#num_moves').html(NUM_MOVES.toString());
      
      // check if game is over
      if (has_won('c' + val))    {
        game_won();
      }
    }
  });

  $('.md-close').click(function() {
    $(this).parent().parent().addClass('hidden');
  });
  
  $('#hi_score_submit_btn').click(function() {
    var name = $('#name_input').val();
    submit_score(name,OLD_NUM_MOVES);
    $('#leaderboard_md').removeClass('hidden');
    $('#name_input').val('');
    $('#hi_score_prompt').addClass('hidden');
  });
  
  /* =========================================================
                       HELPER FUNCTIONS
     ========================================================= */
  
  // a silly check if an array length 2 is in a given array
  function is_here(arr,ele)  {
    for (var i=0;i<arr.length;i++)  {
      if (eqs(arr[i],ele)) {
        return true;
      }
    }
    return false;
  }
  
  // checks if two arrays of length 2 equal each other
  function eqs(p1,p2)   {
    return (p1[0] == p2[0] && p1[1] == p2[1]); 
  }
  
  
  /* =========================================================
                      FIREBASE FUNCTIONS
     ========================================================= */
  var LEADERBOARD_SIZE = 10;
  var score_list_ref = new Firebase('https://drench-hi-scores00.firebaseio.com//score_list');

  // Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
  var map_fb_to_html = {};

  /* ----------------------------------
              HELPER FUNCTIONS
     ---------------------------------- */

  // Takes a new score snapshot and adds an appropriate row to our leaderboard table.
  function handle_score_added(score_snapshot, pre_score_name) {
    var new_score_row = $("<tr/>");
    new_score_row.append($("<td/>").append($("<em/>").text(score_snapshot.val().name)));
    new_score_row.append($("<td/>").text(score_snapshot.val().score));

    // Store a reference to the table row so we can get it again later.
    map_fb_to_html[score_snapshot.name()] = new_score_row;

    // Insert the new score in the appropriate place in the table.
    if (pre_score_name === null) {
      $("#leaderboard_table").append(new_score_row);
    }
    else {
      var lower_score_row = map_fb_to_html[pre_score_name];
      lower_score_row.before(new_score_row);
    }
  }

  // Handles a score object being removed; just removes the corresponding table row.
  function handle_score_removed(score_snapshot) {
    var removed_score_row = map_fb_to_html[score_snapshot.name()];
    removed_score_row.remove();
    delete map_fb_to_html[score_snapshot.name()];
  }
  
  // Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
  var score_list_view = score_list_ref.startAt().limit(LEADERBOARD_SIZE);
  
  /* ----------------------------------
                FB FUNCTIONS
     ---------------------------------- */

  // Add a callback to handle when a new score is added.
  score_list_view.on('child_added', function (newScoreSnapshot, pre_score_name) {
    handle_score_added(newScoreSnapshot, pre_score_name);
  });

  // Add a callback to handle when a score is removed
  score_list_view.on('child_removed', function (oldScoreSnapshot) {
    handle_score_removed(oldScoreSnapshot);
  });

  // Add a callback to handle when a score changes or moves positions.
  var changed_callback = function (score_snapshot, pre_score_name) {
    handle_score_removed(score_snapshot);
    handle_score_added(score_snapshot, pre_score_name);
  };

  score_list_view.on('child_moved', changed_callback);
  score_list_view.on('child_changed', changed_callback);

  // When the user presses enter on scoreInput, add the score, and update the highest score.
  function submit_score(name,new_score) {
    if (name.length === 0)
      return;
    
    var user_score_ref = score_list_ref.child(name);
    // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
    user_score_ref.setWithPriority({ name:name, score:new_score },     new_score);
  }

  

})