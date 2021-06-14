import React from 'react';
import { Box, Text } from 'ink';

const Usage = ({ topic }) => {
  return (
    <Box flexDirection="column">
      <Text>Run the above command in other machine:</Text>
      <Text>$ pttp join {topic}</Text>
    </Box>
  );
};

export default Usage;
