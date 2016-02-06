'use strict'

$(document).ready(init);

function init(){
  $('#addAlbum').on('click', addAlbum);

}


function addAlbum(e){
  e.preventDefault();
  var tags = $('#tags').val().toLowerCase().split(/\W/).join(' ');

  $.post('/albums', {
    title: $('#title').val(),
    description: $('#description').val(),
    tags: tags
  })
  .success(function() {
    console.log('success');
    console.log($('#tags').val().toLowerCase().split(/\W/));
    location.href = '/albums/mine';
  })
  .fail(function(err) {    
    console.log('err:', err);
    location.href = '/albums/mine';
  });
}

