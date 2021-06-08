import React from 'react';
import { Box, Text } from 'ink';
import { UncontrolledTextInput } from 'ink-text-input';
import logger from '../../utils/logger';

const Confirmation = ({ question = '', onSubmit = () => {} }) => {
  const handleSubmit = (value) => {
    const answer = !(value === 'n' || value === 'N');
    onSubmit(answer);
    logger('[Confirmation]', answer);
  };
  return (
    <Box flexDirection="row">
      <Text>{question} (Y/n) </Text>
      <UncontrolledTextInput onSubmit={handleSubmit} />
    </Box>
  );
};

export default Confirmation;
