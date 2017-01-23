var React = require('react');
var ReactDOM = require('react-dom');
var ChatWebApiUtils = require('./utils/ChatWebApiUtils');
window.React = React;

var $ = require('jquery');

import ChatApp from './components/ChatApp';

var chatActions = require('./actions/chat');

chatActions.getFriends();

var resetTimer;
var showUploadZone = function() {
  var msgBody = $('.msg_body');
  msgBody.each(function(){
    var el = $(this);
    el.hide();
  });

  var uploadZone = $('.upload-zone');
  uploadZone.each(function() {
    var zone = $(this);
    zone.show();
  });
};
showUploadZone();

var hideUploadZone = function() {
  var msgBody = $('.msg_body');
  msgBody.each(function(){
    var el = $(this);
    el.show();
  });

  var uploadZone = $('.upload-zone');
  uploadZone.each(function() {
    var zone = $(this);
    zone.hide();
  });
};

var f = function(e) {
  var srcElement = e.srcElement? e.srcElement : e.target;
  var element = $(srcElement);
  if ($.inArray('Files', e.dataTransfer.types) > -1) {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = (element.hasClass('upload-zone')) ? 'copy' : 'none';

    if(e.type == 'dragover') {
      if(resetTimer) {
        clearInterval(resetTimer)
      }
      showUploadZone();
    } else if(e.type == 'dragleave') {
      resetTimer = window.setTimeout(hideUploadZone, 15);
    }
  }
};

document.body.addEventListener('dragover', f, false);
document.body.addEventListener('dragleave', f, false);


ReactDOM.render(
  <ChatApp />,
  document.getElementById('chat')
);
