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
      var routeName = "app.php/messenger/file/" + message.id;
      var msg;
      if(message.type == 'sent') {
        msg = 'File sent';
      } else if(message.type == 'inbox') {
        msg = 'File received';
      }
      response = <li className="conversation__msg cf">
        <div className={classNames({
          "right": message.type == 'sent'
        })}>
          {msg}: <a href={ routeName } target="_blank"><i className="fa fa-file-o"></i> {message.fileName}</a>
        </div>
      </li>;
    } else if(message.text) {
      response = <li className="conversation__msg cf">
        <div className={classNames({
          "right": message.type == 'sent'
        })} dangerouslySetInnerHTML={{__html: message.text}}></div>
      </li>;
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
