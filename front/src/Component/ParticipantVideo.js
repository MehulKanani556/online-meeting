import React from "react";
import { useSelector } from "react-redux";

const ParticipantVideo = React.memo(
  ({
    participant,
    isLocal,
    localVideoRef,
    setVideoRef,
    isVideoOff,
    remoteStreams,
    hand,
    oncamera,
    offcamera,
    onmicrophone,
    offmicrophone,
    imgpath,
  }) => {
    const allUser = useSelector((state) => state.user.allusers);
    const currUser = useSelector((state) => state.user.currUser);

    const singleuser = allUser.find((u) => u._id == participant.userId);

    return (
      <div className="d_avatar-container">
        {isLocal ? (
          // Local user video
          <>
            <video
              ref={localVideoRef}
              className="d_video-element"
              autoPlay
              muted
              playsInline
              style={{ display: isVideoOff  ? "none" : "block" }}
            />
            <div
              className="d_avatar-circle"
              style={{
                display: isVideoOff ? "flex" : "none",
                textTransform: "uppercase",
                backgroundColor: `hsl(${
                  participant.id.charCodeAt(0) * 60
                }, 70%, 45%)`,
              }}
            >
              {singleuser?.photo && currUser?.videomuted ? (
                <img
                  src={`${imgpath}${singleuser?.photo}`}
                  alt="userphoto"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                `${participant.initials}`
              )}
            </div>
          </>
        ) : (
          // Remote participant video
          <>
            <video
              ref={setVideoRef(participant.id)}
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
                backgroundColor: `hsl(${
                  participant.id.charCodeAt(0) * 60
                }, 70%, 45%)`,
              }}
            >
              {singleuser?.photo ? (
                <img
                  src={`${imgpath}${singleuser?.photo}`}
                  alt="userphoto"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                `${participant.initials}`
              )}
            </div>
          </>
        )}

        <div className="d_controls-top">
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
        </div>

        <div className="d_controls-bottom">
          <span className="d_participant-name">
          {currUser?.participantsNameandVideo ? participant?.name : ""}
            {participant.isHost ? " (Host)" : ""}
          </span>
          <div className="d_mic-status">
            <img
              src={participant.hasAudio ? onmicrophone : offmicrophone}
              className="d_control-icon"
              alt={participant.hasAudio ? "Microphone on" : "Microphone off"}
            />
          </div>
        </div>
      </div>
    );
  }
);

// Add display name for debugging
ParticipantVideo.displayName = "ParticipantVideo";

export default ParticipantVideo;
