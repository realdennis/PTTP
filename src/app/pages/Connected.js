import React, { useContext } from 'react';
import { Text } from 'ink';
import context from '../state/context';

const ConnectedRoute = () => {
  const { state } = useContext(context);
  const { connectedUserInfo, encrypt: { sessionKey } = {} } = state;

  return (
    <>
      <Text>
        Connected with <Text color="green">{connectedUserInfo.nickname}</Text>
      </Text>
      <Text>Session key = {sessionKey}</Text>
    </>
  );
};
export default ConnectedRoute;
