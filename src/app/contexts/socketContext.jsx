import { FullScreenLoader } from '@/components/loaders/fullScreenLoader';
import { getBackendUrl } from '@/lib/utils';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import PropTypes from 'prop-types';

const SocketContext = createContext();

export const SocketProvider = ({ labName, children }) => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(getBackendUrl('/'));

    socketRef.current?.on('connect', () => {
      socketRef.current?.emit('labStart', labName);

      socketRef.current?.on('labStarted', () => {
        setIsConnected(true);
      });

      socketRef.current?.on('labStartFailed', (err) => {
        toast.error(err);
        navigate('/');
        setIsConnected(false);
      });
    });

    socketRef.current?.on('labDisconnected', () => {
      setIsConnected(false);
      socketRef.current?.connect();
    });

    socketRef.current?.on('disconnect', () => {
      setIsConnected(false);
      socketRef.current?.connect();
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [labName]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {isConnected ? children : <FullScreenLoader />}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  labName: PropTypes.string,
  children: PropTypes.node,
};

export const useSocket = () => useContext(SocketContext);
