import { getRequest } from '../utils';

// friend actions
export const GET_FRIENDS = 'GET_FRIENDS';
export const GET_FRIENDS_SUCCESS = 'GET_FRIENDS_SUCCESS';
export const GET_FRIENDS_FAILURE = 'GET_FRIENDS_FAILURE';

export function getFriends() {
    return {
        type: GET_FRIENDS,
        payload: getRequest().get('/get_friends')
    };
}

export function getFriendsSuccess(data) {
    return {
        type: GET_FRIENDS_SUCCESS,
        payload: data
    };
}

export function getFriendsFailure(error) {
    return {
        type: GET_FRIENDS_FAILURE,
        payload: error
    };
}
