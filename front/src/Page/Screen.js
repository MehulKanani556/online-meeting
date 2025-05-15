import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import "./../CSS/darshan.css";
import copytext from "../Image/copytext.svg";
import onmicrophone from "../Image/d_onmicrophone.svg";
import offmicrophone from "../Image/d_offmicrophone.svg";
import oncamera from "../Image/d_oncamera.svg";
import offcamera from "../Image/d_offcamera.svg";
import hand from "../Image/d_hand.svg";
import { IoClose } from "react-icons/io5";
import { getAllUsers, getUserById } from "../Redux/Slice/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "../Hooks/useSocket";
import { IMAGE_URL } from "../Utils/baseUrl";
import { Modal } from "react-bootstrap";
import ParticipantVideo from "../Component/ParticipantVideo";
import BottomBar from "../Component/BottomBar";
import MeetingSidebar from "../Component/MeetingSidebar";
import { setIsHandRaised, setMainSectionMargin, setShow } from "../Redux/Slice/meeting.slice";
import { getAllschedule } from "../Redux/Slice/schedule.slice";

function Screen() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const modal = sessionStorage.getItem("MeetingLinkModal");
  const [showMeetingLinkModal, setShowMeetingLinkModal] = useState(
    modal == "false" ? false : true
  );
  const [meetingLink, setMeetingLink] = useState("");
  const [linkCopiedmodal, setLinkCopiedmodal] = useState(false);
  let controlPanel = null;

  useEffect(() => {
    if (location.state && location.state.meetingLink) {
      setMeetingLink(location.state.meetingLink);
    }
  }, [location.state]);

  // Current user information
  const userId = sessionStorage.getItem("userId");
  const meetingStarted = sessionStorage.getItem("meetingStarted");

  const currUser = useSelector((state) => state.user.currUser);
  const userInitials = currUser?.name
    ? `${currUser.name.charAt(0)}${currUser.name.split(" ")[1] ? currUser.name.split(" ")[1].charAt(0) : ""
    }`
    : "U";
  const userName = currUser?.name;

  const allschedule = useSelector((state) => state.schedule.allschedule);

  useEffect(() => {
    let schedule;
    if (allschedule && userId && location.pathname && !meetingStarted) {
      if (allschedule.length > 0) {
        schedule = allschedule.find(schedule => schedule.meetingLink == location.pathname);
      }
      if (schedule && !schedule?.joinBeforeHost) {
        if (schedule?.userId !== userId) {
          navigate("/home");
          return;
        }
      }
    }
  }, [allschedule, location.pathname, userId])

  // Use the socket hook
  const {
    socket,
    isConnected,
    isVideoOff,
    setIsVideoOff,
    isMuted,
    setIsMuted,
    participants,
    setParticipants,
    messages,
    sendMessage,
    emojis,
    sendEmoji,
    unreadMessages,
    markMessagesAsRead,
    toggleChat,
    isChatOpen,
    setIsChatOpen,
    typingUsers,
    emitTypingStatus,
    updateMediaState,
    setupWebRTCHandlers,
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    joinRequests,
    handleJoinRequest,
    systemMessages,
    muteAllUsers
  } = useSocket(userId, roomId, userName, location?.state?.hostUserId);

  // WebRTC State
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showViewMoreDropdown, setShowViewMoreDropdown] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [maxVisibleParticipants, setMaxVisibleParticipants] = useState(9);
  const [messageUser, setmessageUser] = useState("Messages");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [newName, setNewName] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [lastUnreadIndex, setLastUnreadIndex] = useState(-1);
  const [pendingJoinRequests, setPendingJoinRequests] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [InvitePeople, setInvitePeople] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const allusers = useSelector((state) => state.user.allusers);
  const IMG_URL = IMAGE_URL;
  const [recordedChunks, setRecordedChunks] = useState([]);
  const singleSchedule = allschedule.find(schedule => schedule.meetingLink === location.pathname);

  useEffect(() => {
    dispatch(getAllschedule());
    dispatch(getAllUsers());
  }, []);

  const { isHandRaised, show, mainSectionMargin } = useSelector((state) => state.meeting);

  useEffect(() => {
    const currentUserId = currUser?._id;
    const currentUserIsHost = participants.some(
      (participant) =>
        participant.userId === currentUserId && participant.isHost
    );
    setIsHost(currentUserIsHost);
  }, [participants, currUser]);

  // Refs
  const localVideoRef = useRef();
  const peerConnectionsRef = useRef({});
  const messageContainerRef = useRef();
  const videoRefsMap = useRef({});
  const pendingIceCandidatesRef = useRef({});
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);

  // Effect to update pending join requests from socket
  useEffect(() => {
    if (joinRequests) {
      setPendingJoinRequests(joinRequests);
    }
  }, [joinRequests]);

  // Functions to handle join requests
  const acceptJoinRequest = (requestId) => {
    handleJoinRequest(requestId, true);
  };

  const denyJoinRequest = (requestId) => {
    handleJoinRequest(requestId, false);
  };

  // Modify handleShow to include scroll behavior
  const handleShow = (e) => {
    if (e) e.preventDefault();

    // Wait for next tick to ensure DOM is updated
    setTimeout(() => {
      if (messageContainerRef.current) {
        if (unreadMessages > 0) {
          const firstUnreadIndex = messages.length - unreadMessages;
          setLastUnreadIndex(firstUnreadIndex);
          const unreadElement =
            messageContainerRef.current.children[firstUnreadIndex];
          if (unreadElement) {
            unreadElement.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          // If no unread messages, scroll to bottom
          messageContainerRef.current.scrollTop =
            messageContainerRef.current.scrollHeight;
        }
      }
    }, 0);
    markMessagesAsRead();
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (show && windowWidth > 768) {
      dispatch(setMainSectionMargin(380));
    }
  }, [show, windowWidth]);

  // Add this useEffect for handling auto-scroll and unread messages
  useEffect(() => {
    if (messageContainerRef.current) {
      // If chat is open, scroll to bottom
      if (isChatOpen) {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }
      // If chat was closed and now opened, scroll to first unread message
      else if (show && unreadMessages > 0) {
        const firstUnreadIndex = messages.length - unreadMessages;
        setLastUnreadIndex(firstUnreadIndex);
        const unreadElement =
          messageContainerRef.current.children[firstUnreadIndex];
        if (unreadElement) {
          unreadElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages, show, isChatOpen, unreadMessages]);

  // Get current user data
  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [userId, dispatch]);

  // Initialize WebRTC
  useEffect(() => {
    async function setupLocalMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (stream) {
          // Store the stream
          setLocalStream(stream);

          // Initial state for tracks
          const audioTrack = stream.getAudioTracks()[0];
          const videoTrack = stream.getVideoTracks()[0];

          // Ensure audio track is enabled/disabled according to current state
          if (audioTrack) {
            audioTrack.enabled = !isMuted;
          }

          // Ensure video track is enabled/disabled according to current state
          if (videoTrack) {
            videoTrack.enabled = !isVideoOff;
          }

          // Apply to video element with a slight delay to ensure DOM is ready
          setTimeout(() => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          }, 100);

          // Let others know about our initial media state
          updateMediaState("video", !isVideoOff);
          updateMediaState("audio", !isMuted);
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setIsVideoOff(true);
      }
    }

    setupLocalMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      }
    };
  }, [show]);

  // Helper function to create peer connection
  const createPeerConnection = (peerId) => {
    if (peerConnectionsRef.current[peerId]) {
      // If connection exists but is in a failed state, close it and create a new one
      if (
        peerConnectionsRef.current[peerId].connectionState === "failed" ||
        peerConnectionsRef.current[peerId].connectionState === "closed"
      ) {
        peerConnectionsRef.current[peerId].close();
      } else {
        return peerConnectionsRef.current[peerId];
      }
    }

    // console.log(`Creating new peer connection for ${peerId}`);

    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);

    // Add local tracks to the peer connection
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        // console.log(`Adding ${track.kind} track to peer connection for ${peerId}`);
        pc.addTrack(track, localStream);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // console.log(`Sending ICE candidate to ${peerId}`);
        sendIceCandidate(peerId, event.candidate);
      }
    };

    pc.ontrack = (event) => {
      // console.log(`Received ${event.track.kind} track from ${peerId}`, event.streams[0]);

      if (event.streams && event.streams[0]) {
        const remoteStream = event.streams[0];

        setRemoteStreams((prev) => ({ ...prev, [peerId]: remoteStream }));

        const videoElement = videoRefsMap.current[peerId];
        if (videoElement) {
          // console.log(`Applying stream to existing element for ${peerId}`);
          videoElement.srcObject = remoteStream;
          videoElement.autoplay = true;
          videoElement.playsInline = true;
          videoElement
            .play()
            .catch((e) => console.log(`Play error: ${e.message}`));
        }
      }
    };

    // Additional connection state logging
    pc.onconnectionstatechange = () => {
      // console.log(`Connection state changed for ${peerId}: ${pc.connectionState}`);
      if (pc.connectionState === "connected") {
        console.log(`Peer connection with ${peerId} successfully established`);
      } else if (pc.connectionState === "failed") {
        console.log(
          `Connection with ${peerId} failed. Attempting reconnect...`
        );
        // Implement reconnection logic if needed
      }
    };

    // ICE connection state monitoring
    pc.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state changed for ${peerId}: ${pc.iceConnectionState}`
      );
    };

    // Signaling state monitoring
    pc.onsignalingstatechange = () => {
      console.log(
        `Signaling state changed for ${peerId}: ${pc.signalingState}`
      );
    };

    // Store the peer connection
    peerConnectionsRef.current[peerId] = pc;

    // Apply any pending ICE candidates that were received before the peer connection was created
    if (pendingIceCandidatesRef.current[peerId]) {
      // console.log(`Applying ${pendingIceCandidatesRef.current[peerId].length} pending ICE candidates for ${peerId}`);
      pendingIceCandidatesRef.current[peerId].forEach((candidate) => {
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((error) => {
          console.error("Error applying pending ICE candidate:", error);
        });
      });
      delete pendingIceCandidatesRef.current[peerId]; // Clear pending candidates
    }

    return pc;
  };

  // Set up WebRTC peer connections when participants change
  useEffect(() => {
    if (!socket || !localStream || !isConnected) return;

    // Set up WebRTC handlers for signaling
    setupWebRTCHandlers({
      handleOffer: async (from, offer) => {
        // console.log('Received offer from:', from);

        // Create a new RTCPeerConnection if it doesn't exist
        if (!peerConnectionsRef.current[from]) {
          createPeerConnection(from);
        }

        const pc = peerConnectionsRef.current[from];

        try {
          // Check connection state before proceeding
          if (pc.signalingState === "stable") {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendAnswer(from, answer);
          } else {
            console.log(`Cannot process offer - connection not stable: ${pc.signalingState}`);
            // Queue or retry mechanism can be implemented here
          }
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      },

      handleAnswer: async (from, answer) => {
        // console.log('Received answer from:', from);

        const pc = peerConnectionsRef.current[from];
        if (pc) {
          try {
            // Only set remote description if in the correct state
            if (pc.signalingState === "have-local-offer") {
              await pc.setRemoteDescription(new RTCSessionDescription(answer));
              // console.log('Remote description set successfully after answer');
            } else {
              console.log(
                `Cannot process answer - wrong state: ${pc.signalingState}`
              );
              // Implement recovery mechanism if needed
            }
          } catch (error) {
            console.error("Error handling answer:", error);
          }
        }
      },

      handleIceCandidate: async (from, candidate) => {
        // console.log('Received ICE candidate from:', from);

        const pc = peerConnectionsRef.current[from];
        if (pc) {
          try {
            // Only add ICE candidate if we have a remote description
            if (pc.remoteDescription && pc.remoteDescription.type) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
              // Store ICE candidate for later
              if (!pendingIceCandidatesRef.current[from]) {
                pendingIceCandidatesRef.current[from] = [];
              }
              // console.log(`Storing ICE candidate for later - remote description not set yet`);
              pendingIceCandidatesRef.current[from].push(candidate);
            }
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        } else {
          // No peer connection yet, store the ICE candidate
          if (!pendingIceCandidatesRef.current[from]) {
            pendingIceCandidatesRef.current[from] = [];
          }
          // console.log(`Storing ICE candidate for later - no peer connection yet`);
          pendingIceCandidatesRef.current[from].push(candidate);
        }
      },
    });

    // Initialize connections with a delay to ensure socket is ready
    const initializeConnections = async () => {
      // Filter out ourselves
      const peersToConnect = participants.filter((p) => p.id !== socket.id);

      // console.log(`Initializing connections with ${peersToConnect.length} peers`);

      for (const peer of peersToConnect) {
        // Skip if a connection already exists and is in a good state
        if (
          peerConnectionsRef.current[peer.id] &&
          peerConnectionsRef.current[peer.id].connectionState !== "failed" &&
          peerConnectionsRef.current[peer.id].connectionState !== "closed"
        ) {
          continue;
        }

        // console.log('Creating new connection with:', peer.id);
        const pc = createPeerConnection(peer.id);

        try {
          // Wait a bit before creating offer to ensure connection is initialized
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Only create offer if we're in a stable state
          if (pc.signalingState === "stable") {
            const offer = await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            await pc.setLocalDescription(offer);
            sendOffer(peer.id, offer);
          } else {
            console.log(
              `Cannot create offer - wrong state: ${pc.signalingState}`
            );
          }
        } catch (error) {
          console.error("Error creating offer:", error);
        }
      }
    };

    const timer = setTimeout(initializeConnections, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [socket, participants, localStream, isConnected]);

  // This effect ensures remote videos remain connected
  useEffect(() => {
    // Monitor function to periodically check and fix stream connections
    const monitorRemoteStreams = () => {
      participants.forEach((participant) => {
        if (participant.id === socket?.id) return; // Skip self

        const videoElement = videoRefsMap.current[participant.id];
        const remoteStream = remoteStreams[participant.id];

        if (videoElement && remoteStream) {
          // If video doesn't have the right stream
          if (
            !videoElement.srcObject ||
            videoElement.srcObject !== remoteStream
          ) {
            // console.log(`Reapplying stream for ${participant.id} in monitor`);
            videoElement.srcObject = remoteStream;
            videoElement.autoplay = true;
            videoElement.playsInline = true;

            // Ensure video is playing
            if (videoElement.paused) {
              videoElement
                .play()
                .catch((e) => console.log(`Play error: ${e.message}`));
            }
          }

          // Check if track is active but not showing
          const videoTrack = remoteStream.getVideoTracks()[0];
          if (videoTrack && videoTrack.enabled && participant.hasVideo) {
            // Force video display if it should be showing
            videoElement.style.display = "";
          }
        }
      });
    };

    // Run immediately and then every 2 seconds
    monitorRemoteStreams();
    const intervalId = setInterval(monitorRemoteStreams, 2000);

    return () => clearInterval(intervalId);
  }, [participants, remoteStreams]);

  // Add this effect to ensure remote videos stay connected
  useEffect(() => {
    // Function to apply remote streams to video elements
    const applyRemoteStreams = () => {
      participants.forEach((participant) => {
        if (participant.id === socket?.id) return; // Skip self

        const videoElement = videoRefsMap.current[participant.id];
        const remoteStream = remoteStreams[participant.id];

        if (videoElement && remoteStream) {
          // Set stream if it's not already set
          if (videoElement.srcObject !== remoteStream) {
            videoElement.srcObject = remoteStream;
            videoElement.autoplay = true;
            videoElement.playsInline = true;
            videoElement
              .play()
              .catch((e) => console.log(`Play error: ${e.message}`));
          }

          // Make sure video is visible if participant has video on
          if (participant.hasVideo) {
            videoElement.style.display = "";
          }
        }
      });
    };

    // Apply immediately and set interval for continuous checking
    applyRemoteStreams();
    const intervalId = setInterval(applyRemoteStreams, 1000);

    return () => clearInterval(intervalId);
  }, [participants, remoteStreams]);

  // Force local video connection when ref changes
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      // console.log("Setting local video stream to ref");
      // Only update if different
      if (localVideoRef.current.srcObject !== localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    }
  }, [localStream, localVideoRef.current]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        // Toggle the video track's enabled property
        const newVideoState = !videoTrack.enabled;
        videoTrack.enabled = newVideoState;

        // Update state after track is toggled
        setIsVideoOff(!newVideoState);

        // Update peers about video state
        updateMediaState("video", newVideoState);
      }
    } else {
      setIsVideoOff(!isVideoOff);
    }
  }, [localStream, updateMediaState]);

  const setVideoRef = useCallback(
    (peerId) => (element) => {
      if (element) {
        videoRefsMap.current[peerId] = element;
        const stream = remoteStreams[peerId];
        if (stream) {
          element.srcObject = stream;
          element.autoplay = true;
          element.playsInline = true;

          // Force play with retry mechanism
          const playVideo = () => {
            element.play().catch((e) => {
              setTimeout(playVideo, 1000);
            });
          };
          playVideo();
        }
      }
    },
    [remoteStreams]
  );

  // Detect when a participant reconnects (same userId but different socketId)
  useEffect(() => {
    const reconnectingParticipants = participants.filter((p) => {
      // Find participants with same userId but different socketId
      const duplicates = participants.filter(
        (p2) => p2.userId === p.userId && p2.id !== p.id
      );
      return duplicates.length > 0;
    });

    if (reconnectingParticipants.length > 0) {
      // console.log("Detected reconnecting participants:", reconnectingParticipants);

      // For each reconnecting participant, close old connections and establish new ones
      reconnectingParticipants.forEach((participant) => {
        // Find old connection with same userId
        const oldConnections = Object.entries(
          peerConnectionsRef.current
        ).filter(([peerId, pc]) => {
          const peerParticipant = participants.find((p) => p.id === peerId);
          return (
            peerParticipant && peerParticipant.userId === participant.userId
          );
        });

        // Close old connections
        oldConnections.forEach(([peerId, pc]) => {
          // console.log(`Closing old connection for reconnecting user: ${peerId}`);
          pc.close();
          delete peerConnectionsRef.current[peerId];
        });

        // The new connection will be established in the main connection effect
      });
    }
  }, [participants]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        // Toggle the audio track's enabled property
        const newAudioState = !audioTrack.enabled;
        audioTrack.enabled = newAudioState;
        setIsMuted(!newAudioState);

        // Update all peers about our audio state ONLY - make sure only audio property is sent
        updateMediaState("audio", newAudioState);

        // console.log(`Audio toggled. Enabled: ${newAudioState}`);
      }
    } else {
      setIsMuted(!isMuted);
    }
  }, [localStream, updateMediaState]);

  // Separate function to stop screen sharing and restore camera
  const stopScreenSharing = async () => {
    try {
      // Get all screen share tracks and stop them
      const screenTracks = localStream.getVideoTracks();
      screenTracks.forEach((track) => track.stop());

      // Get a new video stream from camera
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const videoTrack = newStream.getVideoTracks()[0];

      // Replace video track in all peer connections
      Object.values(peerConnectionsRef.current).forEach((pc) => {
        const senders = pc.getSenders();
        const sender = senders.find((s) => s.track && s.track.kind === "video");

        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      // Update the local video reference
      if (localVideoRef.current) {
        // Create a combined stream with existing audio and new video
        const combinedStream = new MediaStream();

        // Add existing audio tracks if any
        localStream.getAudioTracks().forEach((track) => {
          combinedStream.addTrack(track);
        });

        // Add the new video track
        combinedStream.addTrack(videoTrack);

        // Set this combined stream to the video element
        localVideoRef.current.srcObject = combinedStream;

        // Also update the localStream reference
        localStream.getVideoTracks().forEach((track) => {
          localStream.removeTrack(track);
        });
        localStream.addTrack(videoTrack);
      }

      setIsScreenSharing(false);

      // Notify peers about screen sharing status
      if (socket) {
        socket.emit("screen-share-status", {
          roomId,
          isScreenSharing: false,
        });
      }
    } catch (error) {
      console.error("Error returning to camera:", error);
    }
  };

  // Share screen
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        // Save reference to original video track to restore later
        const originalVideoTrack = localStream.getVideoTracks()[0];
        if (originalVideoTrack) {
          // Store the original track to restore later
          localStream._originalVideoTrack = originalVideoTrack;
        }

        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];

        // Add event listener for when user stops sharing via browser UI
        videoTrack.onended = async () => {
          await stopScreenSharing();
        };

        Object.values(peerConnectionsRef.current).forEach((pc) => {
          const senders = pc.getSenders();
          const sender = senders.find(
            (s) => s.track && s.track.kind === "video"
          );

          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        // Show screen share in local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        // Update local stream
        if (localStream.getVideoTracks().length > 0) {
          localStream.removeTrack(localStream.getVideoTracks()[0]);
        }
        localStream.addTrack(videoTrack);

        setIsScreenSharing(true);

        // Notify peers about screen sharing status
        if (socket) {
          socket.emit("screen-share-status", {
            roomId,
            isScreenSharing: true,
          });
        }
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    } else {
      await stopScreenSharing();
    }
  };

  // Update the sendMessage handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  // Toggle view more dropdown
  const toggleViewMoreDropdown = () => {
    setShowViewMoreDropdown(!showViewMoreDropdown);
  };

  // End meeting

  let isEndingMeeting = false;

  const endMeeting = () => {
    sessionStorage.removeItem('meetingLinkId');
    sessionStorage.removeItem("MeetingLinkModal");
    sessionStorage.removeItem("renameParticipant");
    sessionStorage.removeItem("meetingStarted");
    if (isEndingMeeting) return; // Prevent further calls
    isEndingMeeting = true;

    if (controlPanel && document.body.contains(controlPanel)) {
      document.body.removeChild(controlPanel);
      controlPanel = null; // Clear the reference
    }

    // Stop all media tracks
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        // Clear the recording timer
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null; // Set to null
      }
    }

    // Ensure originalEndMeeting does not call endMeeting again
    if (typeof originalEndMeeting === "function") {
      // console.log("Calling originalEndMeeting");
      originalEndMeeting(); // Call the original function safely
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    // Close all peer connections
    Object.values(peerConnectionsRef.current).forEach((pc) => {
      pc.close();
    });

    sessionStorage.setItem("openReviewModal", "true");
    navigate("/home");

    // Reset the flag after the meeting ends
    isEndingMeeting = false;
  };

  // Calculate grid columns based on participant count
  const getGridColumns = () => {
    const count = participants.length;
    if (window.innerWidth <= 425) {
      return 2; // Always use 2 columns for small mobile screens
    }
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 2;
    return 3;
  };

  // Calculate grid class based on participant count
  const getGridClass = () => {
    const count = participants.length;
    if (count === 1) return "single-participant";
    if (count === 2) return "two-participants";
    if (count <= 4) return "four-participants";
    return "multi-participants";
  };

  // Set max visible participants based on screen size
  useEffect(() => {
    const handleResize = () => {
      setMaxVisibleParticipants(window.innerWidth <= 425 ? 6 : 9);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get visible participants
  const visibleParticipants = useMemo(
    () => participants.slice(0, maxVisibleParticipants),
    [participants, maxVisibleParticipants]
  );
  const extraParticipants = useMemo(
    () =>
      participants.length > maxVisibleParticipants
        ? participants.length - (maxVisibleParticipants - 1)
        : 0,
    [participants, maxVisibleParticipants]
  );

  // Handle clickoutside for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showViewMoreDropdown &&
        !event.target.closest(".d_dropdown") &&
        !event.target.closest(".d_box1")
      ) {
        setShowViewMoreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showViewMoreDropdown]);

  const handleEmojiClick = (emoji) => {
    sendEmoji(emoji);
  };

  // Add debounce function for typing
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Handle input changes with typing indicator
  const handleMessageInput = (e) => {
    setNewMessage(e.target.value);
    emitTypingStatus(true);

    // Stop typing indicator after 1 second of no input
    debouncedStopTyping();
  };

  const debouncedStopTyping = debounce(() => {
    emitTypingStatus(false);
  }, 2500);

  // Render typing indicator
  const renderTypingIndicator = () => {
    if (typingUsers.length === 0) return null;

    const typingNames = typingUsers
      .filter((user) => user.userId !== userId)
      .map((user) => user.userName);

    if (typingNames.length === 0) return null;

    const displayText = `${typingNames.join(" & ")} is typing...`;

    return (
      <div className="j_typing_indicator mb-2 ms-2 d-flex align-items-center" style={{ color: "#BFBFBF", fontSize: "13px" }}>
        <div className="typing-dots me-1">
          <span className="j_typing_loader"></span>
          <span className="j_typing_loader"></span>
          <span className="j_typing_loader"></span>
        </div>
        {displayText}
      </div>
    );
  };

  // Function to make a participant host
  const makeHost = (newHostId) => {
    if (!socket) return;

    socket.emit("make-host", {
      roomId,
      newHostId,
    });

    setActiveDropdown(null);
  };

  // Function to make a participant co-host
  const makeCohost = (newCohostId) => {
    if (!socket) return;

    socket.emit("make-cohost", {
      roomId,
      newCohostId,
    });

    setActiveDropdown(null);
  };

  // Function to handle participant rename
  const openRenameModal = (participant) => {
    setSelectedParticipant(participant);
    setNewName(participant.name);
    setShowRenameModal(true);
    setActiveDropdown(null);
  };

  const saveNewName = () => {
    if (!socket || !selectedParticipant || !newName.trim()) return;

    socket.emit("rename-participant", {
      roomId,
      participantId: selectedParticipant.id,
      userId: selectedParticipant.userId,
      newName: newName.trim(),
    });

    const renameParticipant =
      JSON.parse(sessionStorage.getItem("renameParticipant")) || [];
    console.log("renameParticipant", selectedParticipant);

    const obj = {
      roomId,
      participantId: selectedParticipant.userId,
      newName: newName.trim(),
    };

    if (renameParticipant.length > 0) {
      if (
        renameParticipant.some((p) => p.participantId === selectedParticipant.userId)
      ) {
        const updatedParticipants = renameParticipant.map((p) =>
          p.participantId === selectedParticipant.userId
            ? { ...p, newName: newName.trim() }
            : p
        );
        sessionStorage.setItem(
          "renameParticipant",
          JSON.stringify(updatedParticipants)
        );
      } else {
        sessionStorage.setItem(
          "renameParticipant",
          JSON.stringify([...renameParticipant, obj])
        );
      }
    } else {
      sessionStorage.setItem("renameParticipant", JSON.stringify([obj]));
    }

    setShowRenameModal(false);
    setSelectedParticipant(null);
  };

  // Function to remove a participant
  const removeParticipant = (participantdata) => {
    if (!socket) return;

    socket.emit("remove-participant", {
      roomId,
      participantId: participantdata.id,
      participantuserId: participantdata.userId,
    });

    setActiveDropdown(null);
  };

  // Add this function to filter participants
  const filteredParticipants = useMemo(
    () =>
      participants.filter((participant) =>
        participant.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      ),
    [participants, searchTerm]
  );

  const handleTextareaResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(120, e.target.scrollHeight) + "px";
  };

  useEffect(() => {
    if (currUser && currUser?.Autorecord) {
      console.log("dasvawv");

      toggleRecording()
    }
  }, [currUser?.Autorecord])

  // record video
  // const toggleRecording = async () => {
  //   if (isRecording) {
  //     // Stop recording
  //     if (mediaRecorderRef.current) {
  //       mediaRecorderRef.current.stop();
  //       setIsRecording(false);
  //       clearInterval(recordingTimerRef.current);
  //       clearInterval(frameCaptureIntervalRef.current); // Stop canvas updates
  //       recordingTimerRef.current = null;

  //       if (socket) {
  //         socket.emit("recording-status-change", {
  //           roomId,
  //           isRecording: false,
  //         });
  //       }
  //     }
  //   } else {
  //     try {
  //       const recordingDiv = recordingDivRef.current;
  //       if (!recordingDiv) {
  //         console.error("Recording div not found");
  //         return;
  //       }

  //       const canvas = document.createElement("canvas");
  //       const rect = recordingDiv.getBoundingClientRect();
  //       canvas.width = rect.width;
  //       canvas.height = rect.height;
  //       const ctx = canvas.getContext("2d");
  //       canvasRef.current = canvas;

  //       const audioContext = new AudioContext();
  //       const audioDestination = audioContext.createMediaStreamDestination();

  //       if (localStream) {
  //         localStream.getAudioTracks().forEach((track) => {
  //           const source = audioContext.createMediaStreamSource(
  //             new MediaStream([track])
  //           );
  //           source.connect(audioDestination);
  //         });
  //       }

  //       Object.values(remoteStreams).forEach((stream) => {
  //         stream.getAudioTracks().forEach((track) => {
  //           const source = audioContext.createMediaStreamSource(
  //             new MediaStream([track])
  //           );
  //           source.connect(audioDestination);
  //         });
  //       });

  //       let lastCapturedImage = null;

  //       const captureHtmlToCanvas = async () => {
  //         if (!recordingDiv) return;

  //         try {
  //           const snapshot = await html2canvas(recordingDiv, {
  //             backgroundColor: null,
  //             useCORS: true,
  //             scale: window.devicePixelRatio || 1,
  //           });
  //           lastCapturedImage = snapshot;
  //         } catch (err) {
  //           console.error("Failed to capture html2canvas", err);
  //         }
  //       };

  //       const drawScreen = () => {
  //         ctx.clearRect(0, 0, canvas.width, canvas.height);
  //         if (lastCapturedImage) {
  //           ctx.drawImage(lastCapturedImage, 0, 0, canvas.width, canvas.height);
  //         }
  //         requestAnimationFrame(drawScreen);
  //       };

  //       drawScreen(); // Kick off animation

  //       // ⏱️ Update canvas content at 30fps
  //       const frameCaptureInterval = setInterval(captureHtmlToCanvas, 33);
  //       frameCaptureIntervalRef.current = frameCaptureInterval;

  //       const canvasStream = canvas.captureStream(30);
  //       audioDestination.stream.getAudioTracks().forEach((track) => {
  //         canvasStream.addTrack(track);
  //       });

  //       const chunks = [];
  //       mediaRecorderRef.current = new MediaRecorder(canvasStream, {
  //         mimeType: "video/webm",
  //       });

  //       mediaRecorderRef.current.ondataavailable = (event) => {
  //         if (event.data.size > 0) chunks.push(event.data);
  //       };

  //       mediaRecorderRef.current.onstop = () => {
  //         if (chunks.length > 0) {
  //           const blob = new Blob(chunks, { type: "video/webm" });
  //           const url = URL.createObjectURL(blob);
  //           const a = document.createElement("a");
  //           a.href = url;
  //           a.download = `meeting-recording-${roomId}-${new Date().toLocaleDateString(
  //             "en-GB"
  //           )}.webm`;
  //           a.style.display = "none";
  //           document.body.appendChild(a);
  //           a.click();
  //           setTimeout(() => {
  //             document.body.removeChild(a);
  //             URL.revokeObjectURL(url);
  //           }, 100);
  //         }
  //       };

  //       mediaRecorderRef.current.start();
  //       setIsRecording(true);
  //       // setRecordedChunks([]);

  //       recordingTimerRef.current = setInterval(() => {
  //         setRecordingTime((prev) => prev + 1);
  //       }, 1000);

  //       if (socket) {
  //         socket.emit("recording-status-change", {
  //           roomId,
  //           isRecording: true,
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error starting recording:", error);
  //     }
  //   }
  // };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      try {
        // Get streams to record - collect all streams
        const streamsToRecord = new Map();

        // Add local stream with ID
        if (localStream && socket) {
          streamsToRecord.set(socket.id, localStream);
        }

        // Add all remote streams with their participant IDs
        Object.entries(remoteStreams).forEach(([peerId, stream]) => {
          streamsToRecord.set(peerId, stream);
        });

        // Check if screen sharing is active and add the screen stream
        if (isScreenSharing && localVideoRef.current) {
          const screenStream = localVideoRef.current.srcObject;
          if (screenStream) {
            streamsToRecord.set('screen', screenStream);
          }
        }

        if (streamsToRecord.size === 0) {
          console.error('No streams available to record');
          return;
        }

        // Create a canvas to combine all video streams
        const canvas = document.createElement('canvas');
        canvas.width = 1920;  // HD width
        canvas.height = 1080;  // HD height
        const ctx = canvas.getContext('2d');

        // Create a combined audio context
        const audioContext = new AudioContext();
        const audioDestination = audioContext.createMediaStreamDestination();

        // Add all audio tracks to the audio destination
        streamsToRecord.forEach((stream) => {
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length > 0) {
            const audioSource = audioContext.createMediaStreamSource(new MediaStream([audioTracks[0]]));
            audioSource.connect(audioDestination);
          }
        });

        // Create a function to draw all videos on the canvas in a grid layout
        const drawVideos = () => {
          // Clear the canvas
          ctx.fillStyle = 'transparent'; // Match the dark background of your app
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Get all participant videos
          const videoElements = [];

          // Add local video
          if (localVideoRef.current) {
            videoElements.push({
              id: socket?.id,
              element: localVideoRef.current,
              hasVideo: !isVideoOff
            });
          }

          // Add remote videos
          participants.forEach(participant => {
            if (participant.id !== socket?.id) { // Skip local participant
              const videoElement = videoRefsMap.current[participant.id];
              if (videoElement) {
                videoElements.push({
                  id: participant.id,
                  element: videoElement,
                  hasVideo: participant.hasVideo !== false
                });
              }
            }
          });

          // Check if screen sharing is active and add it to the video elements
          if (isScreenSharing && localVideoRef.current) {
            videoElements.push({
              id: 'screen',
              element: localVideoRef.current,
              hasVideo: true // Assuming screen sharing is active
            });
          }

          // Calculate grid dimensions
          const count = videoElements.length;
          let cols = 1;
          if (count > 1) cols = 2;
          if (count > 4) cols = 3;
          if (count > 9) cols = 4;

          const rows = Math.ceil(count / cols);
          const cellWidth = (canvas.width / cols) - 20; // Subtracting for gaps
          const cellHeight = (canvas.height / rows) - 20; // Subtracting for gaps

          // Draw each video
          videoElements.forEach((video, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * (cellWidth + 20); // Adding gap
            const y = row * (cellHeight + 20); // Adding gap

            if (video.hasVideo && video.element.srcObject) {
              // Draw the video element
              ctx.drawImage(video.element, x, y, cellWidth, cellHeight);
            } else {
              // Draw a placeholder with avatar
              ctx.fillStyle = `hsl(${video.id?.charCodeAt(0) * 60}, 70%, 45%)`;
              ctx.fillRect(x, y, cellWidth, cellHeight);

              // Draw user initials
              const participant = participants.find(p => p.id === video.id);
              if (participant) {
                ctx.fillStyle = 'white';
                ctx.font = `${cellWidth * 0.2}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(participant.initials, x + cellWidth / 2, y + cellHeight / 2);
              }
            }

            // Draw participant name
            const participant = participants.find(p => p.id === video.id);
            if (participant) {
              ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
              ctx.fillRect(x, y + cellHeight - 30, cellWidth, 30);

              ctx.fillStyle = 'white';
              ctx.font = '16px Arial';
              ctx.textAlign = 'left';
              ctx.fillText(participant.name + (participant.isHost ? ' (Host)' : ''), x + 10, y + cellHeight - 10);
            }
          });

          // Call this function again to keep updating
          requestAnimationFrame(drawVideos);
        };

        // Start drawing
        drawVideos();

        // Create a stream from the canvas
        const canvasStream = canvas.captureStream(30); // 30 FPS

        // Add audio tracks to the canvas stream
        audioDestination.stream.getAudioTracks().forEach(track => {
          canvasStream.addTrack(track);
        });

        // Create MediaRecorder with webm compatible options
        const options = { mimeType: 'video/webm; codecs=vp9,opus' }; // Use webm which is more widely supported
        mediaRecorderRef.current = new MediaRecorder(canvasStream, options);

        setRecordedChunks([]);

        // Set up event handlers
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks(prevChunks => {
              const newChunks = [...prevChunks, event.data];
              return newChunks;
            });
          }
        };

        // mediaRecorderRef.current.onstop = () => {
        //   // Use a local variable to hold the current chunks
        //   const chunksToSave = [...recordedChunks]; // Copy the current state
        //   console.log('Recorded chunks:', chunksToSave);

        //   if (chunksToSave.length > 0) {
        //     const blob = new Blob(chunksToSave, { type: 'video/webm' });
        //     const url = URL.createObjectURL(blob);
        //     const a = document.createElement('a');
        //     a.href = url;
        //     a.download = `meeting-recording-${new Date().toISOString()}-${roomId}.webm`;
        //     document.body.appendChild(a);
        //     a.click();
        //     window.URL.revokeObjectURL(url);
        //     document.body.removeChild(a);
        //     setRecordedChunks([]); // Clear the chunks after saving
        //   } else {
        //     console.error('No recorded chunks available to save.');
        //   }
        // };

        // Start recording
        mediaRecorderRef.current.start();
        setIsRecording(true);

        // If using Socket.io, notify others that recording has started
        if (socket) {
          socket.emit('recording-status-change', {
            roomId,
            isRecording: true
          });
        }

      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (recordedChunks.length > 0 && !isRecording) {
      // The recording has stopped and we have chunks
      const blob = new Blob(recordedChunks, {
        type: 'video/webm'
      });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a download link
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = `meeting-recording-${formatDate(new Date())}-${roomId}.webm`;
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setRecordedChunks([]);
    }
  }, [recordedChunks, isRecording]);

  // Add a socket handler to your useEffect that sets up WebRTC handlers
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Add socket event listener for recording status changes
    socket.on("recording-status-change", ({ userId, isRecording }) => {
      // Update UI to show recording status for the specific user
      setParticipants((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, isRecording } : p))
      );
    });


    // Handle participant removal
    socket.on('participant-removed', ({ participantuserId }) => {
      setParticipants(prev => prev.filter(participant => participant.userId !== participantuserId));
      endMeeting()
    });

    return () => {
      if (socket) {
        socket.off("recording-status-change");
        socket.off("participant-removed");
      }
    };
  }, [socket, isConnected]);

  // const originalStopScreenSharing = stopScreenSharing;
  const originalEndMeeting = endMeeting;

  const toggleHandRaised = () => {
    dispatch(setIsHandRaised());
    socket.emit("hand-status-change", {
      roomId,
      hasRaisedHand: !isHandRaised,
    });
  }

  // picture in picture
  const togglePictureInPicture = async () => {
    try {
      // First check if PiP is supported
      if (!document.pictureInPictureEnabled) {
        console.warn('Picture-in-Picture not supported by this browser');
        return;
      }

      // If already in PiP mode, exit it
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
      }

      // Determine which video source to use
      let sourceStream = null;

      // Check for an active speaker first
      const activeSpeakerParticipant = participants.find(p =>
        p.id !== socket?.id && remoteStreams[p.id] && p.hasVideo !== false
      );

      if (activeSpeakerParticipant && remoteStreams[activeSpeakerParticipant.id]) {
        sourceStream = remoteStreams[activeSpeakerParticipant.id];
      } else if (localStream && !isVideoOff) {
        sourceStream = localStream;
      } else {
        for (const participant of participants) {
          if (participant.id !== socket?.id && participant.hasVideo !== false) {
            if (remoteStreams[participant.id]) {
              sourceStream = remoteStreams[participant.id];
              break;
            }
          }
        }
      }

      if (!sourceStream) {
        console.warn('No video source available for PiP');
        return;
      }

      // Create a video element to use for PiP
      const pipVideo = document.createElement('video');
      pipVideo.muted = true;
      pipVideo.autoplay = true;
      pipVideo.srcObject = sourceStream;

      // Play the video and enter PiP mode
      await pipVideo.play();
      await pipVideo.requestPictureInPicture();

      // Create a floating control panel in the main window
      controlPanel = document.createElement('div');
      controlPanel.style.position = 'fixed';
      controlPanel.style.bottom = '20px';
      controlPanel.style.right = '20px';
      controlPanel.style.backgroundColor = '#212121';
      controlPanel.style.padding = '10px';
      controlPanel.style.borderRadius = '8px';
      controlPanel.style.zIndex = '9999';
      controlPanel.style.display = 'flex';
      controlPanel.style.gap = '15px';

      // Add control buttons
      const createButton = (emoji, label, action) => {
        const button = document.createElement('button');
        button.innerHTML = emoji;
        button.title = label;
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.borderRadius = '50%';
        button.style.border = 'none';
        button.style.fontSize = '18px';
        button.style.cursor = 'pointer';
        button.onclick = action;
        return button;
      };

      // Handle mute toggle
      const micButton = createButton('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>', 'Toggle Audio', () => {
        toggleAudio();
      });
      controlPanel.appendChild(micButton);

      // Handle video toggle
      const videoButton = createButton('<svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.2505 2.17385C17.0385 2.07067 16.8015 2.03006 16.5673 2.05678C16.3331 2.08349 16.1113 2.17643 15.928 2.32469L13.7922 4.03302V3.66719C13.8411 3.24497 13.794 2.81715 13.6542 2.41574C13.5145 2.01432 13.2858 1.6497 12.9852 1.34915C12.6847 1.0486 12.32 0.819901 11.9186 0.680159C11.5172 0.540416 11.0894 0.493249 10.6672 0.542185H3.16719C2.74497 0.493249 2.31715 0.540416 1.91574 0.680159C1.51432 0.819901 1.1497 1.0486 0.849153 1.34915C0.548602 1.6497 0.319901 2.01432 0.180159 2.41574C0.0404158 2.81715 -0.00675141 3.24497 0.0421853 3.66719V10.3339C-0.00675141 10.7561 0.0404158 11.1839 0.180159 11.5853C0.319901 11.9867 0.548602 12.3513 0.849153 12.6519C1.1497 12.9524 1.51432 13.1811 1.91574 13.3209C2.31715 13.4606 2.74497 13.5078 3.16719 13.4589H10.6672C11.0894 13.5078 11.5172 13.4606 11.9186 13.3209C12.32 13.1811 12.6847 12.9524 12.9852 12.6519C13.2858 12.3513 13.5145 11.9867 13.6542 11.5853C13.794 11.1839 13.8411 10.7561 13.7922 10.3339V9.96802L15.928 11.6764C16.1484 11.8543 16.4231 11.9514 16.7064 11.9514C16.8947 11.9511 17.0807 11.9087 17.2505 11.8272C17.4634 11.7258 17.643 11.566 17.7685 11.3663C17.8939 11.1667 17.9599 10.9355 17.9589 10.6997V3.30135C17.9599 3.06557 17.8939 2.83436 17.7685 2.63471C17.643 2.43506 17.4634 2.27521 17.2505 2.17385ZM12.5422 10.3339C12.5422 11.648 11.9814 12.2089 10.6672 12.2089H3.16719C1.85302 12.2089 1.29219 11.648 1.29219 10.3339V3.66719C1.29219 2.35302 1.85302 1.79219 3.16719 1.79219H10.6672C11.9814 1.79219 12.5422 2.35302 12.5422 3.66719V10.3339ZM16.7089 10.7005L13.7922 8.36719V5.63385L16.7089 3.30052V10.7005Z" fill="black"/></svg>', 'Toggle Video', () => {
        toggleVideo();
      });
      controlPanel.appendChild(videoButton);

      // Handle hand raise toggle
      const handButton = createButton('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.438 14.25V4.84375C16.438 3.96875 15.6568 3.21875 14.6567 3.21875C14.4067 3.21875 14.188 3.25 14.0005 3.34375V2.75C14.0005 1.875 13.2192 1.125 12.2192 1.125C11.813 1.125 11.4692 1.25 11.188 1.4375C10.8755 1.0625 10.3442 0.8125 9.78175 0.8125C8.96925 0.8125 8.313 1.3125 8.09425 1.96875C7.8755 1.875 7.6255 1.8125 7.34425 1.8125C6.3755 1.8125 5.563 2.53125 5.563 3.4375V10.5L4.90675 9.6875C4.2505 8.8125 3.0005 8.53125 2.063 9.03125C1.59425 9.28125 1.28175 9.71875 1.15675 10.2188C1.03175 10.75 1.15675 11.2813 1.5005 11.7188C2.063 12.4688 2.65675 13.25 3.21925 14L4.2505 15.375C4.40675 15.5625 4.53175 15.7812 4.688 15.9688C5.1255 16.5938 5.59425 17.2188 6.21925 17.75C7.40675 18.75 9.03175 19.125 10.563 19.125C11.313 19.125 12.0317 19.0312 12.688 18.9062C16.438 18.125 16.438 15.3125 16.438 14.25ZM12.4692 17.875C10.8443 18.2188 8.40675 18.1875 6.938 16.9688C6.438 16.5312 6.03175 15.9688 5.59425 15.375C5.438 15.1563 5.28175 14.9375 5.1255 14.75L4.09425 13.375C3.53175 12.625 2.938 11.8438 2.3755 11.0938C2.21925 10.9062 2.188 10.6875 2.21925 10.4688C2.2505 10.2812 2.3755 10.125 2.563 10C3.03175 9.75 3.688 9.90625 4.0005 10.3437C4.0005 10.3437 4.0005 10.375 4.03175 10.375L5.688 12.3438C5.84425 12.5313 6.063 12.5938 6.28175 12.5C6.5005 12.4062 6.65675 12.2188 6.65675 12V3.46875C6.65675 3.1875 6.96925 2.9375 7.34425 2.9375C7.688 2.9375 8.0005 3.15625 8.0005 3.4375V8.875C8.0005 9.1875 8.2505 9.4375 8.563 9.4375C8.8755 9.4375 9.1255 9.1875 9.1255 8.875V2.46875C9.1255 2.1875 9.438 1.9375 9.813 1.9375C10.188 1.9375 10.5005 2.1875 10.5005 2.46875V9.125C10.5005 9.4375 10.7505 9.6875 11.063 9.6875C11.3755 9.6875 11.6255 9.4375 11.6255 9.125V2.75C11.6255 2.46875 11.938 2.21875 12.313 2.21875C12.688 2.21875 13.0005 2.46875 13.0005 2.75V9.6875C13.0005 10 13.2505 10.25 13.563 10.25C13.8755 10.25 14.1255 10 14.1255 9.6875V4.8125C14.1567 4.53125 14.438 4.3125 14.7817 4.3125C15.1567 4.3125 15.4692 4.5625 15.4692 4.84375V14.2813C15.3442 15.3125 15.3442 17.25 12.4692 17.875Z" fill="black"/></svg>', 'Raise Hand', () => {
        toggleHandRaised();
      });
      controlPanel.appendChild(handButton);

      // End call button
      const endButton = createButton('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M20.145 16.75a2.21 2.21 0 0 1-.527-.065l-2.727-.7a2.636 2.636 0 0 1-1.929-3.078l.117-.578a10.68 10.68 0 0 0-6.13 0l.115.59a2.638 2.638 0 0 1-1.941 3.063l-2.741.693a2.145 2.145 0 0 1-2.293-.875 5.308 5.308 0 0 1-.684-4.171 4.983 4.983 0 0 1 2.326-3.21 16.786 16.786 0 0 1 16.53.013 5.015 5.015 0 0 1 2.339 3.232 5.262 5.262 0 0 1-.673 4.132 2.127 2.127 0 0 1-1.782.954zm-8.128-6.372a12.087 12.087 0 0 1 4.189.747.751.751 0 0 1 .476.853l-.249 1.227a1.137 1.137 0 0 0 .831 1.327l2.723.7a.622.622 0 0 0 .682-.257 3.76 3.76 0 0 0 .469-2.962 3.516 3.516 0 0 0-1.616-2.273 15.286 15.286 0 0 0-15.054-.014 3.481 3.481 0 0 0-1.6 2.251 3.849 3.849 0 0 0 .47 2.987.633.633 0 0 0 .683.254l2.739-.694a1.136 1.136 0 0 0 .836-1.32l-.246-1.238a.75.75 0 0 1 .479-.849 12.269 12.269 0 0 1 4.188-.739z" fill="#000" opacity="1" data-original="#000000"></path></g></svg>', 'End Call', endMeeting);
      controlPanel.appendChild(endButton);

      // End call button
      const shareButton = createButton('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.16741 7.49755C9.22375 7.44121 9.29065 7.39651 9.36426 7.36601C9.43788 7.33552 9.51679 7.31982 9.59647 7.31982C9.67616 7.31982 9.75506 7.33552 9.82868 7.36601C9.9023 7.39651 9.9692 7.44121 10.0255 7.49755L12.5157 9.98747C12.6295 10.1013 12.6934 10.2557 12.6934 10.4166C12.6934 10.5776 12.6294 10.7319 12.5156 10.8457C12.4017 10.9595 12.2474 11.0234 12.0864 11.0234C11.9255 11.0234 11.7711 10.9594 11.6573 10.8456L10.2034 9.39165V13.1827C10.2034 13.3436 10.1394 13.4979 10.0257 13.6117C9.91186 13.7255 9.75752 13.7894 9.59659 13.7894C9.43566 13.7894 9.28132 13.7255 9.16753 13.6117C9.05374 13.4979 8.98981 13.3436 8.98981 13.1827V9.39165L7.53586 10.8456C7.42206 10.9594 7.26772 11.0233 7.10679 11.0233C6.94586 11.0233 6.79152 10.9594 6.67773 10.8456C6.56393 10.7318 6.5 10.5775 6.5 10.4165C6.5 10.2556 6.56393 10.1013 6.67773 9.98747L9.16741 7.49755Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M1 6.47381C1 5.10738 2.10761 4 3.47381 4H15.7262C17.0924 4 18.2 5.10738 18.2 6.47381V14.3629C18.2 15.7291 17.0924 16.8368 15.7262 16.8368H3.47381C2.10761 16.8368 1 15.7291 1 14.3629V6.47381ZM3.47381 5.21357C3.13958 5.21357 2.81903 5.34634 2.58269 5.58269C2.34634 5.81903 2.21357 6.13958 2.21357 6.47381V14.3629C2.21357 14.5284 2.24617 14.6923 2.3095 14.8452C2.37283 14.9981 2.46566 15.137 2.58269 15.2541C2.69971 15.3711 2.83864 15.4639 2.99154 15.5273C3.14444 15.5906 3.30832 15.6232 3.47381 15.6232H15.7262C15.8917 15.6232 16.0556 15.5906 16.2085 15.5273C16.3614 15.4639 16.5003 15.3711 16.6173 15.2541C16.7343 15.137 16.8272 14.9981 16.8905 14.8452C16.9538 14.6923 16.9864 14.5284 16.9864 14.3629V6.47358C16.9864 6.13934 16.8537 5.81879 16.6173 5.58245C16.381 5.34611 16.0604 5.21334 15.7262 5.21334L3.47381 5.21357Z" fill="black"/></svg>', 'share screen', toggleScreenShare);
      controlPanel.appendChild(shareButton);

      // Emoji button to open emoji selection
      const emojiButton = createButton('<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 0C4.02943 0 0 4.02943 0 9C0 13.9706 4.02943 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02943 13.9706 0 9 0ZM9 16.875C4.65075 16.875 1.125 13.3492 1.125 9C1.125 4.65075 4.65075 1.125 9 1.125C13.3492 1.125 16.875 4.65075 16.875 9C16.875 13.3492 13.3492 16.875 9 16.875Z" fill="black"/><path d="M6.1875 7.3125C6.80882 7.3125 7.3125 6.80882 7.3125 6.1875C7.3125 5.56618 6.80882 5.0625 6.1875 5.0625C5.56618 5.0625 5.0625 5.56618 5.0625 6.1875C5.0625 6.80882 5.56618 7.3125 6.1875 7.3125Z" fill="black"/><path d="M11.8125 7.3125C12.4338 7.3125 12.9375 6.80882 12.9375 6.1875C12.9375 5.56618 12.4338 5.0625 11.8125 5.0625C11.1912 5.0625 10.6875 5.56618 10.6875 6.1875C10.6875 6.80882 11.1912 7.3125 11.8125 7.3125Z" fill="black"/><path d="M12.9375 9C12.9375 11.1746 11.1746 12.9375 9 12.9375C6.82538 12.9375 5.0625 11.1746 5.0625 9H3.9375C3.9375 11.7959 6.20406 14.0625 9 14.0625C11.7959 14.0625 14.0625 11.7959 14.0625 9H12.9375Z" fill="black"/></svg>', 'Select Emoji', () => {
        emojiContainer.style.display = emojiContainer.style.display === 'none' ? 'block' : 'none';
      });
      controlPanel.appendChild(emojiButton);

      // Create emoji selection container
      const emojiContainer = document.createElement('div');
      emojiContainer.style.position = 'absolute';
      emojiContainer.style.bottom = '60px'; // Adjust position as needed
      emojiContainer.style.right = '0';
      emojiContainer.style.backgroundColor = '#12161C';
      emojiContainer.style.border = '1px solid #202f41';
      emojiContainer.style.padding = '10px';
      emojiContainer.style.borderRadius = '5px';
      emojiContainer.style.zIndex = '1000';
      emojiContainer.style.display = 'none'; // Initially hidden

      // Add emojis to the container
      ['❤️', '😃', '😮', '🙌', '😂', '🎉', '👏', '💥', '😉', '🔥', '👍', '👎', '▶️', '✨'].forEach(emoji => {
        const emojiSpan = document.createElement('span');
        emojiSpan.innerText = emoji;
        emojiSpan.style.cursor = 'pointer';
        emojiSpan.style.fontSize = '24px';
        emojiSpan.style.margin = '5px';
        emojiSpan.style.color = 'white';
        emojiSpan.onclick = () => {
          sendEmoji(emoji); // Send the selected emoji
          emojiContainer.style.display = 'none'; // Hide the container after selection
        };
        emojiContainer.appendChild(emojiSpan);
      });

      controlPanel.appendChild(emojiContainer);
      document.body.appendChild(controlPanel);

      // Clean up when PiP is closed
      pipVideo.addEventListener('leavepictureinpicture', () => {
        if (controlPanel && document.body.contains(controlPanel)) {
          document.body.removeChild(controlPanel);
          controlPanel = null; // Clear the reference
        }
      }, { once: true });

    } catch (error) {
      console.error('Failed to enter Picture-in-Picture mode:', error);
    }
  };
  // picture in picture without controls
  // const togglePictureInPicture = async () => {
  //     try {
  //         // First check if PiP is supported
  //         if (!document.pictureInPictureEnabled) {
  //             console.warn('Picture-in-Picture not supported by this browser');
  //             return;
  //         }

  //         // If already in PiP mode, exit it
  //         if (document.pictureInPictureElement) {
  //             await document.exitPictureInPicture();
  //             return;
  //         }

  //         // Determine which video to use for PiP
  //         // Priority: 1. Active speaker's video 2. Local video 3. First remote video
  //         let pipVideo = null;

  //         // Check for an active speaker first
  //         const activeSpeakerParticipant = participants.find(p =>
  //             p.id !== socket?.id && remoteStreams[p.id] && p.hasVideo !== false
  //         );

  //         if (activeSpeakerParticipant && videoRefsMap.current[activeSpeakerParticipant.id]) {
  //             pipVideo = videoRefsMap.current[activeSpeakerParticipant.id];
  //         }
  //         // Fallback to local video if no active speaker
  //         else if (localVideoRef.current && localStream && !isVideoOff) {
  //             pipVideo = localVideoRef.current;
  //         }
  //         // Final fallback: use first remote video that's enabled
  //         else {
  //             for (const participant of participants) {
  //                 if (participant.id !== socket?.id && participant.hasVideo !== false) {
  //                     const videoRef = videoRefsMap.current[participant.id];
  //                     if (videoRef && videoRef.srcObject) {
  //                         pipVideo = videoRef;
  //                         break;
  //                     }
  //                 }
  //             }
  //         }

  //         // If we have a valid video element, request PiP
  //         if (pipVideo) {
  //             await pipVideo.requestPictureInPicture();

  //             // Add event listener for when PiP window is closed
  //             pipVideo.addEventListener('leavepictureinpicture', () => {
  //                 console.log('Picture-in-Picture mode closed');
  //             }, { once: true });
  //         } else {
  //             console.warn('No suitable video found for Picture-in-Picture');

  //             // If no video is available, create a temporary one with meeting info
  //             const tempVideo = document.createElement('video');
  //             tempVideo.srcObject = createInfoStream();
  //             tempVideo.autoplay = true;
  //             tempVideo.muted = true;
  //             document.body.appendChild(tempVideo);

  //             try {
  //                 await tempVideo.play();
  //                 await tempVideo.requestPictureInPicture();

  //                 tempVideo.addEventListener('leavepictureinpicture', () => {
  //                     document.body.removeChild(tempVideo);
  //                 }, { once: true });
  //             } catch (err) {
  //                 console.error('Failed to create temporary PiP:', err);
  //                 document.body.removeChild(tempVideo);
  //             }
  //         }
  //     } catch (error) {
  //         console.error('Failed to enter Picture-in-Picture mode:', error);
  //     }
  // };

  // Helper function to create a canvas stream with meeting info when no video is available
  // const createInfoStream = () => {
  //     const canvas = document.createElement('canvas');
  //     canvas.width = 640;
  //     canvas.height = 360;

  //     const ctx = canvas.getContext('2d');

  //     // Draw background
  //     ctx.fillStyle = '#1a1a1a';
  //     ctx.fillRect(0, 0, canvas.width, canvas.height);

  //     // Draw meeting info
  //     ctx.fillStyle = '#ffffff';
  //     ctx.font = '24px Arial';
  //     ctx.textAlign = 'center';
  //     ctx.fillText(`Meeting ID: ${roomId}`, canvas.width / 2, canvas.height / 2 - 20);
  //     ctx.fillText(`Participants: ${participants.length}`, canvas.width / 2, canvas.height / 2 + 20);

  //     // Create animation to keep the stream active
  //     const updateCanvas = () => {
  //         // Update timestamp
  //         ctx.clearRect(0, canvas.width - 200, 200, 30);
  //         ctx.fillText(new Date().toLocaleTimeString(), canvas.width / 2, canvas.height - 30);
  //         requestAnimationFrame(updateCanvas);
  //     };
  //     requestAnimationFrame(updateCanvas);

  //     // Get stream from canvas
  //     return canvas.captureStream();
  // };

  // picture in picture
  // const togglePictureInPicture = async () => {
  //     try {
  //         // First check if PiP is supported
  //         if (!document.pictureInPictureEnabled) {
  //             console.warn('Picture-in-Picture not supported by this browser');
  //             return;
  //         }

  //         // If already in PiP mode, exit it
  //         if (document.pictureInPictureElement) {
  //             await document.exitPictureInPicture();
  //             return;
  //         }

  //         // Determine which video source to use
  //         let sourceStream = null;

  //         // Check for an active speaker first
  //         const activeSpeakerParticipant = participants.find(p =>
  //             p.id !== socket?.id && remoteStreams[p.id] && p.hasVideo !== false
  //         );

  //         if (activeSpeakerParticipant && remoteStreams[activeSpeakerParticipant.id]) {
  //             sourceStream = remoteStreams[activeSpeakerParticipant.id];
  //         } else if (localStream && !isVideoOff) {
  //             sourceStream = localStream;
  //         } else {
  //             for (const participant of participants) {
  //                 if (participant.id !== socket?.id && participant.hasVideo !== false) {
  //                     if (remoteStreams[participant.id]) {
  //                         sourceStream = remoteStreams[participant.id];
  //                         break;
  //                     }
  //                 }
  //             }
  //         }

  //         if (!sourceStream) {
  //             console.warn('No video source available for PiP');
  //             return;
  //         }

  //         // Create a video element to use for PiP
  //         const pipVideo = document.createElement('video');
  //         pipVideo.muted = true;
  //         pipVideo.autoplay = true;
  //         pipVideo.srcObject = sourceStream;

  //         // Play the video and enter PiP mode
  //         await pipVideo.play();
  //         await pipVideo.requestPictureInPicture();

  //         // Create a floating control panel in the main window
  //         const controlPanel = document.createElement('div');
  //         controlPanel.style.position = 'fixed';
  //         controlPanel.style.bottom = '20px';
  //         controlPanel.style.right = '20px';
  //         controlPanel.style.backgroundColor = '#212121';
  //         controlPanel.style.padding = '10px';
  //         controlPanel.style.borderRadius = '8px';
  //         controlPanel.style.zIndex = '9999';
  //         controlPanel.style.display = 'flex';
  //         controlPanel.style.gap = '15px';

  //         // Function to create image buttons
  //         const createImageButton = (src, label, action) => {
  //             const button = document.createElement('button');
  //             button.style.width = '40px';
  //             button.style.height = '40px';
  //             button.style.backgroundColor = 'transparent';
  //             button.style.border = '1px solid #fff';
  //             button.style.borderRadius = '50%';
  //             button.style.cursor = 'pointer';
  //             button.onclick = action;

  //             const img = document.createElement('img');
  //             img.src = src;
  //             img.alt = label;
  //             img.style.width = '18px';
  //             img.style.height = '18px';

  //             button.appendChild(img);
  //             return button;
  //         };

  //         // Create buttons with actual image paths
  //         const micButton = createImageButton(isMuted ? offmicrophone : onmicrophone, 'Toggle Microphone', () => {
  //             toggleAudio();
  //             micButton.firstChild.src = isMuted ? onmicrophone : offmicrophone;
  //         });
  //         controlPanel.appendChild(micButton);

  //         const videoButton = createImageButton(isVideoOff ? offcamera : oncamera, 'Toggle Video', () => {
  //             toggleVideo();
  //             videoButton.firstChild.src = isVideoOff ? oncamera : offcamera;
  //         });
  //         controlPanel.appendChild(videoButton);

  //         const handButton = createImageButton(hand, 'Raise Hand', () => {
  //             toggleHandRaise();
  //         });
  //         controlPanel.appendChild(handButton);

  //         const endButton = createImageButton(endcall, 'End Call', endMeeting);
  //         controlPanel.appendChild(endButton);

  //         document.body.appendChild(controlPanel);

  //         // Clean up when PiP is closed
  //         pipVideo.addEventListener('leavepictureinpicture', () => {
  //             if (document.body.contains(controlPanel)) {
  //                 document.body.removeChild(controlPanel);
  //             }
  //         }, { once: true });

  //     } catch (error) {
  //         console.error('Failed to enter Picture-in-Picture mode:', error);
  //     }
  // };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setFilteredUsers([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!userId) {
      navigate("/login", { state: { from: `/screen/${roomId}` } });
    }
  }, [userId, navigate, roomId]);

  const handleclose = () => {
    setShowMeetingLinkModal(false);
    sessionStorage.setItem("MeetingLinkModal", false);
  };

  return (
    <div className="j_record">
      {location?.state?.status && (
        <Modal
          contentClassName="j_bottom_left_modal"
          backdrop={false}
          show={showMeetingLinkModal}
          onHide={handleclose}
        >
          <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
            <Modal.Title className="j_meeting_title">
              Your Meeting's Ready
            </Modal.Title>
            <IoClose
              style={{ color: "#fff", fontSize: "22px", cursor: "pointer" }}
              onClick={handleclose}
            />
          </Modal.Header>
          <Modal.Body>
            <p>
              Or share this meeting link with others you want in the meeting:
            </p>
            <div className="position-relative">
              <input
                type="text"
                className="form-control j_search_Input text-white"
                value={meetingLink}
                readOnly
                style={{
                  padding: "12px",
                  borderRadius: "5px",
                  border: "none",
                  fontSize: "15px",
                  backgroundColor: "#080E14",
                }}
              />
              <div
                className="position-absolute"
                style={{ top: "20%", right: "4%", cursor: "pointer" }}
              >
                <img
                  src={copytext}
                  alt="copytext-icon"
                  style={{ height: "15px", width: "15px" }}
                  onClick={() => {
                    navigator.clipboard
                      .writeText(meetingLink)
                      .then(() => {
                        setLinkCopiedmodal(true);
                        setTimeout(() => setLinkCopiedmodal(false), 2000);
                      })
                      .catch((err) => {
                        console.error("Failed to copy: ", err);
                      });
                  }}
                />
              </div>
              {linkCopiedmodal && (
                <div className="text-success text-end">Link is copied!</div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      )}
      <div
        className="position-fixed top-0 end-0 p-3 ps-0 pb-0"
        style={{ zIndex: "1" }}
      >
        {pendingJoinRequests.map((request) => (
          <div key={request.requestId} className="j_Invite text-white p-3 mb-2">
            <div className="d-flex align-items-center j_Box_margin">
              <div className="j_join_user">
                {request.userName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <p className="p-0 m-0">
                {request.userName} wants to join this meeting.
              </p>
            </div>
            <div className="mt-2">
              <button
                className="btn j_deny_button me-2"
                onClick={() => denyJoinRequest(request.requestId)}
              >
                Deny
              </button>
              <button
                className="btn j_accept_button"
                onClick={() => acceptJoinRequest(request.requestId)}
              >
                Accept
              </button>
            </div>
          </div>
        ))}

        {systemMessages.slice(-3).map((message, index) => (
          <div
            key={`${message.type}-${message.timestamp}`}
            className="j_system_message text-white p-3 mb-2"
            style={{
              animation: "fadeOut 5s forwards",
              animationDelay: "3s",
            }}
          >
            <div className="d-flex align-items-center">
              <div className={`j_${message.type}_icon me-2`}>
                {message.type === "join" ? "👋" : "🤚"}
              </div>
              <p className="p-0 m-0">
                {message.type === "join"
                  ? `${message.userName} joined the meeting`
                  : `${message.userName} left the meeting`}
              </p>
            </div>
          </div>
        ))}
      </div>
      <section
        className="d_mainsec"
        style={{
          marginRight: windowWidth > 768 ? `${mainSectionMargin}px` : 0,
          transition: "margin-right 0.3s ease-in-out",
        }}
      >
        <div className="d_topbar"></div>
        <div className="d_mainscreen">
          <div
            className={`d_participants-grid ${getGridClass()}`}
            style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}
          >
            {visibleParticipants.map((participant, index) => (
              <div key={participant.id} className="d_grid-item">
                <ParticipantVideo
                  participant={participant}
                  isLocal={participant.id === socket?.id}
                  localVideoRef={localVideoRef}
                  setVideoRef={setVideoRef}
                  isVideoOff={isVideoOff}
                  remoteStreams={remoteStreams}
                  hand={hand}
                  oncamera={oncamera}
                  offcamera={offcamera}
                  onmicrophone={onmicrophone}
                  offmicrophone={offmicrophone}
                  imgpath={IMG_URL}
                />

                {/* Display extra participants indicator */}
                {index === maxVisibleParticipants - 2 &&
                  extraParticipants > 0 && (
                    <div onClick={(e) => {
                      dispatch(setShow(true));
                      dispatch(setIsChatOpen(true));
                      handleShow(e)
                    }
                    } className="d_extra-participants">
                      <span>+{extraParticipants} others</span>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
        <div
          className="d_bottombar"
          style={{
            width:
              windowWidth > 768 && show
                ? `calc(100% - ${mainSectionMargin}px)`
                : "100%",
            transition: "width 0.3s ease-in-out",
          }}
        >
          <BottomBar
            toggleAudio={toggleAudio}
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            toggleVideo={toggleVideo}
            toggleScreenShare={toggleScreenShare}
            toggleRecording={toggleRecording}
            isRecording={isRecording}
            endMeeting={endMeeting}
            toggleViewMoreDropdown={toggleViewMoreDropdown}
            showViewMoreDropdown={showViewMoreDropdown}
            handleEmojiClick={handleEmojiClick}
            handleShow={handleShow}
            unreadMessages={unreadMessages}
            show={show}
            PictureInPicture={togglePictureInPicture}
            socket={socket}
            roomId={roomId}
            participants={participants}
          />
        </div>
      </section>

      {/*  Render active emojis with usernames */}
      <div className="active-emojis">
        {emojis.map(({ sender, message, timestamp }, index) => (
          <div key={index} className="emoji-animation">
            <span className="emoji">{message}</span>
            <span className="user-name">{sender}</span>
          </div>
        ))}
      </div>

      {/* Participants and Chat sidebar (Off-canvas) */}
      <MeetingSidebar
        show={show}
        // handleClose={handleClose}
        windowWidth={windowWidth}
        InvitePeople={InvitePeople}
        setInvitePeople={setInvitePeople}
        messageUser={messageUser}
        setmessageUser={setmessageUser}
        messages={messages}
        participants={participants}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredParticipants={filteredParticipants}
        isHost={isHost}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        makeHost={makeHost}
        makeCohost={makeCohost}
        openRenameModal={openRenameModal}
        toggleAudio={toggleAudio}
        removeParticipant={removeParticipant}
        showRenameModal={showRenameModal}
        setShowRenameModal={setShowRenameModal}
        newName={newName}
        setNewName={setNewName}
        saveNewName={saveNewName}
        searchInputRef={searchInputRef}
        dropdownRef={dropdownRef}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        filteredUsers={filteredUsers}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        markMessagesAsRead={markMessagesAsRead}
        allusers={allusers}
        userId={userId}
        IMG_URL={IMG_URL}
        linkCopied={linkCopied}
        setLinkCopied={setLinkCopied}
        messageContainerRef={messageContainerRef}
        lastUnreadIndex={lastUnreadIndex}
        userName={userName}
        handleSendMessage={handleSendMessage}
        newMessage={newMessage}
        handleMessageInput={handleMessageInput}
        handleTextareaResize={handleTextareaResize}
        renderTypingIndicator={renderTypingIndicator}
        muteAllUsers={muteAllUsers}
        setFilteredUsers={setFilteredUsers}
        singleSchedule={singleSchedule}
      // setFieldValue={setFieldValue}
      />
    </div>
  );
}

export default Screen;



