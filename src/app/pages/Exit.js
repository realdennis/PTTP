import React, { useState, useEffect, useRef } from 'react';
import { Text, Box } from 'ink';

const useTimeout = (ms) => {
  const [isTimeout, setIsTimeout] = useState(false);
  const timerID = useRef(null);
  const cancel = () => timerID.current && clearInterval(timerID.current);
  useEffect(() => {
    timerID.current = setTimeout(() => {
      setIsTimeout(true);
    }, ms);

    return cancel;
  }, [ms]);

  return [isTimeout, cancel];
};
const ExitRoute = ({ timeout = 2 * 1000 }) => {
  /**
   * Exit route:
   * 1. Render the exit message
   * 2. execute process.exit() when timeout.
   */
  const [isTimeout] = useTimeout(timeout);
  useEffect(() => {
    if (isTimeout) {
      process.exit();
    }
  }, [isTimeout]);
  return (
    <Box>
      <Text>Process will exit in {timeout / 1000} seconds</Text>
      {isTimeout && <Text>...Exit!</Text>}
    </Box>
  );
};
export default ExitRoute;
