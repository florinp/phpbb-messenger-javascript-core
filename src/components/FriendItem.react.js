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
      <div className={classNames({
        'user': true,
        'status-online': friend.userStatus == 1,
        'status-offline': friend.userStatus == 0
      })}
      onClick={this._onClick}>
        <span style={{color: '#' + (friend.userColor != '' ? friend.userColor : '000')}}>{friend.username}</span>
      </div>
    );
  },

  _onClick: function() {
    ChatActions.openBox(this.props.friend);
  }

});

module.exports = FriendItem;
