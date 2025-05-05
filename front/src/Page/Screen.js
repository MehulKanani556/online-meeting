import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import "./../CSS/darshan.css";
import search from "../Image/Search.png";
import copytext from "../Image/copytext.svg";
import left from "../Image/left.svg";
import inviteuser from "../Image/inviteuser.svg";
import onmicrophone from "../Image/d_onmicrophone.svg";
import offmicrophone from "../Image/d_offmicrophone.svg";
import endcall from "../Image/endcall.svg";
import oncamera from "../Image/d_oncamera.svg";
import offcamera from "../Image/d_offcamera.svg";
import upload from "../Image/d_upload.svg";
import recording from "../Image/d_target.svg";
import smile from "../Image/d_smile.svg";
import podcast from "../Image/d_podcast.svg";
import hand from "../Image/d_hand.svg";
import bar from "../Image/d_bar.svg";
import Button from "react-bootstrap/Button";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoClose, IoSearch } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { getAllUsers, getUserById } from "../Redux/Slice/user.slice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "../Hooks/useSocket";
import html2canvas from "html2canvas";
import { IMAGE_URL } from "../Utils/baseUrl";
import { Formik } from "formik";
import { Modal } from "react-bootstrap";
import ParticipantVideo from "../Component/ParticipantVideo";
import BottomBar from "../Component/BottomBar";
import MeetingSidebar from "../Component/MeetingSidebar";
import { setMainSectionMargin, setShow } from "../Redux/Slice/meeting.slice";

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
      // setShowMeetingLinkModal(true);
    }
  }, [location.state]);

  // Current user information
  const userId = sessionStorage.getItem("userId");
  const currUser = useSelector((state) => state.user.currUser);
  const userInitials = currUser?.name
    ? `${currUser.name.charAt(0)}${
        currUser.name.split(" ")[1] ? currUser.name.split(" ")[1].charAt(0) : ""
      }`
    : "U";
  const userName = currUser?.name;

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
  } = useSocket(userId, roomId, userName);

  // WebRTC State
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showViewMoreDropdown, setShowViewMoreDropdown] = useState(false);
  //   const [show, setShow] = useState(false);
//   const [showEmojis, setshowEmojis] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [maxVisibleParticipants, setMaxVisibleParticipants] = useState(9);
  const [messageUser, setmessageUser] = useState("Messages");
  const [activeDropdown, setActiveDropdown] = useState(null);
