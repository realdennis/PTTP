import React, { useState, useEffect, useRef } from 'react';
import { Text } from 'ink';
import logger from './utils/logger.js';

const useIpfsPubSubMessage = (ipfsNode, topic) => {
  const [messages, setMessages] = useState([]);

  const callback = (message) => {
    const { data } = message;
    message.key = `${data.toString('utf8')}-${Date.now()}`; // create the unique key
    setMessages((messages) => [...messages, message]);
  };

  const connectRequestCallback = (message) => {
    const { data } = message;
    const { nickname, text } = data;
    if (text === 'connect_request') {
      // log('connect_request')
    }
  };

  useEffect(() => {
    ipfsNode.pubsub.subscribe(topic, callback);
    return () => ipfsNode.pubsub.unsubscribe(topic, callback);
  }, []);

  useEffect(() => {
    ipfsNode.pubsub.subscribe(topic, connectRequestCallback);
    return () => ipfsNode.pubsub.unsubscribe(topic, connectRequestCallback);
  }, []);

  return messages;
};

const App = ({ nickname, ipfsNode, topicID }) => {
  const messages = useIpfsPubSubMessage(ipfsNode, topicID);
  return (
    <>
      <Text color="red">Nickname: {nickname}</Text>
      <Text color="red">Roomname: {topicID}</Text>
      <Text color="green">$ ptp join {topicID}</Text>
      {messages.map(({ data, key }) => (
        <Text key={key}>{data.toString('utf8')}</Text>
      ))}
    </>
  );
};
export default App;
