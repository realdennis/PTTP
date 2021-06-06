import React, { useState, useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import TextInput from 'ink-text-input';

const useIpfsSubMessage = ({
  node,
  nickname,
  topic,
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
    node.pubsub.subscribe(topic, callback);
    return () => node.pubsub.unsubscribe(topic, callback);
  }, []);

  const sendMessage = (text) =>
    node.pubsub.publish(topic, {
      cipherText: text,
      nickname,
    });
  return [messages, sendMessage];
};

const App = ({ nickname, node, sessionKey, authPeerID, topic }) => {
  const [messages, sendMessage] = useIpfsSubMessage({
    node,
    nickname,
    topic,
    authPeerID,
    sessionKey,
  });

  const [input, setInput] = useState('');

  return (
    <>
      <Text color="red">Nickname: {nickname}</Text>
      <Text color="red">Roomname: {topic}</Text>
    </>
  );
};
export default App;
