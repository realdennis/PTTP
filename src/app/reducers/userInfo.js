import actionType from '../constants/actionType.js';

const initialState = {
  peerID: '',
  nickname: '',
  pubKey: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_USER_INFO:
      return { ...action.payload };
    default:
      return state;
  }
};
