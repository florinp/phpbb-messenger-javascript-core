var React = require('react');
var classNames = require('classnames');

var ReactPropTypes = React.PropTypes;

var ChatActions = require('../actions/ChatActions');

var FriendItem = React.createClass({

  propTypes: {
    friend: ReactPropTypes.object,
  },

  render: function() {
    var friend = this.props.friend;

    return (
      <div className="user" onClick={this._onClick}>
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/elastic-man.png" alt="" className="user-avatar"></img>
        <span className="user-name" style={{color: '#' + (friend.userColor != '' ? friend.userColor : '000')}}>{friend.username}</span>
        <span className={classNames({
          'user-status': true,
          'online': friend.userStatus == 1
        })}></span>
      </div>
    );
  },

  _onClick: function() {
    ChatActions.openBox(this.props.friend);
  }

});

module.exports = FriendItem;
