import React from 'react';
import { Text } from 'ink';
import Spinner from 'ink-spinner';
const SpinnerWithText = ({ text }) => {
  return (
    <Text>
      <Text color="green">
        <Spinner type="dots" />
      </Text>{' '}
      {text}
    </Text>
  );
};

export default SpinnerWithText;
