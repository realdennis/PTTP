import React, { useState, useEffect } from 'react';
import { Text } from 'ink';

const useIpfsSubMessage = ({ node, topicID, authPeerID, sessionKey }) => {
  const [messages, setMessages] = useState([]);
  const callback = (payload) => {
    const { cipherText, from, nickname } = payload;
    if (from !== authPeerID) {
      return;
    }
    setMessages((messages) => [
      ...messages,
      {
        text: cipherText,
        nickname,
        key: `${ciphertext}-${Date.now()}`,
      },
    ]);
  };
  useEffect(() => {
    node.pubsub.subscribe(topicID, callback);
    return () => node.pubsub.unsubscribe(topicID, callback);
  }, []);
  return messages;
};

const App = ({ nickname, node, sessionKey, authPeerID, topicID }) => {
  const messages = useIpfsSubMessage({ node, topicID, authPeerID, sessionKey });
  return (
    <>
      <Text color="red">Nickname: {nickname}</Text>
      <Text color="red">Roomname: {topicID}</Text>
      {messages.map((message) => (
        <>
          <Text key={message.key}>
            {message.nickname}:{message.text}
          </Text>
        </>
      ))}
    </>
  );
};
export default App;
