import React, { useState, useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import TextInput from 'ink-text-input';

const useIpfsSubMessage = ({
  node,
  nickname,
  topicID,
  authPeerID,
  sessionKey,
}) => {
  const [messages, setMessages] = useState([]);
  const callback = (mes) => {
    const { data: payload, from } = mes;
    const { cipherText, nickname } = payload;
    if (from !== authPeerID) {
      return;
    }
    setMessages((messages) => [
      ...messages,
      {
        text: cipherText,
        nickname,
        key: cipherText + Date.now(),
      },
    ]);
  };
  useEffect(() => {
    node.pubsub.subscribe(topicID, callback);
    return () => node.pubsub.unsubscribe(topicID, callback);
  }, []);

  const sendMessage = (text) =>
    node.pubsub.publish(topicID, {
      cipherText: text,
      nickname,
    });
  return [messages, sendMessage];
};

const App = ({ nickname, node, sessionKey, authPeerID, ownID, topicID }) => {
  const [messages, sendMessage] = useIpfsSubMessage({
    node,
    nickname,
    topicID,
    authPeerID,
    sessionKey,
  });

  const [input, setInput] = useState('');

  return (
    <>
      <Text color="red">Nickname: {nickname}</Text>
      <Text color="red">Roomname: {topicID}</Text>
    </>
  );
};
export default App;
