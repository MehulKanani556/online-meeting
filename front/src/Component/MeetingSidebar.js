import React from "react";
import { Offcanvas, Button } from "react-bootstrap";
// import { IoClose, IoSearch, IoMdSend } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Formik } from "formik";
import search from "../Image/Search.png";
import left from "../Image/left.svg";
import inviteuser from "../Image/inviteuser.svg";
import copytext from "../Image/copytext.svg";
import hand from "../Image/d_hand.svg";
import onmicrophone from "../Image/d_onmicrophone.svg";
import offmicrophone from "../Image/d_offmicrophone.svg";
import { IoClose, IoSearch } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { setIsChatOpen, setMainSectionMargin, setShow } from "../Redux/Slice/meeting.slice";
import { useDispatch } from "react-redux";

const MeetingSidebar = ({
  show,
  windowWidth,
  InvitePeople,
  setInvitePeople,
  messageUser,
  setmessageUser,
  messages,
  participants,
  searchTerm,
  setSearchTerm,
  filteredParticipants,
  isHost,
  activeDropdown,
  setActiveDropdown,
  makeHost,
  makeCohost,
  openRenameModal,
  toggleAudio,
  removeParticipant,
  showRenameModal,
  setShowRenameModal,
  newName,
  setNewName,
  saveNewName,
  searchInputRef,
  dropdownRef,
  showDropdown,
  setShowDropdown,
  filteredUsers,
  setFilteredUsers,
  selectedUsers,
  setSelectedUsers,
  allusers,
  userId,
  IMG_URL,
  linkCopied,
  setLinkCopied,
  messageContainerRef,
  lastUnreadIndex,
  userName,
  handleSendMessage,
  newMessage,
  handleMessageInput,
  handleTextareaResize,
  renderTypingIndicator,
}) => {
  const usersValues = {
    invitees: [],
  };
  const dispatch = useDispatch();
  return (
    <Offcanvas
      show={show}
      className="B_screen_offcanvas"
      placement="end"
      onHide={() => {
        dispatch(setShow(false));
        dispatch(setIsChatOpen(false));
        dispatch(setMainSectionMargin(0));
      }}
      backdrop={windowWidth <= 768}
      style={{
        width: windowWidth <= 768 ? "400px" : "400px",
        zIndex: windowWidth <= 768 ? 1050 : 1030,
      }}
    >
      <Formik
        initialValues={usersValues}
        onSubmit={(values) => {
          console.log("values", values);
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => (
          <>
            {InvitePeople ? (
              <form onSubmit={handleSubmit}>
                <div
                  className="j_invite_people_Div w-100 h-100 position-relative"
                  style={{
                    boxShadow: "inset 0 0 5px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center p-4">
                    <div className="d-flex gap-2 align-items-center">
                      <img
                        src={left}
                        alt="Left"
                        onClick={() => setInvitePeople(false)}
                        className="btn j_invite_Btn p-0"
                      />
                      <h2 className="j_invite_people mb-0">Invite people</h2>
                    </div>
                  </div>
                  <div className="B_search-container px-4 mb-3">
                    <div className="position-relative">
                      <IoSearch
                        className=" position-absolute"
                        style={{
                          top: "50%",
                          transform: "translateY(-50%)",
                          left: "15px",
                          fontSize: "20px",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      />
                      <input
                        type="search"
                        className="form-control text-white j_search_Input ps-5"
                        placeholder="Search email or name"
                        ref={searchInputRef}
                        onChange={(e) => {
                          const searchusers = e.target.value.toLowerCase();
                          const filtered = allusers.filter(
                            (user) =>
                              user.email.toLowerCase().includes(searchusers) ||
                              user.name.toLowerCase().includes(searchusers)
                          );
                          setFilteredUsers(filtered);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        style={{
                          padding: "12px",
                          borderRadius: "5px",
                          border: "none",
                          backgroundColor: "#202F41",
                        }}
                      />
                    </div>
                    <p className="text-white my-2 fw-semibold">
                      Search results
                    </p>

                    {showDropdown && (
                      <div
                        ref={dropdownRef}
                        className="position-absolute mt-1 B_suggestion"
                        style={{
                          backgroundColor: "#202F41",
                          borderRadius: "5px",
                          width: "88%",
                          zIndex: 1000,
                          maxHeight: "275px",
                          overflowY: "auto",
                        }}
                      >
                        {filteredUsers.length > 0 ? (
                          filteredUsers
                            .filter((user) => user._id !== userId)
                            .map((user) => {
                              const isSelected = selectedUsers.some(
                                (selected) => selected._id === user._id
                              );
                              return (
                                <div
                                  key={user._id}
                                  className={`d-flex align-items-center p-2 cursor-pointer ${
                                    isSelected && "j_invite_selected"
                                  }`}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedUsers(
                                        selectedUsers.filter(
                                          (selected) =>
                                            selected._id !== user._id
                                        )
                                      );
                                    } else {
                                      setSelectedUsers([
                                        ...selectedUsers,
                                        user,
                                      ]);
                                    }
                                  }}
                                >
                                  <div className="me-2">
                                    {user.photo ? (
                                      <img
                                        src={`${IMG_URL}${user.photo}`}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    ) : (
                                      <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                          fontSize: "12px",
                                          width: "30px",
                                          height: "30px",
                                          backgroundColor: `hsl(${
                                            Array.from(
                                              user._id ||
                                                user.email ||
                                                user.name ||
                                                ""
                                            ).reduce(
                                              (acc, char) =>
                                                acc + char.charCodeAt(0),
                                              0
                                            ) % 360
                                          }, 70%, 45%)`,
                                          color: "white",
                                        }}
                                      >
                                        {user.name?.charAt(0).toUpperCase()}
                                        {user.name?.split(" ")[1]
                                          ? user.name
                                              ?.split(" ")[1]
                                              ?.charAt(0)
                                              .toUpperCase()
                                          : ""}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-white">
                                    <div style={{ fontSize: "14px" }}>
                                      {user.name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        color: "#8B9CAF",
                                      }}
                                    >
                                      {user.email}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        ) : (
                          <div
                            className="p-3 text-center text-white"
                            style={{ fontSize: "14px" }}
                          >
                            No users found
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className="invitees-list"
                      style={{ height: "calc(100vh - 300px)" }}
                    >
                      {values.invitees.length > 0 ? (
                        values.invitees.map((invitee) => (
                          <div
                            key={invitee._id}
                            className="invitee-item d-flex align-items-center mb-2"
                          >
                            {invitee.photo ? (
                              <img
                                src={`${IMG_URL}${invitee.photo}`}
                                alt="Profile"
                                className="rounded-circle"
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  objectFit: "cover",
                                  marginRight: "10px",
                                }}
                              />
                            ) : (
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                  fontSize: "12px",
                                  width: "30px",
                                  height: "30px",
                                  backgroundColor: `hsl(${
                                    Array.from(
                                      invitee._id ||
                                        invitee.email ||
                                        invitee.name ||
                                        ""
                                    ).reduce(
                                      (acc, char) => acc + char.charCodeAt(0),
                                      0
                                    ) % 360
                                  }, 70%, 45%)`,
                                  color: "white",
                                  marginRight: "10px",
                                }}
                              >
                                {invitee.name?.charAt(0).toUpperCase()}
                                {invitee.name?.split(" ")[1]
                                  ? invitee.name
                                      ?.split(" ")[1]
                                      ?.charAt(0)
                                      .toUpperCase()
                                  : ""}
                              </div>
                            )}
                            <div>
                              <div style={{ fontSize: "14px" }}>
                                {invitee.name}
                              </div>
                              <div
                                style={{ fontSize: "12px", color: "#8B9CAF" }}
                              >
                                {invitee.email}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 d-flex justify-content-center align-items-center flex-column h-100">
                          <img
                            src={search}
                            alt="Search"
                            className="j_no_users"
                          />
                          <p className="text-white mb-0">No result found</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center mb-3">
                    <button
                      type="submit"
                      className="btn j_button_invite"
                      onClick={() => {
                        if (selectedUsers.length > 0) {
                          setFieldValue("invitees", [
                            ...values.invitees,
                            ...selectedUsers.map((user) => ({
                              _id: user._id,
                              name: user.name,
                              email: user.email,
                              photo: user.photo,
                            })),
                          ]);
                          setSelectedUsers([]);
                        }
                      }}
                    >
                      Invite
                    </button>
                  </div>
                  <div className="position-relative px-4">
                    <input
                      readOnly
                      type="text"
                      value={`${window.location.host}${window.location.pathname}`}
                      className="form-control text-white j_search_Input"
                      placeholder="Search email or name"
                      style={{
                        padding: "12px",
                        borderRadius: "5px",
                        border: "none",
                        fontSize: "13px",
                        backgroundColor: "#080E14",
                      }}
                    />
                    <div
                      className="position-absolute"
                      style={{ top: "22%", right: "8%", cursor: "pointer" }}
                    >
                      <img
                        src={copytext}
                        alt=""
                        style={{ height: "15px", width: "15px" }}
                        onClick={() => {
                          navigator.clipboard
                            .writeText(window.location.href)
                            .then(() => {
                              setLinkCopied(true);
                              setTimeout(() => setLinkCopied(false), 2000);
                            })
                            .catch((err) => {
                              console.error("Failed to copy: ", err);
                            });
                        }}
                      />
                    </div>
                  </div>
                  {linkCopied && (
                    <div className="text-success text-end mb-1 px-4">
                      Link is copied!
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <>
                <Offcanvas.Header className="d-flex justify-content-between align-items-center">
                  <div className="d-flex justify-content-center ms-3 py-2">
                    <div
                      className="d-flex"
                      style={{
                        backgroundColor: "#101924",
                        padding: "6px",
                        borderRadius: "8px",
                      }}
                    >
                      <button
                        type="button"
                        className=" B_screen_button border-0 rounded"
                        style={{
                          minWidth: "100px",
                          backgroundColor:
                            messageUser === "Messages"
                              ? "#2A323B"
                              : "transparent",
                          color:
                            messageUser === "Messages" ? "#ffffff" : "#87898B",
                        }}
                        onClick={() => setmessageUser("Messages")}
                      >
                        Messages ({messages.length})
                      </button>
                      <button
                        type="button"
                        className=" B_screen_button border-0 rounded"
                        style={{
                          minWidth: "100px",
                          backgroundColor:
                            messageUser === "Participants"
                              ? "#2A323B"
                              : "transparent",
                          color:
                            messageUser === "Participants"
                              ? "#ffffff"
                              : "#87898B",
                        }}
                        onClick={() => setmessageUser("Participants")}
                      >
                        Participants ({participants.length})
                      </button>
                    </div>
                  </div>

                  <IoClose
                    style={{
                      color: "#fff",
                      fontSize: "20px",
                      marginBottom: "20px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      dispatch(setShow(false));
                      dispatch(setIsChatOpen(false));
                      dispatch(setMainSectionMargin(0));
                    }}
                  />
                </Offcanvas.Header>
                <div
                  className="mx-2 mb-4"
                  style={{ borderBottom: "1px solid #3f464e" }}
                ></div>

                {messageUser === "Participants" ? (
                  <Offcanvas.Body className="B_Ofcanvasbody">
                    <>
                      <div className="d-flex flex-column h-100 ">
                        <div className="B_search-container  mb-3">
                          <div className="position-relative">
                            <IoSearch
                              className=" position-absolute"
                              style={{
                                top: "50%",
                                transform: "translateY(-50%)",
                                left: "15px",
                                fontSize: "20px",
                                color: "rgba(255, 255, 255, 0.7)",
                              }}
                            />
                            <input
                              type="text"
                              className="form-control text-white j_search_Input ps-5"
                              placeholder="Search people.."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              style={{
                                padding: "12px",
                                borderRadius: "5px",
                                border: "none",
                                backgroundColor: "#202F41",
                              }}
                            />
                          </div>
                        </div>
                        <div
                          className="list-group B_screen_offcanvas "
                          style={{ height: "82%", overflowY: "auto" }}
                        >
                          {filteredParticipants.length > 0 ? (
                            filteredParticipants.map((participant, index) => (
                              <div
                                key={participant.id}
                                className="list-group-item d-flex align-items-center"
                              >
                                <div
                                  className="rounded-circle B_circle d-flex justify-content-center align-items-center me-3"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: `hsl(${
                                      participant.id.charCodeAt(0) * 60
                                    }, 70%, 45%)`,
                                    color: "white",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {participant.initials}
                                </div>
                                <div className="flex-grow-1 B_participateName">
                                  <div>{participant.name}</div>
                                </div>

                                {(participant.isHost ||
                                  participant.isCohost) && (
                                  <div className="me-3">
                                    <span
                                      className="px-3 py-1 rounded-pill text-white"
                                      style={{
                                        backgroundColor:
                                          "rgba(255, 255, 255, 0.2)",
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      {participant.isHost ? "Host" : "Cohost"}
                                    </span>
                                  </div>
                                )}

                                <div className="d-flex align-items-center">
                                  {participant.hasRaisedHand && (
                                    <img
                                      src={hand}
                                      className="d_control-icon me-1 mt-1"
                                      alt="Hand raised"
                                      style={{
                                        animation: "d_handWave 1s infinite",
                                        transform: "translateY(-2px)",
                                      }}
                                    />
                                  )}
                                  <div
                                    className="d_box me-sm-3 mb-2 mb-sm-0"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <img
                                      src={
                                        participant.hasAudio
                                          ? onmicrophone
                                          : offmicrophone
                                      }
                                      alt="MicroPhone"
                                    />
                                  </div>

                                  <div className="position-relative">
                                    <HiOutlineDotsVertical
                                      className="mt-1 cursor-pointer B_vertical"
                                      style={{ cursor: "pointer" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdown(
                                          activeDropdown === participant.id
                                            ? null
                                            : participant.id
                                        );
                                      }}
                                    />

                                    {activeDropdown === participant.id && (
                                      <div
                                        className="position-absolute end-0 bg-dark text-white rounded shadow py-2"
                                        style={{
                                          zIndex: 1000,
                                          width: "150px",
                                          top: "100%",
                                          right: 0,
                                          cursor: "pointer ",
                                        }}
                                      >
                                        {isHost ? (
                                          <>
                                            {!participant.isHost && (
                                              <div
                                                className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                                onClick={() =>
                                                  makeHost(participant.id)
                                                }
                                              >
                                                Make host
                                              </div>
                                            )}
                                            {!participant.isCohost &&
                                              !participant.isHost && (
                                                <div
                                                  className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                                  onClick={() =>
                                                    makeCohost(participant.id)
                                                  }
                                                >
                                                  Make cohost
                                                </div>
                                              )}
                                            <div
                                              className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                              onClick={() =>
                                                openRenameModal(participant)
                                              }
                                            >
                                              Rename
                                            </div>
                                            <div
                                              className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                              onClick={toggleAudio}
                                            >
                                              {participant.hasAudio
                                                ? "Mute"
                                                : "Unmute"}
                                            </div>
                                            <div
                                              className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                              onClick={() =>
                                                removeParticipant(
                                                  participant.id
                                                )
                                              }
                                            >
                                              Remove
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div
                                              className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                              onClick={() =>
                                                openRenameModal(participant)
                                              }
                                            >
                                              Rename
                                            </div>
                                            <div
                                              className="px-3 py-2 hover-bg-secondary cursor-pointer"
                                              onClick={toggleAudio}
                                            >
                                              {participant.hasAudio
                                                ? "Mute"
                                                : "Unmute"}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="text-center py-4 h-100 d-flex align-items-center justify-content-center flex-column">
                                <img
                                  src={search}
                                  alt="Search"
                                  className="j_no_users"
                                />
                                <p className="text-white mb-0">
                                  {searchTerm
                                    ? "No result found"
                                    : "No participants in the meeting"}
                                </p>
                              </div>
                            </>
                          )}

                          {showRenameModal && (
                            <div
                              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                zIndex: 1050,
                              }}
                            >
                              <div
                                className=" text-white rounded"
                                style={{
                                  width: "430px",
                                  maxWidth: "90%",
                                  backgroundColor: "#12161C",
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
                                  <h6 className="m-0 B_EditName">
                                    Edit display name
                                  </h6>
                                  <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowRenameModal(false)}
                                    aria-label="Close"
                                  ></button>
                                </div>

                                <div className="p-4 B_screen_Pad">
                                  <div className="mb-3">
                                    <label className="form-label small mb-2 text-white-50 mb-2  ">
                                      Name
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control j_search_Input text-white border-0"
                                      value={newName}
                                      onChange={(e) =>
                                        setNewName(e.target.value)
                                      }
                                      style={{
                                        padding: "10px",
                                        backgroundColor: "#202F41",
                                      }}
                                    />
                                  </div>

                                  <div className="d-flex justify-content-between gap-3 mt-5 B_screen_Margin">
                                    <button
                                      className="btn flex-grow-1 py-2"
                                      onClick={() => setShowRenameModal(false)}
                                      style={{
                                        border:
                                          "1px solid rgba(255, 255, 255, 0.2)",
                                        borderRadius: "4px",
                                        fontWeight: 600,
                                        backgroundColor: "transparent",
                                        color: "white",
                                      }}
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="btn btn-light flex-grow-1 py-2"
                                      onClick={saveNewName}
                                      style={{
                                        fontWeight: 600,
                                        borderRadius: "4px",
                                        backgroundColor: "white",
                                        color: "black",
                                      }}
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="d-flex justify-content-center mb-3 mt-auto">
                          <Button
                            className="B_screen_btn fw-semibold p-2"
                            onClick={() => setInvitePeople(true)}
                          >
                            <img
                              src={inviteuser}
                              alt=""
                              className="j_invite_user_icon"
                            />
                            Invite people
                          </Button>
                          <Button className="B_screen_btn fw-semibold p-2">
                            {" "}
                            Mute all{" "}
                          </Button>
                        </div>
                      </div>
                    </>
                  </Offcanvas.Body>
                ) : (
                  <Offcanvas.Body>
                    <>
                      <div className="chat-container h-100 d-flex flex-column">
                        <div
                          className="chat-messages flex-grow-1"
                          ref={messageContainerRef}
                          style={{ overflowY: "auto" }}
                        >
                          {messages.map((msg, index) => (
                            <div
                              key={index}
                              className={`d-flex align-items-start me-2 mb-3 ${
                                index === lastUnreadIndex ? "first-unread" : ""
                              }`}
                            >
                              {msg.sender !== userName && (
                                <div
                                  className="chat-avatar me-2"
                                  style={{
                                    backgroundColor:
                                      msg.sender === userName
                                        ? "#2B7982"
                                        : "#4A90E2",
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  <span style={{ color: "#fff" }}>
                                    {msg.sender.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div
                                className="chat-message"
                                style={{
                                  marginLeft:
                                    msg.sender === userName ? "auto" : "0",
                                }}
                              >
                                <div
                                  className="small"
                                  style={{
                                    color:
                                      msg.sender === userName
                                        ? "white"
                                        : "#b3aeae",
                                    textAlign:
                                      msg.sender === userName ? "end" : "start",
                                  }}
                                >
                                  {msg.sender === userName ? "You" : msg.sender}
                                </div>
                                <div
                                  style={{
                                    backgroundColor:
                                      msg.sender === userName
                                        ? "#2A323B"
                                        : "#1E242B",
                                    color:
                                      msg.sender === userName
                                        ? "white"
                                        : "#b3aeae",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    maxWidth: "250px",
                                    wordBreak: "break-word",
                                    whiteSpace: "pre-wrap",
                                  }}
                                >
                                  {msg.message}
                                </div>
                              </div>
                            </div>
                          ))}
                          {lastUnreadIndex >= 0 && (
                            <div className="unread-messages-divider">
                              <span>Unread Messages</span>
                            </div>
                          )}
                        </div>

                        {renderTypingIndicator()}

                        <div className="B_search-container  mb-3">
                          <div className="position-relative B_input_search B_input_search22  mx-auto">
                            <form
                              onSubmit={handleSendMessage}
                              className="mt-3 d-flex"
                            >
                              <div className="B_send_msginput j_search_Input">
                                <textarea
                                  type="text"
                                  className="form-control text-white d_foucscolor B_send_msginput j_search_Input ps-3"
                                  value={newMessage}
                                  onChange={(e) => {
                                    handleMessageInput(e);
                                    handleTextareaResize(e);
                                  }}
                                  onInput={handleTextareaResize}
                                  onScroll={(e) => {
                                    e.target.style.paddingRight = "30px";
                                  }}
                                  style={{
                                    paddingRight: "50px",
                                  }}
                                  placeholder="Write a message..."
                                />
                                <button
                                  type="submit"
                                  className="position-absolute B_sendMsg"
                                >
                                  <IoMdSend />
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </>
                  </Offcanvas.Body>
                )}
              </>
            )}
          </>
        )}
      </Formik>
    </Offcanvas>
  );
};

export default MeetingSidebar;
