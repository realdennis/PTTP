import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, Box } from 'ink';
import context from '../state/context';
import ChatInput from '../components/ChatInput';
import logger from '../../utils/logger';
import sendSignal from '../../lib/sendSignal';
import getAES192 from '../../lib/aes192';

const ConnectedRoute = () => {
  const { state, pttpObject } = useContext(context);
  const {
    user: { selfUser, connectedUser },
    encrypt: { sessionKey, iv } = {},
  } = state;
  const { node, topic } = pttpObject;
  const [messages, setMessages] = useState([]);
  const cipherRef = useRef(getAES192(sessionKey, iv));
  useEffect(() => {
    const subCallback = (signal) => {
      try {
        const { data } = signal;
        const decoder = new TextDecoder();
        const dataString = decoder.decode(data) || '';
        const serializeMes = JSON.parse(dataString);
        if (serializeMes.type !== 'CHAT_MESSAGE') return;
        logger('[subCallback] message before decrypt =', serializeMes);
        // serializeMes
        setMessages((messages) => {
          const messagesArr = [
            ...messages,
            {
              ...serializeMes,
              text: cipherRef.current.decrypt(serializeMes.cipherText),
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
    sendSignal(pttpObject, {
      type: 'CHAT_MESSAGE',
      ...selfUser,
      cipherText: cipherRef.current.encrypt(value),
      timestamp: Date.now(),
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
            <Box key={mes.timestamp + '-' + mes.cipherText}>
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
