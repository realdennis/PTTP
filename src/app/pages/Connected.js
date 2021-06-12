import React, { useState, useContext, useEffect } from 'react';
import { Text, Box } from 'ink';
import context from '../state/context';
import ChatInput from '../components/ChatInput';
import logger from '../../utils/logger';
import sendSignal from '../../lib/sendSignal';
const ConnectedRoute = () => {
  const { state, ptpObject } = useContext(context);
  const {
    user: { selfUser, connectedUser },
    encrypt: { sessionKey } = {},
  } = state;
  const { node, topic } = ptpObject;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const subCallback = (signal) => {
      logger('[subCallback] mes=', signal);
      try {
        const { data } = signal;
        const decoder = new TextDecoder();
        const dataString = decoder.decode(data) || '';
        const serializeMes = JSON.parse(dataString);
        if (serializeMes.type !== 'CHAT_MESSAGE') return;
        setMessages((messages) => {
          const messagesArr = [
            ...messages,
            {
              ...serializeMes,
              key: Date.now() + '-' + serializeMes.text,
            },
          ];
          return messagesArr.slice(Math.max(messagesArr.length - 10, 0));
        });
      } catch (e) {
        logger('[subCallback] error', e);
        //do nothing
      }
    };
    node.pubsub.subscribe(topic, subCallback);
    return () => node.pubsub.unsubscribe(topic, subCallback);
  }, []);

  const onSend = (value) =>
    sendSignal(ptpObject, {
      type: 'CHAT_MESSAGE',
      ...selfUser,
      text: value,
      key: Date.now(),
    });
  return (
    <Box flexDirection="column" height="100%">
      <Text>
        Connected with <Text color="green">{connectedUser.nickname}</Text>
      </Text>
      <Text> </Text>
      <Box>
        <Text>{`>> `}</Text>
        <ChatInput onSend={onSend} />
      </Box>
      <Text> </Text>
      <Box flexDirection="column">
        {/* <Text>Session key = {sessionKey}</Text> */}
        {messages.map((mes) => {
          const isMessageFromMe = mes.peerID === selfUser.peerID;
          return (
            <Box key={mes.key}>
              {isMessageFromMe && <Text>(me) </Text>}
              <Text color={isMessageFromMe ? 'blue' : 'green'}>
                {mes.nickname}
              </Text>
              <Text> : {mes.text}</Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
export default ConnectedRoute;
