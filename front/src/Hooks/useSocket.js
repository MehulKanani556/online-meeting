import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:5000"; // Move to environment variable in production


export const useSocket = (userId, allusers) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [reminders, setReminders] = useState([]); // State to hold reminders

    // ===========================socket connection=============================

    useEffect(() => {
        // Clear any existing connection
        if (socketRef.current && isConnected) {
            socketRef.current.disconnect();
        }

        // Only create socket connection if we have a userId
        if (userId && !isConnected) {
            socketRef.current = io(SOCKET_SERVER_URL);

            socketRef.current.on("connect", () => {
                setIsConnected(true);
                // console.log("Socket connected with userId:", userId);
                // Emit user-login after connection
                socketRef.current.emit("user-login", userId);
            });

            socketRef.current.on("disconnect", () => {
                setIsConnected(false);
                console.log("Socket disconnected");
            });

            socketRef.current.on("user-status-changed", (onlineUserIds) => {
                // console.log("Online users updated:", onlineUserIds);
            });

            socketRef.current.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
                setIsConnected(false);
            });

            socketRef.current.on("connect_timeout", () => {
                console.error("Socket connection timeout");
                setIsConnected(false);
            });

            // Handle reminder messages
            socketRef.current.on('reminder', (data) => {
                setReminders(prevReminders => [...prevReminders, data.message]); // Add new reminder to state
            });

            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }
            };
        }
    }, [userId]); // Only depend on userId

    useEffect(() => {
        if (socketRef.current) {
            const handleReminder = (data) => {
                console.log("Received reminder data:", data); // Updated log message for clarity
            };

            socketRef.current.on('reminder', handleReminder);

            // Cleanup function to remove the listener
            return () => {
                if (socketRef.current) { // Check if socketRef.current is not null
                    socketRef.current.off('reminder', handleReminder);
                }
            };
        }
    }, [socketRef.current]); // Add socketRef.current as a dependency

    return {
        socket: socketRef.current,
        reminders // Return reminders state
    };
}
