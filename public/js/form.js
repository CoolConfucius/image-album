'use strict';

var obj = {}; 

$(function() {
  var $go = $('#go');
  
  if ($go.hasClass('changepassword')){
    obj.state = 'changepassword'
  } else {
    obj.state = $go.hasClass('register') ? 'register' : 'login';
  }
  
  if (obj.state === 'login') {
    $('#forgot').click(resetpassword); 
  };
  $('form').on('submit', go);
});

function go(e) {
  e.preventDefault();
  obj.email = $('#email').val();
  obj.password = $('#password').val();
  obj.password2 = $('#password2').val();
  obj.newpassword = $('#newpassword').val();

  if(obj.state === 'register' && obj.password !== obj.password2) {
    $('#password').val('');
    return alert('Passwords must match.');
  }

  if (obj.state === "changepassword") {
    obj.url = '/users/changepassword'; 
  } else {
    obj.url = obj.state === "register" ? '/users/register' : '/users/login'; 
  }

  $.post(obj.url, {email: obj.email, password: obj.password, newpassword: obj.newpassword})
  .success(function() {
    location.href = obj.state === "register" ? '/login' : '/';
  })
  .fail(function(err) {
    alert('Error.  Check console.');
    console.log('err:', err);
  });
}

function resetpassword(e) {
  e.preventDefault();
  obj.email = $('#email').val();
  if (!obj.email) {
    alert("Enter your email first"); 
    return; 
  };
  $.post('/users/resetpassword', {email: obj.email})
  .success(function() {
    location.href = '/login';
  })
  .fail(function(err) {
    alert('Error.  Check console.');
    console.log('err:', err);
  });


}