$(document).ready(function() {
  var c1 = '#21313e';
  var c2 = '#ec7063';
  var c3 = '#73c332';
  var c4 = '#2dedbb';  
  
  function check_lightness() {
    // check if the lightness of the corner colors requires a 'dark' menu
    if (chroma(c1).luminance() > 0.7) {
      $('#test .row:first-child .cell:first-child .cell_menu').addClass('dark');
    }
    else {
      $('#test .row:first-child .cell:first-child .cell_menu').removeClass('dark');
    }
    if (chroma(c2).luminance() > 0.7) {
      $('#test .row:first-child .cell:last-child .cell_menu').addClass('dark');
    }
    else {
      $('#test .row:first-child .cell:last-child .cell_menu').removeClass('dark');
    }
    if (chroma(c3).luminance() > 0.7) {
      $('#test .row:last-child .cell:first-child .cell_menu').addClass('dark');
    }
    else {
      $('#test .row:last-child .cell:first-child .cell_menu').removeClass('dark');
    }
    if (chroma(c4).luminance() > 0.7) {
      $('#test .row:last-child .cell:last-child .cell_menu').addClass('dark');
    }
    else {
      $('#test .row:last-child .cell:last-child .cell_menu').removeClass('dark');
    }
  }
  
  function update_scale() {
    var num_cells = $('#test .row:first-child .cell').length;
    var num_rows = $('#test .row').length;
    var lef_col_scale = chroma.scale([c1, c3]);
    var rig_col_scale = chroma.scale([c2, c4]);
    var grid = [];
    var $jq, cl, cr, scale;
    for (var r=0;r<num_rows;r++) {
      cl = lef_col_scale(r/num_rows).hex();
      cr = rig_col_scale(r/num_rows).hex();
      scale = chroma.scale([cl,cr]);
      for (var c=0;c<num_cells;c++) {
        $jq = $('#test .row:nth-child('+ (r+1).toString() + ') .cell:nth-child('+(c+1).toString()+')');    
        $jq.css("background", scale(c / num_cells).hex());        
        $jq.children('.cell_code').html(scale(c / num_cells).hex());        
      }      
    }

    check_lightness();

    // adjust widths
    $('#test .cell').css('width',(1/num_cells*100).toString() + '%');
  }
  
  function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function init() {
    // creates a color picker dialog for top left cell
    $('#test .row:first .cell:first .pick_color').colpick({
      color:c1,
      submit: 0,
      colorScheme:'dark',
      onChange:function(hsb,hex,rgb,el,bySetColor) {
        c1 = '#'+ hex;
        update_scale();  
      }
    });    
    // creates a color picker dialog for top right cell
    $('#test .row:first .cell:last .pick_color').colpick({
      color:c2,
      submit: 0,
      colorScheme:'dark',
      onChange:function(hsb,hex,rgb,el,bySetColor) {
        c2 = '#'+ hex;
        update_scale();   
      }
    });
    // creates a color picker dialog for bottom left cell
    $('#test .row:last .cell:first .pick_color').colpick({
      color:c3,
      submit: 0,
      colorScheme:'dark',
      onChange:function(hsb,hex,rgb,el,bySetColor) {
        c3 = '#'+ hex;
        update_scale();  
      }
    });    
    // creates a color picker dialog for bottom right cell
    $('#test .row:last .cell:last .pick_color').colpick({
      color:c4,
      submit: 0,
      colorScheme:'dark',
      onChange:function(hsb,hex,rgb,el,bySetColor) {
        c4 = '#'+ hex;
        update_scale();   
      }
    });
    update_scale();
  }
  
  init(); 

  /* =====================================
              USER INTERACTIONS
     ===================================== */
  
  // add a cell
  $('#add_cell').click(function() {
    var cell_html = '<div class="cell">';
    cell_html += '<div class="cell_code"></div>';
    cell_html += '</div>';
    var num_rows = $('#test .row').length;
    for (var i = 0; i < num_rows; i++) {
      $('#test .row:nth-child('+(i+1).toString()+') .cell:last').before(cell_html);
    };
    $('#display_num_cells').html($('#test .row:first .cell').length);
    update_scale();
  });
  
  // remove a cell
  $('#sub_cell').click(function() {
    if ($('#test .cell').length > 3) {
      $('#test .cell:nth-last-child(2)').remove();
      update_scale();
      $('#display_num_cells').html($('#test .row:first .cell').length);
    }    
  });

  // add a row
  $('#add_row').click(function() {
    var num_cells = $('#test .row:first-child .cell').length;
    var row_html = '<div class="row">';
    for (var i = 0; i < num_cells; i++) {
      row_html += '<div class="cell">';
      row_html += '<div class="cell_code"></div>';
      row_html += '</div>';
    };
    row_html += '</div>';
    
    $('#test .row:last').before(row_html);
    $('#display_num_rows').html($('#test .row').length);
    update_scale();
  });
  
  // remove a row
  $('#sub_row').click(function() {
    if ($('#test .row').length > 3) {
      $('#test .row:nth-last-child(2)').remove();
      update_scale();
    }
    $('#display_num_rows').html($('#test .row').length);
  });
  
  // 'save' a scale
  $('#save_scale').click(function() {
    var $scale = $('#test').clone().removeAttr('id');
    $scale.children('.row').first().children('.cell').last().children('.cell_menu').remove();
    $scale.children('.row').first().children('.cell').first().children('.cell_menu').remove();
    $scale.children('.row').last().children('.cell').last().children('.cell_menu').remove();
    $scale.children('.row').last().children('.cell').first().children('.cell_menu').remove();
    $('#saved_scales').append($scale);    
  }); 

  // randomize colors
  $('#test .row:first .cell:first .randomize').click(function() {
    c1 = get_random_color();
    update_scale();
  });

  $('#test .row:first .cell:last .randomize').click(function() {
    c2 = get_random_color();
    update_scale();
  });
  
  $('#test .row:last .cell:first .randomize').click(function() {
    c3 = get_random_color();
    update_scale();
  });

  $('#test .row:last .cell:last .randomize').click(function() {
    c4 = get_random_color();
    update_scale();
  });
  
});

