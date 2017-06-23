var FriendsSection = require('./FriendsSection.react');
var ChatBox = require('./ChatBox.react');
import React, { Component } from 'react';
import $ from 'jquery';
import classNames from 'classnames';
import assign from 'object-assign';

import ChatBoxStore from '../stores/ChatBoxStore';

function getStateFromStores() {
    return {
        boxes: ChatBoxStore.getAllBoxes()
    };
}

class CloseBtn extends Component {

    constructor(props) {
        super(props);
        this.onClick = props.onClick;
    }

    render() {
        return (
            <div className="close__button" onClick={this._onClick.bind(this)}></div>
        );
    }

    _onClick(e) {
        if(this.onClick) {
            this.onClick(e);
        }
    }
}

class OpenChatBtn extends Component {

    constructor(props) {
        super(props);
        this.onClick = props.onClick;
        this.onlineUsers = props.onlineUsers;
        this.chatState = props.chatState;
    }

    componentWillUpdate(props) {
        if(props.chatState !== undefined)
            this.chatState = props.chatState;
    }

    render() {
        let onlineUsers = this.onlineUsers ? this.onlineUsers : 0;
        return(
            <button type="button" className={classNames({
                'chat__button': true,
                'hidden': this.chatState
            })} onClick={this._onClick.bind(this)}>Open</button>
        );
    }

    _onClick(e) {
        if(this.onClick) {
            this.onClick(e);
        }
    }

}

class ChatApp extends Component {

    constructor(props) {
        super(props);
        this.boxes = ChatBoxStore.getAllBoxes();
        // this.show = false;
    }

    componentDidMount() {
        ChatBoxStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        ChatBoxStore.removeChangeListener(this._onChange);
    }

    render() {
        let count = 0;
        let initialPos = 50;
        if(this.show) {
            initialPos = 330;
        } else {
            initialPos = 150;
        }

        let chatBoxes = this.boxes.map((box) => {
            count = count + 1;
            return (
                <ChatBox
                    key={box.id}
                    friend={box.friend}
                    count={count}
                    initialPos={initialPos}
                />
            );
        });

        return (
            <div className="chat__container">
                <OpenChatBtn onClick={this._changeStatus.bind(this)} chatState={this.show} />
                <nav className={classNames({
                    "chat": true,
                    "show-me": this.show
                })}>
                    <div className="chat__header">
                        Chat
                        <CloseBtn onClick={this._changeStatus.bind(this)} />
                    </div>
                    <FriendsSection />
                    {chatBoxes}
                </nav>
            </div>
        );
    }

    _onChange() {
        this.boxes = ChatBoxStore.getAllBoxes();
    }

    _changeStatus() {
        this.show = this.show ? false : true;
        this.setState({
            show: this.show
        });
    }

}

export default ChatApp;
