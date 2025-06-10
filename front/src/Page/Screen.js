import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import ReactDOM from "react-dom/client";
import "./../CSS/darshan.css";
import copytext from "../Image/copytext.svg";
import onmicrophone from "../Image/d_onmicrophone.svg";
import offmicrophone from "../Image/d_offmicrophone.svg";
import oncamera from "../Image/d_oncamera.svg";
import offcamera from "../Image/d_offcamera.svg";
import hand from "../Image/d_hand.svg";
import { IoClose } from "react-icons/io5";
import { getAllUsers, getUserById } from "../Redux/Slice/user.slice";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore } from "../Redux/Store";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useSocket } from "../Hooks/useSocket";
import { IMAGE_URL } from "../Utils/baseUrl";
import { Modal } from "react-bootstrap";
import ParticipantVideo from "../Component/ParticipantVideo";
import BottomBar from "../Component/BottomBar";
import MeetingSidebar from "../Component/MeetingSidebar";
import { setIsHandRaised, setMainSectionMargin, setPipWindow, setShow } from "../Redux/Slice/meeting.slice";
import { getAllschedule } from "../Redux/Slice/schedule.slice";
import { IoIosWarning } from "react-icons/io";

function Screen() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const modal = sessionStorage.getItem("MeetingLinkModal");
  const [showMeetingLinkModal, setShowMeetingLinkModal] = useState(modal == "false" ? false : true);
  const [meetingLink, setMeetingLink] = useState("");
  const [linkCopiedmodal, setLinkCopiedmodal] = useState(false);
  const { store, persistor } = configureStore();
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
  const allschedule = useSelector((state) => state.schedule.allschedule);
  const singleSchedule = allschedule.find(schedule => schedule.meetingLink === location.pathname);
  const { isHandRaised, show, mainSectionMargin, showEmojis, pipWindow } = useSelector((state) => state.meeting);
  const [pipWindowRef, setPipWindowRef] = useState(null);

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

  const [upgrademodal, setupgrademodal] = useState(false)
  const [Screensharemodal, setScreensharemodal] = useState(false)

  const handlecloseupgrademodal = () => setupgrademodal(false)
  const handlecloseScreensharemodal = () => setScreensharemodal(false)

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

  useEffect(() => {
    dispatch(getAllschedule());
    dispatch(getAllUsers());
  }, []);

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
        console.log("remoteStream", remoteStream);

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

  // stop Screen Sharing Separate function to stop screen sharing and restore camera
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

      // Create a combined stream with existing audio and new video
      const combinedStream = new MediaStream();

      // Add existing audio tracks if any
      localStream.getAudioTracks().forEach((track) => {
        combinedStream.addTrack(track);
      });

      // Add the new video track
      combinedStream.addTrack(videoTrack);

      // Update the main screen local video reference
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = combinedStream;
      }

      // Update the PiP window video reference if it exists
      if (pipWindow && !pipWindow.closed) {
        const pipLocalVideo = pipWindow.document.querySelector('video[ref="pipLocalVideoRef"]');
        if (pipLocalVideo) {
          pipLocalVideo.srcObject = combinedStream;
        }

        // Alternative approach: find the video element by looking for the local user's video
        const pipVideos = pipWindow.document.querySelectorAll('video');
        pipVideos.forEach(video => {
          // Check if this is the local video (typically the muted one)
          if (video.muted) {
            video.srcObject = combinedStream;
          }
        });
      }

      // Also update the localStream reference
      localStream.getVideoTracks().forEach((track) => {
        localStream.removeTrack(track);
      });
      localStream.addTrack(videoTrack);

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
    if (["Basic", "Professional"].includes(currUser?.planType)) {
      setScreensharemodal(true);
      return;
    }

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
          const sender = senders.find((s) => s.track && s.track.kind === "video");

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

        // Open Picture-in-Picture and set the reference
        await togglePictureInPicture();
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

    // Close the PiP window if it exists
    if (pipWindow) {
      pipWindow.close(); // Close the PiP window
      dispatch(setPipWindow(null)); // Reset the pipWindow state
    }

    // Also close pipWindowRef if it exists (fallback)
    if (pipWindowRef && !pipWindowRef.closed) {
      pipWindowRef.close();
      setPipWindowRef(null);
    }

    // Disable Picture-in-Picture
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(err => {
        console.error("Error exiting Picture-in-Picture:", err);
      });
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
    // if (window.innerWidth <= 425) {
    //   return 2; // Always use 2 columns for small mobile screens
    // }
    if (window.innerWidth <= 425) {
      if (count === 1) return 1;
      if (count === 2) return 2;
      if (count === 3) return 2; // For 3 participants, use 2 columns to create 1-2 layout
      return 2; // Default to 2 for mobile
    }
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 2;
    return 3;
  };

  // Calculate grid class based on participant count
  // const getGridClass = () => {
  //   const count = participants.length;
  //   if (count === 1) return "single-participant";
  //   if (count === 2) return "two-participants";
  //   if (count <= 4) return "four-participants";
  //   return "multi-participants";
  // };
  const getGridClass = () => {
    const count = participants.length;
    if (window.innerWidth <= 425) {
      if (count === 1) return "mobile-single-participant";
      if (count === 2) return "mobile-two-participants";
      if (count === 3) return "mobile-three-participants";
      return "mobile-multi-participants";
    }
    // Desktop/tablet classes
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
    if (currUser?.planType === "Basic") {
      // Open the upgrade plan popup
      setupgrademodal(true)
      // alert("Please upgrade your plan to start recording."); // Replace this with your actual popup logic
      return; // Exit the function without starting the recording
    }

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
    dispatch(setIsHandRaised({ socket, roomId }));
  }

  // picture in picture
  //   const togglePictureInPicture = async () => {
  //     try {
  //       // First check if PiP is supported
  //       if (!document.pictureInPictureEnabled) {
  //         console.warn('Picture-in-Picture not supported by this browser');
  //         return;
  //       }

  //       // If already in PiP mode, exit it
  //       if (document.pictureInPictureElement) {
  //         await document.exitPictureInPicture();
  //         return;
  //       }

  //       // Create a container for all videos
  //       const pipContainer = document.createElement('div');
  //       pipContainer.style.width = '640px';
  //       pipContainer.style.height = '360px';
  //       pipContainer.style.backgroundColor = '#1a1a1a';
  //       pipContainer.style.position = 'relative';
  //       pipContainer.style.display = 'grid';
  //       pipContainer.style.gap = '8px'; // Increased gap between grid items
  //       pipContainer.style.padding = '8px'; // Increased padding around the grid

  //       // Function to update grid layout based on number of participants
  //       function updateGridLayout(count) {
  //         if (count === 1) {
  //           pipContainer.style.gridTemplateColumns = '1fr';
  //           pipContainer.style.gridTemplateRows = '1fr';
  //         } else if (count === 2) {
  //           pipContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  //           pipContainer.style.gridTemplateRows = '1fr';
  //         } else if (count === 3) {
  //           pipContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  //           pipContainer.style.gridTemplateRows = 'repeat(2, 1fr)';
  //         } else {
  //           pipContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  //           pipContainer.style.gridTemplateRows = 'repeat(2, 1fr)';
  //         }
  //       }

  //       // Create video elements for each participant
  //       const videoElements = [];

  //       // Function to create a video container with name
  //       function createVideoContainer(id, name, stream) {
  //         const container = document.createElement('div');
  //         container.style.position = 'relative';
  //         container.style.width = '100%';
  //         container.style.height = '100%';
  //         container.style.backgroundColor = '#2a2a2a';
  //         container.style.borderRadius = '8px'; // Increased border radius
  //         container.style.overflow = 'hidden';
  //         container.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'; // Added subtle shadow

  //         const video = document.createElement('video');
  //         video.style.width = '100%';
  //         video.style.height = '100%';
  //         video.style.objectFit = 'cover';
  //         video.autoplay = true;
  //         video.playsInline = true;
  //         video.srcObject = stream;

  //         const nameLabel = document.createElement('div');
  //         nameLabel.style.position = 'absolute';
  //         nameLabel.style.bottom = '12px'; // Increased bottom spacing
  //         nameLabel.style.left = '12px'; // Increased left spacing
  //         nameLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  //         nameLabel.style.color = 'white';
  //         nameLabel.style.padding = '6px 12px'; // Increased padding
  //         nameLabel.style.borderRadius = '6px'; // Increased border radius
  //         nameLabel.style.fontSize = '12px';
  //         nameLabel.style.fontFamily = 'Arial, sans-serif';
  //         nameLabel.textContent = name;

  //         container.appendChild(video);
  //         container.appendChild(nameLabel);
  //         return container;
  //       }

  //       // Add local video if enabled
  //       if (localStream && !isVideoOff) {
  //         const localVideoContainer = createVideoContainer(socket?.id, userName, localStream);
  //         pipContainer.appendChild(localVideoContainer);
  //         videoElements.push(localVideoContainer);
  //       }

  //       // Add remote videos
  //       participants.forEach(participant => {
  //         if (participant.id !== socket?.id && participant.hasVideo !== false) {
  //           const stream = remoteStreams[participant.id];
  //           if (stream) {
  //             const videoContainer = createVideoContainer(participant.id, participant.name, stream);
  //             pipContainer.appendChild(videoContainer);
  //             videoElements.push(videoContainer);
  //           }
  //         }
  //       });

  //       // Update grid layout based on number of videos
  //       updateGridLayout(videoElements.length);

  //       // Create a canvas to capture the container
  //       const canvas = document.createElement('canvas');
  //       canvas.width = 640;
  //       canvas.height = 360;
  //       const ctx = canvas.getContext('2d');

  //       // Function to draw the container to canvas
  //       function drawToCanvas() {
  //         ctx.fillStyle = '#1a1a1a';
  //         ctx.fillRect(0, 0, canvas.width, canvas.height);

  //         const totalVideos = videoElements.length;
  //         const cols = totalVideos <= 2 ? totalVideos : 2;
  //         const rows = totalVideos <= 2 ? 1 : Math.ceil(totalVideos / 2);

  //         // Calculate cell dimensions with spacing
  //         const gap = 8; // Gap between cells
  //         const padding = 8; // Padding around the grid
  //         const availableWidth = canvas.width - (padding * 2) - (gap * (cols - 1));
  //         const availableHeight = canvas.height - (padding * 2) - (gap * (rows - 1));
  //         const cellWidth = availableWidth / cols;
  //         const cellHeight = availableHeight / rows;

  //         videoElements.forEach((container, index) => {
  //           const video = container.querySelector('video');
  //           const nameLabel = container.querySelector('div');

  //           if (video) {
  //             const col = index % cols;
  //             const row = Math.floor(index / cols);
  //             const x = padding + (col * (cellWidth + gap));
  //             const y = padding + (row * (cellHeight + gap));

  //             // Draw rounded rectangle background
  //             ctx.fillStyle = '#2a2a2a';
  //             roundRect(ctx, x, y, cellWidth, cellHeight, 8);

  //             // Draw video
  //             ctx.drawImage(video, x, y, cellWidth, cellHeight);

  //             // Draw name label
  //             if (nameLabel) {
  //               const labelWidth = 100;
  //               const labelHeight = 24;
  //               const labelX = x + 12;
  //               const labelY = y + cellHeight - labelHeight - 12;

  //               // Draw label background
  //               ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  //               roundRect(ctx, labelX, labelY, labelWidth, labelHeight, 6);

  //               // Draw label text
  //               ctx.fillStyle = 'white';
  //               ctx.font = '12px Arial';
  //               ctx.fillText(nameLabel.textContent, labelX + 6, labelY + 16);
  //             }
  //           }
  //         });

  //         requestAnimationFrame(drawToCanvas);
  //       }

  //       // Helper function to draw rounded rectangles
  //       function roundRect(ctx, x, y, width, height, radius) {
  //         ctx.beginPath();
  //         ctx.moveTo(x + radius, y);
  //         ctx.lineTo(x + width - radius, y);
  //         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  //         ctx.lineTo(x + width, y + height - radius);
  //         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  //         ctx.lineTo(x + radius, y + height);
  //         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  //         ctx.lineTo(x, y + radius);
  //         ctx.quadraticCurveTo(x, y, x + radius, y);
  //         ctx.closePath();
  //         ctx.fill();
  //       }

  //       // Start drawing
  //       drawToCanvas();

  //       // Create a stream from the canvas
  //       const canvasStream = canvas.captureStream(30);

  //       // Create a video element for PiP
  //       const pipVideo = document.createElement('video');
  //       pipVideo.muted = true;
  //       pipVideo.autoplay = true;
  //       pipVideo.srcObject = canvasStream;

  //       // Play the video and enter PiP mode
  //       await pipVideo.play();
  //       await pipVideo.requestPictureInPicture();

  //       // Create a floating control panel in the main window
  //       controlPanel = document.createElement('div');
  //       controlPanel.style.position = 'fixed';
  //       controlPanel.style.bottom = '20px';
  //       controlPanel.style.right = '0%';
  //       controlPanel.style.transform = 'translateX(-50%)';
  //       controlPanel.style.backgroundColor = 'rgba(32, 33, 36, 0.9)';
  //       controlPanel.style.padding = '8px 16px';
  //       controlPanel.style.borderRadius = '24px';
  //       controlPanel.style.zIndex = '9999';
  //       controlPanel.style.display = 'flex';
  //       controlPanel.style.alignItems = 'center';
  //       controlPanel.style.justifyContent = 'center';
  //       controlPanel.style.gap = '16px';
  //       controlPanel.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.25)';

  //       // Add control buttons
  //       const createButton = (icon, label, action, color = "#5f6368") => {
  //         const button = document.createElement('button');
  //         button.innerHTML = icon;
  //         button.title = label;
  //         button.style.width = '44px';
  //         button.style.height = '44px';
  //         button.style.borderRadius = '50%';
  //         button.style.border = 'none';
  //         button.style.backgroundColor = 'transparent';
  //         button.style.color = color;
  //         button.style.cursor = 'pointer';
  //         button.style.display = 'flex';
  //         button.style.alignItems = 'center';
  //         button.style.justifyContent = 'center';
  //         button.style.transition = 'background-color 0.2s';

  //         // Add hover effect
  //         button.onmouseover = () => {
  //           button.style.backgroundColor = 'rgba(232, 234, 237, 0.08)';
  //         };

  //         button.onmouseout = () => {
  //           button.style.backgroundColor = 'transparent';
  //         };

  //         button.onclick = action;
  //         return button;
  //       };

  //       // Mic toggle button
  //       const micButton = createButton(`
  //    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" fill="currentColor"/>
  //      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" fill="currentColor"/>
  //    </svg>
  //  `, 'Toggle Audio', () => {
  //         toggleAudio();
  //         micButton.style.backgroundColor = isMuted ? '#ea4335' : 'transparent';
  //         micButton.style.color = isMuted ? '#ffffff' : '#5f6368';
  //       });

  //       // If audio is already muted, show muted state
  //       if (isMuted) {
  //         micButton.style.backgroundColor = '#ea4335';
  //         micButton.style.color = '#ffffff';
  //       }

  //       // Video toggle button
  //       const videoButton = createButton(`
  //    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //      <path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z" fill="currentColor"/>
  //    </svg>
  //  `, 'Toggle Video', () => {
  //         toggleVideo();
  //         videoButton.style.backgroundColor = isVideoOff ? '#ea4335' : 'transparent';
  //         videoButton.style.color = isVideoOff ? '#ffffff' : '#5f6368';
  //       });

  //       // If video is already off, show disabled state
  //       if (isVideoOff) {
  //         videoButton.style.backgroundColor = '#ea4335';
  //         videoButton.style.color = '#ffffff';
  //       }

  //       // Hand raise button
  //       const handButton = createButton(`
  //    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.438 14.25V4.84375C16.438 3.96875 15.6568 3.21875 14.6567 3.21875C14.4067 3.21875 14.188 3.25 14.0005 3.34375V2.75C14.0005 1.875 13.2192 1.125 12.2192 1.125C11.813 1.125 11.4692 1.25 11.188 1.4375C10.8755 1.0625 10.3442 0.8125 9.78175 0.8125C8.96925 0.8125 8.313 1.3125 8.09425 1.96875C7.8755 1.875 7.6255 1.8125 7.34425 1.8125C6.3755 1.8125 5.563 2.53125 5.563 3.4375V10.5L4.90675 9.6875C4.2505 8.8125 3.0005 8.53125 2.063 9.03125C1.59425 9.28125 1.28175 9.71875 1.15675 10.2188C1.03175 10.75 1.15675 11.2813 1.5005 11.7188C2.063 12.4688 2.65675 13.25 3.21925 14L4.2505 15.375C4.40675 15.5625 4.53175 15.7812 4.688 15.9688C5.1255 16.5938 5.59425 17.2188 6.21925 17.75C7.40675 18.75 9.03175 19.125 10.563 19.125C11.313 19.125 12.0317 19.0312 12.688 18.9062C16.438 18.125 16.438 15.3125 16.438 14.25ZM12.4692 17.875C10.8443 18.2188 8.40675 18.1875 6.938 16.9688C6.438 16.5312 6.03175 15.9688 5.59425 15.375C5.438 15.1563 5.28175 14.9375 5.1255 14.75L4.09425 13.375C3.53175 12.625 2.938 11.8438 2.3755 11.0938C2.21925 10.9062 2.188 10.6875 2.21925 10.4688C2.2505 10.2812 2.3755 10.125 2.563 10C3.03175 9.75 3.688 9.90625 4.0005 10.3437C4.0005 10.3437 4.0005 10.375 4.03175 10.375L5.688 12.3438C5.84425 12.5313 6.063 12.5938 6.28175 12.5C6.5005 12.4062 6.65675 12.2188 6.65675 12V3.46875C6.65675 3.1875 6.96925 2.9375 7.34425 2.9375C7.688 2.9375 8.0005 3.15625 8.0005 3.4375V8.875C8.0005 9.1875 8.2505 9.4375 8.563 9.4375C8.8755 9.4375 9.1255 9.1875 9.1255 8.875V2.46875C9.1255 2.1875 9.438 1.9375 9.813 1.9375C10.188 1.9375 10.5005 2.1875 10.5005 2.46875V9.125C10.5005 9.4375 10.7505 9.6875 11.063 9.6875C11.3755 9.6875 11.6255 9.4375 11.6255 9.125V2.75C11.6255 2.46875 11.938 2.21875 12.313 2.21875C12.688 2.21875 13.0005 2.46875 13.0005 2.75V9.6875C13.0005 10 13.2505 10.25 13.563 10.25C13.8755 10.25 14.1255 10 14.1255 9.6875V4.8125C14.1567 4.53125 14.438 4.3125 14.7817 4.3125C15.1567 4.3125 15.4692 4.5625 15.4692 4.84375V14.2813C15.3442 15.3125 15.3442 17.25 12.4692 17.875Z" fill="currentColor"/></svg>
  //  `, 'Raise Hand', () => {
  //         toggleHandRaised();
  //         handButton.style.backgroundColor = isHandRaised ? '#fbbc04' : 'transparent';
  //         handButton.style.color = isHandRaised ? '#ffffff' : '#5f6368';
  //       });

  //       // If hand is already raised, show active state
  //       if (isHandRaised) {
  //         handButton.style.backgroundColor = '#fbbc04';
  //         handButton.style.color = '#ffffff';
  //       }

  //       // Screen share button
  //       const shareButton = createButton(`
  //    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //      <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.11-.9-2-2-2H4c-1.11 0-2 .89-2 2v10c0 1.1.89 2 2 2H0v2h24v-2h-4zm-7-3.53v-2.19c-2.78 0-4.61.85-6 2.72.56-2.67 2.11-5.33 6-5.87V7l4 3.73-4 3.74z" fill="currentColor"/>
  //    </svg>
  //  `, 'Share Screen', () => {
  //         toggleScreenShare();
  //         shareButton.style.backgroundColor = isScreenSharing ? '#34a853' : 'transparent';
  //         shareButton.style.color = isScreenSharing ? '#ffffff' : '#5f6368';
  //       });

  //       // If already screen sharing, show active state
  //       if (isScreenSharing) {
  //         shareButton.style.backgroundColor = '#34a853';
  //         shareButton.style.color = '#ffffff';
  //       }

  //       // Add emoji reaction button
  //       const emojiButton = createButton(`
  //    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
  //    </svg>
  //  `, 'Reactions', () => {
  //         emojiContainer.style.display = emojiContainer.style.display === 'none' ? 'flex' : 'none';
  //       });

  //       // End call button - with red background
  //       const endButton = createButton(`
  //    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //      <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" fill="white"/>
  //    </svg>
  //  `, 'End Call', endMeeting, '#ffffff');
  //       endButton.style.backgroundColor = '#ea4335';

  //       // Prevent hover effect for end call button
  //       endButton.onmouseover = () => {
  //         endButton.style.backgroundColor = '#ea4335';
  //       };

  //       endButton.onmouseout = () => {
  //         endButton.style.backgroundColor = '#ea4335';
  //       };

  //       // Add all buttons to control panel
  //       controlPanel.appendChild(micButton);
  //       controlPanel.appendChild(videoButton);
  //       controlPanel.appendChild(handButton);
  //       controlPanel.appendChild(shareButton);
  //       controlPanel.appendChild(emojiButton);
  //       controlPanel.appendChild(endButton);

  //       // Create emoji reaction container
  //       const emojiContainer = document.createElement('div');
  //       emojiContainer.style.position = 'absolute';
  //       emojiContainer.style.bottom = '80px';
  //       emojiContainer.style.right = '0%';
  //       emojiContainer.style.transform = 'translateX(-50%)';
  //       emojiContainer.style.backgroundColor = 'rgba(32, 33, 36, 0.95)';
  //       emojiContainer.style.borderRadius = '24px';
  //       emojiContainer.style.padding = '12px';
  //       emojiContainer.style.display = 'none';
  //       emojiContainer.style.flexWrap = 'wrap';
  //       emojiContainer.style.justifyContent = 'center';
  //       emojiContainer.style.gap = '12px';
  //       emojiContainer.style.maxWidth = '320px';
  //       emojiContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
  //       emojiContainer.style.zIndex = '10000';

  //       // Add emojis to the container
  //       ['👍', '👎', '👏', '🎉', '❤️', '😊', '😂', '😉', '😮', '😢', '😃', '🙌', '✋', '🔥', '💥', '💯', '⭐', '✨', '▶️'].forEach(emoji => {
  //         const emojiButton = document.createElement('button');
  //         emojiButton.innerText = emoji;
  //         emojiButton.style.fontSize = '24px';
  //         emojiButton.style.width = '50px';
  //         emojiButton.style.height = '50px';
  //         emojiButton.style.borderRadius = '50%';
  //         emojiButton.style.border = 'none';
  //         emojiButton.style.backgroundColor = 'rgba(232, 234, 237, 0.12)';
  //         emojiButton.style.cursor = 'pointer';
  //         emojiButton.style.display = 'flex';
  //         emojiButton.style.alignItems = 'center';
  //         emojiButton.style.justifyContent = 'center';

  //         // Add hover effect
  //         emojiButton.onmouseover = () => {
  //           emojiButton.style.backgroundColor = 'rgba(232, 234, 237, 0.2)';
  //         };

  //         emojiButton.onmouseout = () => {
  //           emojiButton.style.backgroundColor = 'rgba(232, 234, 237, 0.12)';
  //         };

  //         emojiButton.onclick = () => {
  //           sendEmoji(emoji);
  //           emojiContainer.style.display = 'none';
  //         };

  //         emojiContainer.appendChild(emojiButton);
  //       });

  //       document.body.appendChild(controlPanel);
  //       // Add emoji container to document
  //       document.body.appendChild(emojiContainer);

  //       // Add click outside functionality to close emoji panel
  //       document.addEventListener('click', (event) => {
  //         if (emojiContainer.style.display !== 'none' &&
  //           !emojiContainer.contains(event.target) &&
  //           !emojiButton.contains(event.target)) {
  //           emojiContainer.style.display = 'none';
  //         }
  //       });

  //       // Clean up when PiP is closed
  //       pipVideo.addEventListener('leavepictureinpicture', () => {
  //         if (controlPanel && document.body.contains(controlPanel)) {
  //           document.body.removeChild(controlPanel);
  //           controlPanel = null;
  //         }
  //         if (emojiContainer && document.body.contains(emojiContainer)) {
  //           document.body.removeChild(emojiContainer);
  //         }
  //       }, { once: true });

  //     } catch (error) {
  //       console.error('Failed to enter Picture-in-Picture mode:', error);
  //     }
  //   };

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

  const WindowContents = ({ isPiP = false, currentUser, pipWindowInstance = null }) => {
    // Create new refs for PiP window
    const pipLocalVideoRef = useRef(null);
    const pipVideoRefs = useRef({});
    const { isHandRaised, show, mainSectionMargin, showEmojis, pipWindow } = useSelector((state) => state.meeting);

    // Create a PiP-specific end meeting handler
    const handlePipEndMeeting = () => {
      // Close the PiP window first
      if (pipWindowInstance && !pipWindowInstance.closed) {
        pipWindowInstance.close();
      }

      // Reset PiP state
      dispatch(setPipWindow(null));
      setPipWindowRef(null);

      // Then call the main end meeting function
      endMeeting();
    };

    // Effect to handle video streams in PiP window
    useEffect(() => {
      if (isPiP) {
        // Set up local video stream
        if (pipLocalVideoRef.current) {
          // Always sync with the main local video stream
          const mainLocalStream = localVideoRef.current?.srcObject;
          if (mainLocalStream && pipLocalVideoRef.current.srcObject !== mainLocalStream) {
            pipLocalVideoRef.current.srcObject = mainLocalStream;
          }
        }

        // Set up remote video streams
        Object.keys(remoteStreams).forEach(participantId => {
          const videoElement = pipVideoRefs.current[participantId];
          if (videoElement && remoteStreams[participantId]) {
            if (videoElement.srcObject !== remoteStreams[participantId]) {
              videoElement.srcObject = remoteStreams[participantId];
            }
          }
        });
      }
    }, [isPiP, remoteStreams, localVideoRef.current?.srcObject, localStream]);

    // Alternative approach: Add a separate effect to monitor localStream changes
    useEffect(() => {
      if (isPiP && pipLocalVideoRef.current && localStream) {
        // Update PiP local video whenever localStream changes
        if (pipLocalVideoRef.current.srcObject !== localStream) {
          pipLocalVideoRef.current.srcObject = localStream;
        }
      }
    }, [isPiP, localStream]);

    const setPipVideoRef = (participantId, element) => {
      if (isPiP) {
        pipVideoRefs.current[participantId] = element;
        // Immediately set the stream if available
        if (element && remoteStreams[participantId]) {
          element.srcObject = remoteStreams[participantId];
        }
      }
    };

    return (
      <div className="App">
        <section className="d_mainsec">
          <div className="d_topbar"></div>
          <div className="d_mainscreen">
            <div
              className={`d_participants-grid ${getGridClass()}`}
              style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}
            >
              {visibleParticipants.map((participant, index) => (
                <div key={participant.id} className="d_grid-item">
                  {/* <ParticipantVideo
                    participant={participant}
                    isLocal={participant.id === socket?.id}
                    localVideoRef={isPiP ? pipLocalVideoRef : localVideoRef}
                    setVideoRef={isPiP ? setPipVideoRef : setVideoRef}
                    isVideoOff={isVideoOff}
                    remoteStreams={remoteStreams}
                    hand={hand}
                    oncamera={oncamera}
                    offcamera={offcamera}
                    onmicrophone={onmicrophone}
                    offmicrophone={offmicrophone}
                    imgpath={IMAGE_URL}
                    isPiP={isPiP}
                    currentUser={currUser}
                  />  */}
                  <div className="d_avatar-container">
                    {participant.id === socket?.id ? (
                      // Local user video
                      <>
                        <video
                          ref={pipLocalVideoRef}
                          className="d_video-element"
                          autoPlay
                          muted
                          playsInline
                          style={{ display: isVideoOff ? "none" : "block" }}
                        />
                        <div
                          className="d_avatar-circle"
                          style={{
                            display: isVideoOff ? "flex" : "none",
                            textTransform: "uppercase",
                            backgroundColor: `hsl(${participant.id.charCodeAt(0) * 60
                              }, 70%, 45%)`,
                          }}
                        >
                          {participant.initials}
                        </div>
                      </>
                    ) : (
                      // Remote participant video
                      <>
                        <video
                          ref={setPipVideoRef(participant.id)}
                          id={`video-${participant.id}`}
                          className="d_video-element"
                          autoPlay
                          playsInline
                          style={{
                            display:
                              remoteStreams[participant.id] &&
                                participant.hasVideo !== false
                                ? "block"
                                : "none",
                          }}
                        />
                        <div
                          className="d_avatar-circle"
                          style={{
                            display:
                              !remoteStreams[participant.id] ||
                                participant.hasVideo === false
                                ? "flex"
                                : "none",
                            textTransform: "uppercase",
                            backgroundColor: `hsl(${participant.id.charCodeAt(0) * 60
                              }, 70%, 45%)`,
                          }}
                        >
                          {participant.initials}
                        </div>
                      </>
                    )}

                    {/* <div className="d_controls-top">
                      <div className="d_controls-container">
                        {participant.hasRaisedHand && (
                          <img
                            src={hand}
                            className="d_control-icon"
                            alt="Hand raised"
                            style={{
                              animation: "d_handWave 1s infinite",
                              transform: "translateY(-2px)",
                            }}
                          />
                        )}
                        <img
                          src={participant.hasVideo ? oncamera : offcamera}
                          className="d_control-icon"
                          alt={participant.hasVideo ? "Camera on" : "Camera off"}
                        />
                      </div>
                    </div> */}

                    <div className="d_controls-bottom">
                      <span className="d_participant-name">
                        {currUser?.participantsNameandVideo ? participant?.name : currentUser?.participantsNameandVideo ? participant?.name : ""}
                        {participant.isHost ? " (Host)" : ""}
                      </span>
                      {/* <div className="d_mic-statu+s">
                        <img
                          src={participant.hasAudio ? onmicrophone : offmicrophone}
                          className="d_control-icon"
                          alt={participant.hasAudio ? "Microphone on" : "Microphone off"}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="d_bottombar" style={{ width: "100%" }}> */}
          <div className="" style={{ width: "100%" }}>
            <div className="" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {/* <div className="d-flex align-items-center d_resposive" style={{ display: "flex", alignItems: "center", }}>
                <div
                  className="d_box"
                  style={{ cursor: "pointer", marginRight: '10px' }}
                  onClick={toggleAudio}
                >
                  <img
                    src={isMuted ? offmicrophone : onmicrophone}
                    alt="microphone"
                  />
                </div>
                <div
                  className="d_box"
                  style={{ cursor: "pointer" }}
                  onClick={toggleVideo}
                >
                  <img src={isVideoOff ? offcamera : oncamera} alt="camera" />
                </div>
              </div> */}
              <div className="d-flex align-items-center" style={{ display: "flex", alignItems: "center", }}>
                <div
                  className="d_box1 d_red"
                  style={{ cursor: "pointer", padding: '10px 14px', borderRadius: '4px', border: '1.2px solid #202F41' }}
                  onClick={isPiP ? handlePipEndMeeting : endMeeting}
                >
                  <p className="mb-0">End Meeting</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const togglePictureInPicture = useCallback(async () => {
    try {
      if (!window.documentPictureInPicture) {
        alert("Document Picture-in-Picture is not supported in this browser.");
        return;
      }

      const dpip = await window.documentPictureInPicture.requestWindow({
        width: 450,
        height: 600,
      });

      // Store the PiP window reference
      setPipWindowRef(dpip);
      dispatch(setPipWindow(dpip));

      // Add necessary styles to the PiP window
      const style = dpip.document.createElement('style');
      style.textContent = `
        body {
          margin: 0;
          padding: 0;
          background: #1a1a1a;
          color: white;
          font-family: -apple-system, sans-serif;
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `;
      dpip.document.head.appendChild(style);

      const link = dpip.document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = `${window.location.origin}/pip.css`;
      dpip.document.head.appendChild(link);

      const pipDiv = dpip.document.createElement("div");
      pipDiv.setAttribute("id", "pip-root");
      dpip.document.body.append(pipDiv);

      const pipRoot = ReactDOM.createRoot(dpip.document.getElementById("pip-root"));
      pipRoot.render(
        <Provider store={store}>
          <WindowContents isPiP={true} currentUser={currUser} pipWindowInstance={dpip} />
        </Provider>
      );

      // Handle window close
      dpip.addEventListener('pagehide', () => {
        // setPipWindow(null);
        setPipWindowRef(null);
        pipRoot.unmount();
        dispatch(setPipWindow(false));
      });

    } catch (error) {
      console.error("Failed to open DocumentPiP window:", error);
    }
  }, [
    pipWindow,
    store,
    getGridClass,
    getGridColumns,
    visibleParticipants,
    socket,
    localVideoRef,
    setVideoRef,
    isVideoOff,
    remoteStreams,
    hand,
    oncamera,
    offcamera,
    onmicrophone,
    offmicrophone,
    toggleAudio,
    isMuted,
    toggleVideo,
    toggleScreenShare,
    toggleRecording,
    isRecording,
    endMeeting,
    toggleViewMoreDropdown,
    showViewMoreDropdown,
    handleEmojiClick,
    handleShow,
    unreadMessages,
    show,
    roomId,
    participants
  ]);

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
          // openWindow={openWindow}
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
        roomId={roomId}
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


      {/* ============= Upgrade Plan Modal ============= */}
      <Modal show={upgrademodal} onHide={handlecloseupgrademodal} className='j_Modal_backcolor' centered>
        <Modal.Header className='border-0 d-flex justify-content-between align-items-center'>
          <Modal.Title className='j_modal_header_text text-white'> Upgrade Plan</Modal.Title>
          <IoClose style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }} onClick={handlecloseupgrademodal} />
        </Modal.Header>
        <div className="j_modal_header"></div>
        <Modal.Body>
          <div className="text-white text-center">
            <IoIosWarning size={40} style={{ color: 'orange' }} />
            <p className="font-Bold">Warning!</p>
            <p>You need to upgrade your plan to start recording.</p>
            <Link to={'/pricing'} target="_blank" onClick={handlecloseupgrademodal}>
              <button className="j_upgrade_plan">Upgrade Plan</button>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
      {/* =============  Screen share Modal ============= */}
      <Modal show={Screensharemodal} onHide={handlecloseScreensharemodal} className='j_Modal_backcolor' centered>
        <Modal.Header className='border-0 d-flex justify-content-between align-items-center'>
          <Modal.Title className='j_modal_header_text text-white'> Upgrade Plan</Modal.Title>
          <IoClose style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }} onClick={handlecloseScreensharemodal} />
        </Modal.Header>
        <div className="j_modal_header"></div>
        <Modal.Body>
          <div className="text-white text-center">
            <IoIosWarning size={40} style={{ color: 'orange' }} />
            <p className="font-Bold">Warning!</p>
            <p>You need to upgrade your plan to Share Screen.</p>
            <Link to={'/pricing'} target="_blank" onClick={handlecloseScreensharemodal}>
              <button className="j_upgrade_plan">Upgrade Plan</button>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Screen;