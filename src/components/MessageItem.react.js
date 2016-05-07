var React = require('react');
var classNames = require('classnames');

var ReactPropTypes = React.PropTypes;

var MessageItem = React.createClass({

  propTypes: {
    message: ReactPropTypes.object,
  },

  render: function() {
    var message = this.props.message;
    var response;
    var avatar;
    if(message.file) {
      if(message.type == 'sent') {
        avatar = this.parseAvatar(message.sender_avatar);
      } else if(message.type == 'inbox') {
        avatar = this.parseAvatar(message.sender_avatar);
      }


      var routeName = "app.php/messenger/file/" + message.id;
      var msg;
      if(message.type == 'sent') {
        msg = 'File sent';
      } else if(message.type == 'inbox') {
        msg = 'File received';
      }
      response = <div className={classNames({
        'msg': true,
        'msg_a': message.type == 'inbox' ? true : false,
        'msg_b': message.type == 'sent' ? true : false
      })}>
        <div className="circle-wrapper">
          <img src={avatar} />
        </div>
        <div className="text-wrapper">{msg}: <a href={ routeName } target="_blank"><i className="fa fa-file-o"></i> {message.fileName}</a></div>
      </div>;
    } else if(message.text) {
      if(message.type == 'sent') {
        avatar = this.parseAvatar(message.sender_avatar);
      } else if(message.type == 'inbox') {
        avatar = this.parseAvatar(message.sender_avatar);
      }

      response = <div className={classNames({
        'msg': true,
        'msg_a': message.type == 'inbox' ? true : false,
        'msg_b': message.type == 'sent' ? true : false
      })}>
        <div className="circle-wrapper">
          <img src={avatar} />
        </div>
        <div className="text-wrapper" dangerouslySetInnerHTML={{__html: message.text}}></div>
      </div>;
    }

    return response;
  },

  parseAvatar: function(avatar) {
    var src = './styles/prosilver/theme/images/no_avatar.gif';
    if(avatar && avatar != '') {
      var avatarElement = $(avatar);
      src = avatarElement.attr('data-src').replace('./../../', './');
    }
    return src;
  }

});

module.exports = MessageItem;
