import actionType from '../constants/actionType.js';

const initialState = {
  isPending: false,
  text: '',
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_PENDING_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
