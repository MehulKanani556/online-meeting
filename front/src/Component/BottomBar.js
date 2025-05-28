import React from "react";
import onmicrophone from "../Image/d_onmicrophone.svg";
import offmicrophone from "../Image/d_offmicrophone.svg";
import oncamera from "../Image/d_oncamera.svg";
import offcamera from "../Image/d_offcamera.svg";
import upload from "../Image/d_upload.svg";
import recording from "../Image/d_target.svg";
import smile from "../Image/d_smile.svg";
import podcast from "../Image/d_podcast.svg";
import hand from "../Image/d_hand.svg";
import bar from "../Image/d_bar.svg";
import { useDispatch, useSelector } from "react-redux";
import { setIsChatOpen, setIsHandRaised, setMainSectionMargin, setPipWindow, setShow, setShowEmojis } from "../Redux/Slice/meeting.slice";
import { enqueueSnackbar } from 'notistack';

const BottomBar = React.memo(
  ({
    toggleAudio,
    isMuted,
    isVideoOff,
    toggleVideo,
    toggleScreenShare,
    toggleRecording,
    isRecording,
    endMeeting,
    toggleViewMoreDropdown,
    showViewMoreDropdown,
    handleEmojiClick,
    unreadMessages,
    PictureInPicture,
    socket,
    roomId,
    participants,
    openWindow
    // pipWindow,
    // setPipWindow
  }) => {
    const dispatch = useDispatch();
    const { isHandRaised, show, isChatOpen, showEmojis, pipWindow } = useSelector((state) => state.meeting);

    const userId = sessionStorage.getItem("userId");

    const screenShare = participants?.find(participant => participant?.userId === userId)?.screenShare;
    const userisHost = participants?.find(participant => participant?.userId === userId)?.isHost;

    const handleShowee = (e) => {
      dispatch(setShow(true));
      dispatch(setIsChatOpen(true));
      dispatch(setMainSectionMargin(0));
    };

    const toggleHandRaise = () => {
      dispatch(setIsHandRaised({ socket, roomId }));
    };
    return (
      <div className="d-flex justify-content-sm-between justify-content-center align-items-center" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        {/* 1st div */}
        <div className="d-none d-sm-block">
          <div className="d-flex align-items-center d_resposive" style={{ display: "flex", alignItems: "center", }}>
            <div
              className="d_box me-sm-3 mb-2 mb-sm-0"
              style={{ cursor: "pointer" }}
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
          </div>
        </div>

        {/* New Div */}
        <div className="d-flex align-items-center" style={{ display: "flex", alignItems: "center", }}>
          <div className="d-none d-sm-block">
            <div className="d-flex d_resposive" style={{ display: "flex", alignItems: "center", }}>
              <div
                className="d_box me-sm-3 mb-2 mb-sm-0"
                style={{ cursor: "pointer", opacity: screenShare ? 1 : userisHost ? 1 : 0.5 }}
                onClick={() => {
                  if (screenShare) {
                    toggleScreenShare();
                  } else {
                    if (userisHost) {
                      toggleScreenShare();
                    } else {
                      enqueueSnackbar('Screen share is not allowed', {
                        variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                          vertical: 'top', // Position at the top
                          horizontal: 'right', // Position on the right
                        }
                      });
                      return;
                    }
                  }
                }}
              >
                <img src={upload} alt="screen share" />
              </div>

              {/* {!pipWindow && */}
              <div
                className="d_box me-sm-3"
                onClick={toggleRecording}
                style={{
                  cursor: "pointer",
                  backgroundColor: isRecording ? "#E12B2D" : "transparent",
                  transition: "background-color 0.3s",
                }}
              >
                <img src={recording} alt="recording" />
                {isRecording && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{
                      padding: "3px",
                      width: "12px",
                      height: "12px",
                      border: "2px solid #12161C",
                      background: "#E12B2D",
                      animation: "pulse 1.5s infinite",
                    }}
                  ></span>
                )}
              </div>
              {/* } */}
            </div>
          </div>
          <div
            className="d_box1 me-sm-3 mx-3 mx-sm-0 d_red"
            style={{ cursor: "pointer" }}
            onClick={endMeeting}
          >
            <p className="mb-0">End Meeting</p>
          </div>
          <div className="position-relative">
            {/* {!pipWindow && */}
            <div
              className="d-block d-sm-none d_box1 me-sm-3 mx-3 mx-sm-0"
              style={{ cursor: "pointer" }}
              onClick={toggleViewMoreDropdown}
            >
              <p className="mb-0">View More</p>
            </div>
            {/* } */}
            {showViewMoreDropdown && window.innerWidth <= 425 && (
              <div
                className="d_dropdown position-absolute bottom-100 start-50 translate-middle-x mb-2 rounded shadow-lg p-2"
                style={{ minWidth: "200px", zIndex: 1000 }}
              >
                <div
                  className="d-flex align-items-center p-2"
                  onClick={toggleAudio}
                  style={{ display: "flex", alignItems: "center", }}
                >
                  <img
                    src={isMuted ? offmicrophone : onmicrophone}
                    className="me-2"
                    alt="Microphone"
                  />
                  <span>Microphone</span>
                </div>
                <div
                  className="d-flex align-items-center p-2"
                  onClick={toggleVideo}
                  style={{ display: "flex", alignItems: "center", }}
                >
                  <img
                    src={isVideoOff ? offcamera : oncamera}
                    className="me-2"
                    alt="Camera"
                  />
                  <span>Camera</span>
                </div>
                <div
                  className="d-flex align-items-center p-2"
                  onClick={toggleScreenShare}
                  style={{ display: "flex", alignItems: "center", }}
                >
                  <img src={upload} alt="Share Screen" className="me-2" />
                  <span>Share Screen</span>
                </div>
                <div
                  className="d-flex align-items-center p-2"
                  onClick={toggleRecording}
                  style={{ display: "flex", alignItems: "center", }}
                >
                  <img src={recording} alt="recording" className="me-2" />
                  <span>Record</span>
                </div>
                <div
                  className="d-flex align-items-center p-2 position-relative"
                  onClick={() => dispatch(setShowEmojis(!showEmojis))}
                  style={{ display: "flex", alignItems: "center", }}
                >
                  <img src={smile} alt="Emoji" className="me-2" />
                  <span>Reactions</span>
                  {showEmojis && (
                    <div className="emoji-container j_mobile_containet_emoji">
                      {[
                        '👍',
                        '👎',
                        '👏',
                        '🎉',
                        '❤️',
                        '😊',
                        '😂',
                        '😉',
                        '😮',
                        '😢',
                        '😃',
                        '🙌',
                        '✋',
                        '🔥',
                        '💥',
                        '💯',
                        '⭐',
                        '✨',
                        '▶️'
                      ].map((emoji, index) => (
                        <span
                          key={index}
                          style={{
                            cursor: "pointer",
                            fontSize: "24px",
                            margin: "5px",
                            color: "white",
                          }}
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className="d-flex align-items-center p-2"
                  onClick={PictureInPicture}
                  style={{ display: "flex", alignItems: "center", }}
                >
                  <img
                    src={podcast}
                    alt="Picture in Picture"
                    className="me-2"
                  />
                  <span>Picture in Picture</span>
                </div>
                <div
                  className="d-flex align-items-center p-2"
                  onClick={toggleHandRaise}
                  style={{
                    backgroundColor: isHandRaised ? "#202F41" : "transparent",
                    transition: "background-color 0.3s",
                    display: "flex", alignItems: "center",
                  }}
                >
                  <img src={hand} alt="Raise Hand" className="me-2" />
                  <span>Raise Hand</span>
                </div>
                <div
                  className="d-flex align-items-center p-2"
                  onClick={(e) => handleShowee(e)}
                  style={{ display: "flex", alignItems: "center", }}
                >
                  <img src={bar} alt="Bar" className="me-2" />
                  <span>Chat</span>
                  {/* {unreadMessages > 0 && (
                    <span
                      className="ms-2 badge rounded-pill"
                      style={{
                        padding: "5px",
                        width: "25px",
                        height: "25px",
                        fontSize: "14px",
                        background: "rgb(225, 43, 45)",
                      }}
                    >
                      {unreadMessages}
                    </span>
                  )} */}
                </div>
              </div>
            )}

          </div>
          <div className="d-none d-sm-block">
            <div className="d-flex d_resposive" style={{ display: "flex", alignItems: "center", }}>
              <div
                className="d_box me-sm-3 mb-2 mb-sm-0 position-relative"
                onClick={() => dispatch(setShowEmojis(!showEmojis))}
                style={{
                  cursor: "pointer",
                  backgroundColor: showEmojis ? "#202F41" : "transparent",
                  transition: "background-color 0.3s",
                }}
              >
                <img src={smile} alt="Emoji" />
                {showEmojis && (
                  <div
                    className="emoji-container"
                    style={{
                      position: "absolute",
                      width: "250px",
                      bottom: "45px",
                      backgroundColor: "#12161C",
                      border: "1px solid #202f41",
                      padding: "10px",
                      borderRadius: "5px",
                      zIndex: 1000,
                      textAlign: 'center'
                    }}
                  >
                    {[
                      '👍',
                      '👎',
                      '👏',
                      '🎉',
                      '❤️',
                      '😊',
                      '😂',
                      '😉',
                      '😮',
                      '😢',
                      '😃',
                      '🙌',
                      '✋',
                      '🔥',
                      '💥',
                      '💯',
                      '⭐',
                      '✨',
                      '▶️'
                    ].map((emoji, index) => (
                      <span
                        key={index}
                        style={{
                          cursor: "pointer",
                          fontSize: "24px",
                          margin: "5px",
                          color: "white",
                        }}
                        onClick={() => handleEmojiClick(emoji)}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div
                className="d_box me-sm-3"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(setPipWindow(true));
                  PictureInPicture();
                }}
              >
                <img src={podcast} alt="Picture In Picture" />
              </div>
            </div>
          </div>
        </div>
        {/* 3rd div */}
        <div className="d-none d-sm-block">
          <div className="d-flex align-items-center d_resposive" style={{ display: "flex", alignItems: "center", }}>
            <div
              className="d_box me-sm-3 mb-2 mb-sm-0"
              onClick={toggleHandRaise}
              style={{
                cursor: "pointer",
                backgroundColor: isHandRaised ? "#202F41" : "transparent",
                transition: "background-color 0.3s",
              }}
            >
              <img src={hand} alt="Raise hand" />
            </div>
            {/* {!pipWindow && */}
            <div
              className="d_box position-relative"
              onClick={(e) => handleShowee(e)}
              style={{
                cursor: "pointer",
                backgroundColor: show ? "#202F41" : "transparent",
                transition: "background-color 0.3s",
              }}
            >
              <img src={bar} alt="Bar" />
              {/* {unreadMessages > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{
                    padding: "3px",
                    width: "25px",
                    height: "25px",
                    border: "2px solid #12161C",
                    background: "#E12B2D",
                  }}
                >
                  {unreadMessages}
                </span>
              )} */}
            </div>
            {/* } */}
          </div>
        </div>
      </div>
    );
  }
);

// Add display name for debugging
BottomBar.displayName = "BottomBar";

export default BottomBar;
