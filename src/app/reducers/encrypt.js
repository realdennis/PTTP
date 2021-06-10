import actionType from '../constants/actionType.js';

const initialState = { sessionKey: '' };
export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_SESSION_KEY:
      return { ...action.payload };
    default:
      return state;
  }
};
