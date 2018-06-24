var React = require('react');
var ReactDOM = require('react-dom');
var MessageStore = require('../stores/MessageStore');
var ChatBoxStore = require('../stores/ChatBoxStore');
var EmoticonsStore = require('../stores/EmoticonsStore');
var ChatActions = require('../actions/ChatActions');
var ReactPropTypes = React.PropTypes;
var assign = require('object-assign');
var MessagesBody = require('./MessagesBody.react');
var Dropzone = require('react-dropzone');
var request = require('superagent');
var $ = require('jquery');
var ChatWebApiUtils = require('../utils/ChatWebApiUtils');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const ENTER_KEY_CODE = 13;

import { closeBox } from '../actions/chat';

class CloseBtn extends Component {

    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);
    }

    render() {
        return (
            <div className="close__button" onClick={this._onClick}></div>
        );
    }

    _onClick(evt) {
        evt.preventDefault();
        closeBox(this.props.friend);
    }
}
CloseBtn.propTypes = {
    friend: PropTypes.object.isRequired
};

class MessageComposer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: ''
        };

        this._onChange = this._onChange.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    render() {
        return (
            <div className="msg_footer">
                <textarea
                    className="msg-input"
                    placeholder="Type a message"
                    value={this.state.text}
                    onChange={this._onChange}
                    onKeyDown={this._onKeyDown}
                    />

                <div className="msg-send" onClick={this._onClick}></div>
            </div>
        );
    }

    _onChange(evt) {
        const { evt: { target: { value } } } = evt;
        this.setState({ text: value });
    }

    _onKeyDown(evt) {
        if (evt.keyCode === ENTER_KEY_CODE) {
            evt.preventDefault();
            const text = this.state.text.trim();
            if (text) {
                ChatActions.sendMessage(text, this.props.friendId);
            }
            this.setState({ text: '' });
        }
    }

    _onClick(evt) {
        evt.preventDefault();

        const text = this.state.text.trim();
        if (text) {
            ChatActions.sendMessage(text, this.props.friendId);
        }
        this.setState({ text: '' });
    }

}
MessageComposer.propTypes = {
    friendId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};

class ChatBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: true
        };


    }

    componentDidMount() {
        ChatWebApiUtils.getEmoticons();
        MessageStore.addChangeListener(this._onChange);
        this._scrollBottom();
    }

    componentWillUnmount() {
        MessageStore.removeChangeListener(this._onChange);
    }

    render() {
        const { friend, initialPos, count } = this.props;
        const { show } = this.state;

        let body, composer;

    }

}
ChatBox.propTypes = {
    friend: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    initialPos: PropTypes.number
};

var ChatBox = React.createClass({

    propTypes: {
        friend: ReactPropTypes.object,
        count: ReactPropTypes.number,
        reactKey: ReactPropTypes.string,
        initialPos: ReactPropTypes.number
    },

    getInitialState: function () {
        return { show: true };
    },

    componentDidMount: function () {
        ChatWebApiUtils.getEmoticons();
        MessageStore.addChangeListener(this._onChange);
        this._scrollBottom();
    },

    componentWillMount: function () {

    },

    componentWillUnmount: function () {
        MessageStore.removeChangeListener(this._onChange);
    },

    render: function () {
        var friend = this.props.friend;
        var messagesBody = '';
        var messageComposer = '';
        var dropzone = '';
        var messageOptions;
        if (this.state.show == true) {
            messagesBody = <MessagesBody friend={friend} />
            messageComposer = <MessageComposer friendId={friend.id} />;
            dropzone = <Dropzone onDrop={this._onDrop} ref="dropzone" className="upload-zone">
                <div>Drag files here</div>
            </Dropzone>;
            messageOptions = <div className="msg_input_options">
                <EmoticonsBody />

                <div className="option">
                    <a href="#">
                        <i className="fa fa-smile-o"></i>
                    </a>
                </div>
                <div className="option">
                    <a href="#" onClick={this._openUploadZone}>
                        <i className="fa fa-paperclip"></i>
                    </a>
                </div>
            </div>;
        }

        var avatar = this.parseAvatar(friend);

        return (
            <div
                className="msg_box"
                style={{ right: this.props.initialPos * this.props.count + 'px' }}
                ref="msgBox"
                >
                <div className="msg_head" onClick={this._show}>
                    <div className="user-name">{friend.username}</div>
                    <CloseBtn friend={friend} />
                </div>
                {messagesBody}
                {dropzone}
                {messageComposer}
            </div>
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

    /**
     * Event handler for 'change' events coming from the stores
     */
    _onChange: function () {
        var show = this.state.show;
        this.setState({ show: show });
    },

    _show: function () {
        var show;
        if (this.state.show == true) {
            show = false;
        } else {
            show = true;
        }
        this.setState({ show: show })
    },

    _openUploadZone: function () {
        this.refs.dropzone.open();
    },

    _scrollBottom: function () {
        var msgBox = $(ReactDOM.findDOMNode(this.refs.msgBox));
        var msgWrap = $(msgBox).find('.msg_wrap').first();
        var msgBody = $(msgWrap).find('.msg_body').first();
        $(msgWrap).scrollTop($(msgBody).height());
    },

    _onDrop: function (files) {
        var self = this;

        var hideUploadZone = function () {
            var msgBody = $('.msg_body');
            msgBody.each(function () {
                var el = $(this);
                el.show();
            });

            var uploadZone = $('.upload-zone');
            uploadZone.each(function () {
                var zone = $(this);
                zone.hide();
            });
        };

        var friend = this.props.friend;
        var req = request.post('./app.php/messenger/send_file');
        req.field('receiver_id', friend.id);
        files.forEach(function (file) {
            console.log(file);
            req.attach('file', file, file.name);
        });
        req.end(function (err, res) {
            if (err) {
                console.log('Drag and drop upload error', err);
                return false;
            }

            hideUploadZone();
            self._scrollBottom();
        });
    }

});

module.exports = ChatBox;
