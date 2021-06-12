import React, { useState } from 'react';
import TextInput from 'ink-text-input';

const ChatInput = ({ onSend = () => {} }) => {
  const [value, setValue] = useState('');
  const handleSubmit = (value) => {
    onSend(value);
    setValue('');
  };
  return (
    <TextInput value={value} onChange={setValue} onSubmit={handleSubmit} />
  );
};

export default ChatInput;
