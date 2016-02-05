'use strict'

$(document).ready(init);

function init(){
  $('#addAlbum').on('click', addAlbum);
}


function addAlbum(e){
  e.preventDefault();

  $.post('/albums', {
    title: $('#title').val(),
    description: $('#description').val(),
    tags: $('#tags').val().toLowerCase().split(/\W/),
    rating: $('#rating').val(),
    imageURL: $('#imageurl').val()
  })
  .success(function() {
    console.log('success');
    location.href = '/albums/mine';
  })
  .fail(function(err) {    
    console.log('err:', err);
    location.href = '/albums/mine';
  });
}

