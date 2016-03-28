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

var ENTER_KEY_CODE = 13;

var CloseBtn = React.createClass({
    propTypes: {
        friend: ReactPropTypes.object
    },

    render: function () {
        return (
            <div className="close" onClick={this._onClick}></div>
        );
    },

    _onClick: function () {
        ChatActions.closeBox(this.props.friend);
    }
});

var MessageComposer = React.createClass({

    propTypes: {
        friendId: ReactPropTypes.string.isRequired
    },

    getInitialState: function () {
        return {text: ''};
    },

    render: function () {
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
    },

    _onChange: function (event, value) {
        var text = event.target.value;
        this.setState({text: text});
    },

    _onKeyDown: function (event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            var text = this.state.text.trim();
            if (text) {
                ChatActions.sendMessage(text, this.props.friendId);
            }
            this.setState({text: ''});
        }
    },

    _onClick: function (event) {
        var text = this.state.text.trim();
        if (text) {
            ChatActions.sendMessage(text, this.props.friendId);
        }
        this.setState({text: ''});
    }

});

var EmoticonsBody = React.createClass({

    getInitialState: function () {
        return {emoticons: EmoticonsStore.getAllEmoticons()};
    },

    componentDidMount: function () {
        EmoticonsStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        EmoticonsStore.removeChangeListener(this._onChange);
    },

    render: function () {
        var self = this;
        var emoticons = this.state.emoticons.map(function (emoticon) {
            return (
                <a href="#" key={emoticon.code} data-code={emoticon.code} alt={emoticon.code} title={emoticon.code}
                   className="emoticon" onClick={function(event){console.log('test')}}
                   dangerouslySetInnerHTML={{ __html: emoticon.image }}></a>
            );
        });
        return (
            <div className="smiley_tooltip">
                {emoticons}
            </div>
        );
    },

    /**
     * Event handler for 'change' events coming from the stores
     */
    _onChange: function () {
        this.setState({emoticons: EmoticonsStore.getAllEmoticons()});
    },

    _onClick: function (event) {
        console.log(event.target);
    }

});

var ChatBox = React.createClass({

    propTypes: {
        friend: ReactPropTypes.object,
        count: ReactPropTypes.number,
        reactKey: ReactPropTypes.string
    },

    getInitialState: function () {
        return {show: true};
    },

    componentDidMount: function () {
        ChatWebApiUtils.getEmoticons();
        MessageStore.addChangeListener(this._onChange);
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
            messagesBody = <MessagesBody friend={friend}/>
            messageComposer = <MessageComposer friendId={friend.id}/>;
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
        return (
            <div
                className="msg_box"
                style={{right: 290 * this.props.count + 'px'}}
                ref="msgBox"
                >
                <div className="msg_head" onClick={this._show}>
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/142996/elastic-man.png" alt=""
                         className="user-avatar"></img>

                    <div className="user-name">{friend.username}</div>
                    <CloseBtn friend={friend}/>
                </div>
                {messagesBody}
                {dropzone}
                {messageComposer}
            </div>
        );
    },

    /**
     * Event handler for 'change' events coming from the stores
     */
    _onChange: function () {
        var show = this.state.show;
        this.setState({show: show});
    },

    _show: function () {
        var show;
        if (this.state.show == true) {
            show = false;
        } else {
            show = true;
        }
        this.setState({show: show})
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
