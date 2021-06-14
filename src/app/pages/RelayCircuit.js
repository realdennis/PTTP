import React, { useState, useContext, useEffect, useRef } from 'react';
import context from '../state/context';
import actionType from '../state/constants/actionType';

const RelayCircuit = () => {
  const { pttpObject, state, dispatch } = useContext(context);
  const { node } = pttpObject;
  const intervalID = useRef(null);
  const [circuitConnected, setCircuitConnected] = useState(false);

  useEffect(() => {
    dispatch({
      type: actionType.SET_PENDING_STATE,
      payload: { isPending: true, text: 'Wait for relay-circuit connected' },
    });
    return () =>
      dispatch({
        type: actionType.SET_PENDING_STATE,
        payload: { isPending: false },
      });
  }, []);
  useEffect(() => {
    // do polling check
    intervalID.current = setInterval(async () => {
      const addrs = await node.swarm.addrs();
      //   const addr = addrs[0].addrs[0];
      if (
        addrs.some((addrObject) => {
          const level2Addrs = addrObject.addrs;
          return level2Addrs.some((addr) => {
            return addr.toString().includes('p2p-circuit');
          });
        })
      ) {
        setCircuitConnected(true);
      }
    }, 5 * 1000);
    // final
    return () => clearInterval(intervalID.current);
  }, []);

  useEffect(() => {
    if (!circuitConnected) return;

    dispatch({
      type: actionType.ROUTE_CHANGE,
      payload: {
        route: 'Initial',
      },
    });
  }, [circuitConnected]);
  return <></>;
};
export default RelayCircuit;
