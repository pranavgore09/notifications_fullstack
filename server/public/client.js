'use strict';
$(document).ready(function() {
  var socket = io();
  var container = $('#notification_panel');
  var parent = container.find('li:eq(0)');
  // following event is most important
  // it receives an array of notification ot be added
  socket.on('notifications', function(data){
    // every element will be prepend
    console.log('Notification received.')
    data.forEach(function(d){
      // var container = $('#notification_panel');
      var li = $('<li/>');
      li.addClass(d['status']);
      li.data('id', d['id']);
      li.on('click', notificaiton_clicked);
      var link = $('<a/>');
      var message = d['message'];

      if(message.length > 60){
        message = message.substring(0, 60) + '...'
      }
      link.text(message);
      link.appendTo(li);
      link.attr('href', '#');
      // container.prepend(li);
      // First elemnt will always be "Your MEssages"
      parent.after(li);
      // x.prepend('<li><a href="#">'+d['message']+'</a></li>');
    });
  });
  socket.on('count', function(number){
    console.log('Unread count to be updated.', number)
    $('#count').text(number);
  })

  function notification_remove(){
    console.log('Message will be deleted.');
    socket.emit('delete', $(this).data('id'));
    $(this).off('click', notification_remove);
    $(this).remove()
  }
  function notificaiton_clicked(){
    console.log('Message will be marked as read.');
    socket.emit('mark_read', $(this).data('id'));
    $(this).removeClass('unread');
    $(this).addClass('read');
    $(this).off('click', notificaiton_clicked);
    $(this).on('click', notification_remove)
  }

  $('.myMenu > li').bind('mouseover', open_menu);
  $('.myMenu > li').bind('mouseout', close_menu);

  function open_menu() {
    $(this).find('ul').css('visibility', 'visible');
  }
  function close_menu() {
    $(this).find('ul').css('visibility', 'hidden'); 
  }
});
