var React = require('react');
var classNames = require('classnames');
var $ = require('jquery');

var ReactPropTypes = React.PropTypes;

var ChatActions = require('../actions/ChatActions');

import { openBox } from '../actions/chat';

var FriendItem = React.createClass({

    propTypes: {
        friend: ReactPropTypes.object,
    },

    render: function () {
        var friend = this.props.friend;
        var avatar = this.parseAvatar(friend);
        return (
            <li className="chat__user" onClick={this._onClick}>
                <img className="chat__avatar" src={avatar} />
                <span className="chat__name" style={{ color: '#' + (friend.userColor != '' ? friend.userColor : '000') }}>{friend.username}</span>
                <span className={classNames({
                    'user-status': true,
                    'online': friend.userStatus == 1
                })}></span>
            </li>
        );
    },

    parseAvatar: function (friend) {
        var src = './styles/prosilver/theme/images/no_avatar.gif';
        if (friend.userAvatar != '') {
            var avatarElement = $(friend.userAvatar);
            src = avatarElement.attr('data-src').replace('./../../', './');
        }
        return src;
    },

    _onClick: function () {
        openBox(this.props.friend);
    }

});

module.exports = FriendItem;
