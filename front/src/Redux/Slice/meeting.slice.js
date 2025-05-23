import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isScreenSharing: false,
  newMessage: "",
  showViewMoreDropdown: false,
  show: false,
  isChatOpen: false,
  isHandRaised: false,
  showEmojis: false,
  activeEmojis: [],
  localStream: null,
  remoteStreams: {},
  maxVisibleParticipants: 9,
  messageUser: "Messages",
  activeDropdown: null,
  mainSectionMargin: 0,
  windowWidth: window.innerWidth,
  newName: "",
  showRenameModal: false,
  searchTerm: "",
  selectedParticipant: null,
  lastUnreadIndex: -1,
  pendingJoinRequests: [],
  isRecording: false,
  isHost: false,
  InvitePeople: false,
  showDropdown: false,
  linkCopied: false,
  selectedUsers: [],
  filteredUsers: [],
  pipWindow: false,
};

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    setIsHandRaised: (state, action) => {
      state.isHandRaised = !state.isHandRaised;
      const { socket, roomId } = action.payload || {};

      // Emit socket event if socket and roomId are provided
      if (socket && roomId) {
        socket.emit("hand-status-change", {
          roomId,
          hasRaisedHand: state.isHandRaised,
        });
      }
    },
    setIsScreenSharing: (state, action) => {
      state.isScreenSharing = action.payload;
    },
    setNewMessage: (state, action) => {
      state.newMessage = action.payload;
    },
    setShowViewMoreDropdown: (state, action) => {
      state.showViewMoreDropdown = action.payload;
    },
    setShow: (state, action) => {
      state.show = !state.show;
    },
    setIsChatOpen: (state, action) => {
      state.isChatOpen = !state.isChatOpen;
    },
    // setIsHandRaised: (state, action) => {
    //   state.isHandRaised = !state.isHandRaised;
    // },
    setShowEmojis: (state, action) => {
      state.showEmojis = !state.showEmojis;
    },
    setActiveEmojis: (state, action) => {
      state.activeEmojis = action.payload;
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setRemoteStreams: (state, action) => {
      state.remoteStreams = action.payload;
    },
    setMaxVisibleParticipants: (state, action) => {
      state.maxVisibleParticipants = action.payload;
    },
    setMessageUser: (state, action) => {
      state.messageUser = action.payload;
    },
    setActiveDropdown: (state, action) => {
      state.activeDropdown = action.payload;
    },
    setMainSectionMargin: (state, action) => {
      state.mainSectionMargin = action.payload;
    },
    setWindowWidth: (state, action) => {
      state.windowWidth = action.payload;
    },
    setNewName: (state, action) => {
      state.newName = action.payload;
    },
    setShowRenameModal: (state, action) => {
      state.showRenameModal = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedParticipant: (state, action) => {
      state.selectedParticipant = action.payload;
    },
    setLastUnreadIndex: (state, action) => {
      state.lastUnreadIndex = action.payload;
    },
    setPendingJoinRequests: (state, action) => {
      state.pendingJoinRequests = action.payload;
    },
    setIsRecording: (state, action) => {
      state.isRecording = action.payload;
    },
    setIsHost: (state, action) => {
      state.isHost = action.payload;
    },
    setInvitePeople: (state, action) => {
      state.InvitePeople = action.payload;
    },
    setShowDropdown: (state, action) => {
      state.showDropdown = action.payload;
    },
    setLinkCopied: (state, action) => {
      state.linkCopied = action.payload;
    },
    setSelectedUsers: (state, action) => {
      state.selectedUsers = action.payload;
    },
    setFilteredUsers: (state, action) => {
      state.filteredUsers = action.payload;
    },
    setPipWindow: (state, action) => {
      state.pipWindow = action.payload;
    },
    // Add a reset action to clear all state
    resetMeetingState: (state) => {
      return initialState;
    },
  },
});

export const {
  setIsScreenSharing,
  setNewMessage,
  setShowViewMoreDropdown,
  setShow,
  setIsHandRaised,
  setShowEmojis,
  setActiveEmojis,
  setLocalStream,
  setRemoteStreams,
  setMaxVisibleParticipants,
  setMessageUser,
  setActiveDropdown,
  setMainSectionMargin,
  setWindowWidth,
  setNewName,
  setShowRenameModal,
  setSearchTerm,
  setSelectedParticipant,
  setLastUnreadIndex,
  setPendingJoinRequests,
  setIsRecording,
  setIsHost,
  setInvitePeople,
  setShowDropdown,
  setLinkCopied,
  setSelectedUsers,
  setFilteredUsers,
  resetMeetingState,
  setIsChatOpen,
  setPipWindow
} = meetingSlice.actions;

export default meetingSlice.reducer;