//   const [mainSectionMargin, setMainSectionMargin] = useState(0);
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

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);
  const { isHandRaised, show, mainSectionMargin } = useSelector(
    (state) => state.meeting
  );

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
  const recordingDivRef = useRef(null);
  const frameCaptureIntervalRef = useRef(null);
  const canvasRef = useRef(null);

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
    // dispatch(setShow(true));
    // dispatch(setIsChatOpen(true));

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
    dispatch(getUserById(userId));
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
            console.log(
              `Cannot process offer - connection not stable: ${pc.signalingState}`
            );
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

  // Video ref setup - CRITICAL FIX
  // Improve the setVideoRef function
  // const setVideoRef = (peerId) => (element) => {
  //     if (element) {
  //         // Store the reference
  //         videoRefsMap.current[peerId] = element;

  //         // Get the stream if available
  //         const stream = remoteStreams[peerId];

  //         // Apply stream and ensure video plays
  //         if (stream) {
  //             element.srcObject = stream;
  //             element.autoplay = true;
  //             element.playsInline = true;

  //             // Force play with retry mechanism
  //             const playVideo = () => {
  //                 element.play().catch(e => {
  //                     setTimeout(playVideo, 1000);
  //                 });
  //             };
  //             playVideo();
  //         }
  //     }
  // };
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
  // const endMeeting = () => {
  //     // Stop all media tracks
  //     if (localStream) {
  //         localStream.getTracks().forEach(track => track.stop());
  //     }

  //     // Close all peer connections
  //     Object.values(peerConnectionsRef.current).forEach(pc => {
  //         pc.close();
  //     });

  //     sessionStorage.setItem('openReviewModal', 'true');
  //     navigate("/home");
  // };
  let isEndingMeeting = false;

  const endMeeting = () => {
    sessionStorage.removeItem("MeetingLinkModal");
    if (isEndingMeeting) return; // Prevent further calls
    isEndingMeeting = true;

    if (controlPanel && document.body.contains(controlPanel)) {
      document.body.removeChild(controlPanel);
      controlPanel = null; // Clear the reference
    }
    // console.log("endMeeting called");

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
  // const endMeeting = () => {
  //     // Stop all media tracks

  //     if (isRecording) {
  //         if (mediaRecorderRef.current) {
  //             mediaRecorderRef.current.stop();
  //             setIsRecording(false);
  //         }
  //     }

  //     // Then proceed with the original function
  //     originalEndMeeting();

  //     if (localStream) {
  //         localStream.getTracks().forEach(track => track.stop());
  //     }

  //     // Close all peer connections
  //     Object.values(peerConnectionsRef.current).forEach(pc => {
  //         pc.close();
  //     });

  //     sessionStorage.setItem('openReviewModal', 'true');
  //     navigate("/home");
  // };

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
      <div
        className="typing-indicator mb-2 ms-2 d-flex align-items-center"
        style={{ color: "#BFBFBF", fontSize: "13px" }}
      >
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
      newName: newName.trim(),
    });

    const renameParticipant = JSON.parse(sessionStorage.getItem("renameParticipant")) || [];
    if (renameParticipant) {
      const updatedParticipants = renameParticipant.map(p => p.participantId === selectedParticipant.id ? { ...p, newName: newName.trim() } : p);
      sessionStorage.setItem("renameParticipant", JSON.stringify(updatedParticipants));
    } else {
      sessionStorage.setItem("renameParticipant", JSON.stringify([{
        roomId,
        participantId: selectedParticipant.id,
        newName: newName.trim(),
      }]));
    }

    setShowRenameModal(false);
    setSelectedParticipant(null);
  };

  // Function to remove a participant
  const removeParticipant = (participantId) => {
    if (!socket) return;

    socket.emit("remove-participant", {
      roomId,
      participantId,
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

  // record video
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        clearInterval(recordingTimerRef.current);
        clearInterval(frameCaptureIntervalRef.current); // Stop canvas updates
        recordingTimerRef.current = null;

        if (socket) {
          socket.emit("recording-status-change", {
            roomId,
            isRecording: false,
          });
        }
      }
    } else {
      try {
        const recordingDiv = recordingDivRef.current;
        if (!recordingDiv) {
          console.error("Recording div not found");
          return;
        }

        const canvas = document.createElement("canvas");
        const rect = recordingDiv.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext("2d");
        canvasRef.current = canvas;

        const audioContext = new AudioContext();
        const audioDestination = audioContext.createMediaStreamDestination();

        if (localStream) {
          localStream.getAudioTracks().forEach((track) => {
            const source = audioContext.createMediaStreamSource(
              new MediaStream([track])
            );
            source.connect(audioDestination);
          });
        }

        Object.values(remoteStreams).forEach((stream) => {
          stream.getAudioTracks().forEach((track) => {
            const source = audioContext.createMediaStreamSource(
              new MediaStream([track])
            );
            source.connect(audioDestination);
          });
        });

        let lastCapturedImage = null;

        const captureHtmlToCanvas = async () => {
          if (!recordingDiv) return;

          try {
            const snapshot = await html2canvas(recordingDiv, {
              backgroundColor: null,
              useCORS: true,
              scale: window.devicePixelRatio || 1,
            });
            lastCapturedImage = snapshot;
          } catch (err) {
            console.error("Failed to capture html2canvas", err);
          }
        };

        const drawScreen = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (lastCapturedImage) {
            ctx.drawImage(lastCapturedImage, 0, 0, canvas.width, canvas.height);
          }
          requestAnimationFrame(drawScreen);
        };

        drawScreen(); // Kick off animation

        // ⏱️ Update canvas content at 30fps
        const frameCaptureInterval = setInterval(captureHtmlToCanvas, 33);
        frameCaptureIntervalRef.current = frameCaptureInterval;

        const canvasStream = canvas.captureStream(30);
        audioDestination.stream.getAudioTracks().forEach((track) => {
          canvasStream.addTrack(track);
        });

        const chunks = [];
        mediaRecorderRef.current = new MediaRecorder(canvasStream, {
          mimeType: "video/webm",
        });

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) chunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          if (chunks.length > 0) {
            const blob = new Blob(chunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `meeting-recording-${roomId}-${new Date().toLocaleDateString(
              "en-GB"
            )}.webm`;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 100);
          }
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        // setRecordedChunks([]);

        recordingTimerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);

        if (socket) {
          socket.emit("recording-status-change", {
            roomId,
            isRecording: true,
          });
        }
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    }
  };

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

    return () => {
      if (socket) {
        socket.off("recording-status-change");
      }
    };
  }, [socket, isConnected]);

  // const originalStopScreenSharing = stopScreenSharing;
  const originalEndMeeting = endMeeting;

  const [recordingTime, setRecordingTime] = useState(0);

  const formatRecordingTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  // picture in picture
  // let controlPanel = null;
  let pipVideo = null;
  let pipTracker = null;

  const togglePictureInPicture = async () => {
    try {
      // First check if PiP is supported
      if (!document.pictureInPictureEnabled) {
        console.warn("Picture-in-Picture not supported by this browser");
        return;
      }

      // If already in PiP mode, exit it
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        if (controlPanel && document.body.contains(controlPanel)) {
          document.body.removeChild(controlPanel);
          controlPanel = null;
        }
        if (pipTracker) {
          clearInterval(pipTracker);
          pipTracker = null;
        }
        return;
      }

      // Determine which video source to use
      let sourceStream = null;

      // Check for an active speaker first
      const activeSpeakerParticipant = participants.find(
        (p) =>
          p.id !== socket?.id && remoteStreams[p.id] && p.hasVideo !== false
      );

      if (
        activeSpeakerParticipant &&
        remoteStreams[activeSpeakerParticipant.id]
      ) {
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
        console.warn("No video source available for PiP");
        return;
      }

      // Create the video element for PiP
      pipVideo = document.createElement("video");
      pipVideo.muted = true;
      pipVideo.autoplay = true;
      pipVideo.srcObject = sourceStream;

      // Create a control panel
      controlPanel = document.createElement("div");
      controlPanel.style.position = "fixed";
      controlPanel.style.bottom = "20px";
      controlPanel.style.right = "20px";
      controlPanel.style.backgroundColor = "rgba(33, 33, 33, 0.8)";
      controlPanel.style.padding = "10px";
      controlPanel.style.borderRadius = "8px";
      controlPanel.style.display = "flex";
      controlPanel.style.gap = "15px";
      controlPanel.style.zIndex = "9999";
      controlPanel.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";

      // Add a label
      const label = document.createElement("div");
      label.textContent = "PiP Controls";
      label.style.color = "#fff";
      label.style.marginRight = "10px";
      label.style.display = "flex";
      label.style.alignItems = "center";
      controlPanel.appendChild(label);

      // Add control buttons
      const createButton = (emoji, label, action) => {
        const button = document.createElement("button");
        button.innerHTML = emoji;
        button.title = label;
        button.style.width = "40px";
        button.style.height = "40px";
        button.style.borderRadius = "50%";
        button.style.border = "none";
        button.style.fontSize = "18px";
        button.style.cursor = "pointer";
        button.onclick = action;
        return button;
      };

      // Handle mute toggle
      const micButton = createButton("🎤", "Toggle Audio", () => {
        toggleAudio();
      });
      controlPanel.appendChild(micButton);

      // Handle video toggle
      const videoButton = createButton("📷", "Toggle Video", () => {
        toggleVideo();
      });
      controlPanel.appendChild(videoButton);

      // Handle hand raise toggle
      //   const handButton = createButton("✋", "Raise Hand", () => {
      //     toggleHandRaise();
      //   });
      //   controlPanel.appendChild(handButton);

      // End call button
      const endButton = createButton("📞", "End Call", () => {
        endMeeting();
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture();
        }
      });
      controlPanel.appendChild(endButton);

      // Add the control panel to the document
      document.body.appendChild(controlPanel);

      // Play the video and enter PiP mode
      await pipVideo.play();
      await pipVideo.requestPictureInPicture();

      // Track PiP window position (with limitations)
      // Note: Browsers restrict direct access to PiP window position
      pipTracker = setInterval(() => {
        if (!document.pictureInPictureElement) {
          clearInterval(pipTracker);
          pipTracker = null;

          if (controlPanel && document.body.contains(controlPanel)) {
            document.body.removeChild(controlPanel);
            controlPanel = null;
          }
        }
      }, 1000);

      // Clean up when PiP is closed
      pipVideo.addEventListener(
        "leavepictureinpicture",
        () => {
          if (controlPanel && document.body.contains(controlPanel)) {
            document.body.removeChild(controlPanel);
            controlPanel = null;
          }

          if (pipTracker) {
            clearInterval(pipTracker);
            pipTracker = null;
          }
        },
        { once: true }
      );
    } catch (error) {
      console.error("Failed to enter Picture-in-Picture mode:", error);
      // Clean up on error
      if (controlPanel && document.body.contains(controlPanel)) {
        document.body.removeChild(controlPanel);
        controlPanel = null;
      }

      if (pipTracker) {
        clearInterval(pipTracker);
        pipTracker = null;
      }
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

  // Formik state
  const usersValues = {
    invitees: [],
  };

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
    <div className="j_record" ref={recordingDivRef}>
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
                // style={{ width: '100%', marginBottom: '10px' }}
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
      {/* <div className="position-fixed top-0 end-0 p-3 ps-0 pb-0" style={{ zIndex: '1' }}>
                <div className="j_Invite text-white p-3">
                    <div className="d-flex align-items-center j_Box_margin">
                        <div className="j_join_user">
                            KP
                        </div>
                        <p className="p-0 m-0">Kiara Patel wants to join this meeting.</p>
                    </div>
                    <div className="mt-2">
                        <button className="btn j_deny_button me-2">Deny</button>
                        <button className="btn j_accept_button">Accept</button>
                    </div>
                </div>
            </div> */}
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

        {/* {isRecording && (
                    <div className="j_recording_indicator">
                        <span className="j_recording_dot"></span>
                        Recording: {formatRecordingTime(recordingTime)}
                    </div>
                )} */}
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
                    <div onClick={(e)=>{ 
                        dispatch(setShow(true));
                        dispatch(setIsChatOpen(true));
                        handleShow(e)}
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
        values={usersValues}
        // setFieldValue={setFieldValue}
        handleSubmit={() => {
          // Handle form submission if needed
          console.log("values", usersValues);
        }}
      />
    </div>
  );
}

export default Screen;
