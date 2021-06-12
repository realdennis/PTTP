import React, { useContext } from 'react';
import { Text } from 'ink';
import context from '../state/context';

const ConnectedRoute = () => {
  const { state } = useContext(context);
  const {
    user: { connectedUser },
    encrypt: { sessionKey } = {},
  } = state;

  return (
    <>
      <Text>
        Connected with <Text color="green">{connectedUser.nickname}</Text>
      </Text>
      <Text>Session key = {sessionKey}</Text>
    </>
  );
};
export default ConnectedRoute;
