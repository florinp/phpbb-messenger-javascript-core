import { EventEmitter } from 'events';
import assign from 'object-assign';
import _ from 'underscore';

import Dispatcher from '../dispatcher/Dispatcher';
import {
    OPEN_BOX,
    CLOSE_BOX,
    getBoxes
} from '../actions/chat';

const CHANGE_EVENT = 'change';


let ChatBoxStore = assign({}, EventEmitter.prototype, {

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function (id) {
        let box = _.findWhere(this.getAllBoxes(), {id: id});
        return box || {};
    },

    count: function () {
        let chatBoxes = this.getAllBoxes();
        return chatBoxes.length;
    },

    getAllBoxes: function () {
        let jsonBoxes = window.localStorage.getItem('boxes');
        let boxes = [];
        if(jsonBoxes) {
            boxes = JSON.parse(jsonBoxes);
        }

        return boxes;
    }

});

ChatBoxStore.dispatchToken = Dispatcher.register(function (action) {

    switch (action.type) {
        case OPEN_BOX:
        case CLOSE_BOX:
            ChatBoxStore.emitChange();
            break;
        default:

    }

});

export default ChatBoxStore;
