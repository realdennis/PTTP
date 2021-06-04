import React, { useState, useEffect, useRef } from "react";
import { Text } from "ink";

const useIpfsPubSubMessage = (ipfsNode, topic) => {
  const [messages, setMessages] = useState([]);

  const callback = (message) => {
    const { data } = message;
    message.key = `${data.toString("utf8")}-${Date.now()}`; // create the unique key
    setMessages((messages) => [...messages, message]);
  };

  useEffect(() => {
    ipfsNode.pubsub.subscribe(topic, callback);
    return () => ipfsNode.pubsub.unsubscribe(topic, callback);
  }, []);

  return messages;
};

const App = ({ mode, nickname, ipfsNode, topicID }) => {
  const messages = useIpfsPubSubMessage(ipfsNode, topicID);
  return (
    <>
      <Text color="red">Nickname: {nickname}</Text>
      <Text color="red">Mode: {mode}</Text>
      {mode === "join" ? (
        <Text>join {topicID} ...</Text>
      ) : (
        <Text>$ ptp --join {topicID}</Text>
      )}
      {messages.map(({ data, key }) => (
        <Text key={key}>{data.toString("utf8")}</Text>
      ))}
    </>
  );
};
export default App;
