'use strict'; 

$(document).ready(init); 

function init() {
  $('.showAlbum').click(showAlbum);
  $('.showImage').click(showImage);
  
  $('#removeAlbum').click(removeAlbum);
  $('#removeImage').click(removeImage);

  $('#toggle').click(toggle);

  $('#faveImage').click(faveImage);
  $('.unfaveImage').click(unfaveImage);

  $('.sort').click(sort); 
}

function showAlbum(){
  console.log('this data is: ', $(this).data().album.replace(/\"/g,""));
  var album = '/' + $(this).data().album.replace(/\"/g,"");
  var user = '/' + $(this).data().user.replace(/\"/g,"");
  location.href = '/albums' + album + user;
}

function showImage(){
  console.log('this data is: ', $(this).data().album.replace(/\"/g,""));
  var owner = '/' + $(this).data().owner.replace(/\"/g,"");
  var album = '/' + $(this).data().album.replace(/\"/g,"");
  var image = '/' + $(this).data().image.replace(/\"/g,"");
  location.href = '/images' + owner + album + image;
}



function removeAlbum(){
  var album = '/' + $(this).data().album.replace(/\"/g,""); 

  $.ajax({
    url: '/albums' + album,
    method: "DELETE"
  })
  .success(function(data) {
    location.replace('/albums/mine');
  })
  .fail(function(err) {
    console.error("Error:", err);
  });
}

function removeImage(){
  var owner = '/' + $(this).data().owner.replace(/\"/g,""); 
  var album = '/' + $(this).data().album.replace(/\"/g,""); 
  var image = '/' + $(this).data().image.replace(/\"/g,""); 
  
  $.ajax({
    url: '/images' + album + image, 
    method: "DELETE"
  })
  .success(function(data) {
    location.replace('/albums'+album+owner);
  })
  .fail(function(err) {
    console.error("Error:", err);
  });
}

function toggle(){
  var album = '/' + $(this).data().album.replace(/\"/g,""); 
  
  $.ajax({
    url: '/albums/toggle' + album, 
    method: "PUT"
  })
  .success(function(data) {
    location.replace('/albums/mine');
  })
  .fail(function(err) {
    console.error("Error:", err);
  });
}


function faveImage(){
  var owner = '/' + $(this).data().owner.replace(/\"/g,""); 
  var album = '/' + $(this).data().album.replace(/\"/g,""); 
  var image = '/' + $(this).data().image.replace(/\"/g,""); 
  
  $.ajax({
    url: '/faves' + album + image, 
    method: "POST"
  })
  .success(function(data) {
    location.replace('/albums'+album+owner);
  })
  .fail(function(err) {
    console.error("Error:", err);
  });
}

function unfaveImage(){
  console.log(":(");
  // var owner = '/' + $(this).data().owner.replace(/\"/g,""); 
  // var album = '/' + $(this).data().album.replace(/\"/g,""); 
  var image = '/' + $(this).data().image.replace(/\"/g,""); 
  
  $.ajax({
    url: '/faves' + image, 
    method: "DELETE"
  })
  .success(function(data) {
    location.replace('/faveimages');
  })
  .fail(function(err) {
    console.error("Error:", err);
  });
}


function sort(){
  var str = $(this).attr('id').toLowerCase(); 
  var currenturl = $(location).attr('href').split('/');
  console.log(currenturl, "URLCURRENT");
  var num = (currenturl[4] === str && currenturl[5] === "1") ? "/-1" : "/1";
  var send = '/sortnfilter/' + str + num; 
  $.get(send, function(data) {
    location.replace(send);
  });
}