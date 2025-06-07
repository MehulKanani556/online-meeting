import React, { useEffect, useState, useRef } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { IoClose, IoSearch } from 'react-icons/io5'
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { Formik } from 'formik'
import HomeNavBar from '../Component/HomeNavBar'
import SideBar from '../Component/SideBar'
import Schedule from '../Image/j_Schedule.svg'
import meeting from '../Image/j_meeting.svg'
import bin from '../Image/j_bin.svg'
import * as Yup from 'yup';
import plus from '../Image/j_plus.svg'
import { createschedule, getAllschedule } from '../Redux/Slice/schedule.slice';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../Redux/Slice/user.slice';
import { IMAGE_URL } from '../Utils/baseUrl';
import { useSocket } from '../Hooks/useSocket';
import { Link, useNavigate } from 'react-router-dom';
import { createreview } from '../Redux/Slice/reviews.slice';
import { FaStar } from 'react-icons/fa6';
import MeetingAudio from '../Image/B_Audioo.svg'
import MeetingVideo from '../Image/B_Videoo.svg'
import MeetingConnection from '../Image/B_shearing.svg'
import { useSnackbar } from 'notistack';

function Home() {
  const dispatch = useDispatch()
  const [activeItem, setActiveItem] = useState('')
  const [ScheduleModal, setScheduleModal] = useState(false)
  const [customModal, setcustomModal] = useState(false)
  const [joinModal, setjoinModal] = useState(false)
  const [ReviewModel, setReviewModel] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [rating, setRating] = useState(0);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [meetingId, setMeetingId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const handleCloseReviewModel = () => setReviewModel(false);
  const handleShowReviewModel = () => setReviewModel(true);
  const handleScheduleclose = () => {
    setScheduleModal(false);
    setActiveItem(null)
    setCustomModalVisible(false)
  }
  const handleScheduleshow = () => setScheduleModal(true)
  const handlecustomclose = () => setcustomModal(false)
  const handlecustomshow = () => setcustomModal(true)
  const handlejoinclose = () => {
    setjoinModal(false);
    setActiveItem(null)
  }
  const handlejoinshow = () => setjoinModal(true)

  const IMG_URL = IMAGE_URL
  const userId = sessionStorage.getItem('userId')
  const gettoken = sessionStorage.getItem('token')
  const allusers = useSelector((state) => state.user.allusers);
  const allschedule = useSelector((state) => state.schedule.allschedule);

  const currentUser = allusers.find((id) => id._id === userId)
  const userName = currentUser?.name;


  const [requestSent, setRequestSent] = useState(false);
  const [joinRequestStatus, setJoinRequestStatus] = useState('');
  const [meetingToJoin, setMeetingToJoin] = useState(null);


  const [isCustomModalVisible, setCustomModalVisible] = useState(false);

  // Function to handle showing the custom modal
  const handleCustomModalShow = () => setCustomModalVisible(true);
  const handleCustomModalClose = () => setCustomModalVisible(false);

  const {
    socket,
    isConnected,
    sendJoinRequest,
    requestApprovalStatus
  } = useSocket(userId, meetingId, userName);

  useEffect(() => {
    if (requestApprovalStatus) {
      if (requestApprovalStatus === 'approved' && meetingToJoin) {
        // Close modal and navigate to meeting
        handlejoinclose();
        navigate(`/screen/${meetingToJoin}`);
      } else if (requestApprovalStatus === 'denied') {
        setJoinRequestStatus('Your request to join was denied by the host.');
        setTimeout(() => {
          setRequestSent(false);
          setJoinRequestStatus('');
        }, 3000);
      }
    }
  }, [requestApprovalStatus, meetingToJoin]);


  const handleJoinSubmit = (e) => {
    e.preventDefault();

    // Validation logic
    if (!meetingId || !meetingId.trim()) {
      setError('Please enter a meeting ID');
      return;
    }

    // Find meeting in allschedule that matches the entered ID
    const meeting = allschedule.find(schedule =>
      schedule.meetingLink.includes(meetingId.trim())
    );

    if (!meeting) {
      setError('Invalid meeting ID');
      return;
    }

    // Check if current time is within meeting time
    const meetingDate = new Date(meeting.date);
    const today = new Date();
    const startTime = meeting.startTime.split(':');
    const endTime = meeting.endTime.split(':');

    meetingDate.setHours(parseInt(startTime[0]), parseInt(startTime[1]));
    const meetingEndDate = new Date(meeting.date);
    meetingEndDate.setHours(parseInt(endTime[0]), parseInt(endTime[1]));

    // Check if meeting is in progress
    // if (today < meetingDate) {
    //   setError('This meeting has not started yet');
    //   return;
    // }

    // if (today > meetingEndDate) {
    //   setError('This meeting has already ended');
    //   return;
    // }

    // Check if user is connected
    if (!socket) {
      setError('Socket not connect.');
      return;
    }

    // Check if user is logged in
    if (!userName || !userId) {
      setError('Please log in to join the meeting');
      return;
    }

    // Check if meetingId is numeric and password is required
    const password = document?.getElementById('meetingPassword')?.value;
    if (/^\d+$/.test(meetingId) && meeting.password && !password) {
      setError('Please enter the password to join the meeting');
      return;
    }

    // Set the meeting to join for later navigation
    setMeetingToJoin(meetingId);

    // Send join request
    socket.emit('request-to-join', {
      roomId: meetingId,
      userId: userId,
      userName: userName,
      password: password
    });

    setRequestSent(true);
    setJoinRequestStatus('Waiting for Host Approval...');

    // Listen for the response from the server
    socket.on('join-request-status', (response) => {
      if (response.status === 'error') {
        setError(response.message); // Show error message if password is incorrect
        setRequestSent(false);
      } else if (response.status === 'approved') {
        handlejoinclose();
        navigate(`/screen/${meetingId}`);
      }
    });
  };

  useEffect(() => {
    dispatch(getAllschedule());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)) {
        setShowDropdown(false);
        setFilteredUsers([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Check if the flag is set in session storage
    const openReviewModal = sessionStorage.getItem('openReviewModal');
    if (openReviewModal) {
      setReviewModel(true); // Open the review modal
      sessionStorage.removeItem('openReviewModal'); // Remove the flag
    }
  }, []);

  const handleRating = (value) => {

    if (value === rating) {
      setRating(rating - 1);
    } else {
      setRating(value);
    }
  };

  const handleButtonClick = (button) => {
    setActiveButton((prev) => {
      if (prev.includes(button)) {
        return prev.filter((b) => b !== button);
      } else {
        return [...prev, button];
      }
    });
  };

  const scheduleSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .matches(/^[^\d]/, 'Title must not start with a number'),

    date: Yup.date()
      .required('Date is required'),

    startTime: Yup.string()
      .required('Start time is required')
      .test('is-future-time', 'Start time must be in the future', function (value) {
        const { date } = this.parent;
        if (!date || !value) return true;

        const selectedDate = new Date(date);
        const now = new Date();

        // If the selected date is today
        if (
          selectedDate.toDateString() === now.toDateString()
        ) {
          const [hours, minutes] = value.split(':');
          const selectedTime = new Date();
          selectedTime.setHours(+hours, +minutes, 0, 0);

          return selectedTime > now;
        }

        return true; // for future dates
      }),


    endTime: Yup.string()
      .required('End time is required')
      .test('is-greater', 'End time should be after start time', function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        return value > startTime;
      }),

    meetingLink: Yup.string()
      .required('Meeting link is required'),

    description: Yup.string()
      .required('Description is required'),

    reminder: Yup.array()
      .of(Yup.string()
        .oneOf([
          '5 min before',
          '10 min before',
          '15 min before',
          '30 min before',
          '1 hr before',
          '2 hr before',
          '1 day before',
          '2 days before'
        ], 'Please select a valid reminder option')
      )
      .min(1, 'Please select at least one reminder'),

    recurringMeeting: Yup.string()
      .oneOf(['DoesNotRepeat', 'daily', 'weekly', 'monthly', 'custom'], 'Please select a valid recurring option'),

    customRecurrence: Yup.object().when('recurringMeeting', {
      is: 'custom',
      then: () => Yup.object({
        repeatType: Yup.string()
          .required('Repeat type is required')
          .oneOf(['daily', 'weekly', 'monthly', 'yearly'], 'Please select a valid repeat type'),

        repeatEvery: Yup.number()
          .required('Repeat frequency is required')
          .min(1, 'Must be at least 1'),

        repeatOn: Yup.array()
          .of(Yup.string()
            .oneOf(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']))
          .when('repeatType', {
            is: 'weekly',
            then: () => Yup.array().min(1, 'Please select at least one day')
          }),

        ends: Yup.string()
          .required('Please select when the recurring meeting ends')
          .oneOf(['never', 'on', 'after'], 'Invalid end option'),

        endDate: Yup.date().when('ends', {
          is: 'on',
          then: () => Yup.date()
            .required('End date is required')
        }),

        Recurrence: Yup.number().when('ends', {
          is: 'after',
          then: () => Yup.number().required('Recurrence is required')
            .min(1, 'Must be at least 1'),
        }),

        Monthfirst: Yup.string()
          .oneOf(['firstmonday', 'firstday'])
          .when('repeatType', {
            is: 'monthly',
            then: () => Yup.string().required('Please select a valid option')
          }),


      }),
      otherwise: () => Yup.object().nullable()
    }),

    invitees: Yup.array()
      .of(
        Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Email is required'),
        })
      )
      .test('min-invitees', 'Please add at least one invitee', function (invitees) {
        const nonHostInvitees = invitees?.filter(invitee => invitee._id !== userId) || [];
        return nonHostInvitees.length >= 1;
      })
  });

  const FRONT_URL = 'localhost:3000'

  // Function to generate a random meeting ID of specified length
  const generateMeetingId = (length) => {
    const array = new Uint8Array(length / 2); // Create a byte array
    window.crypto.getRandomValues(array); // Fill it with random values
    return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join(''); // Convert to hex string
  };

  const calculateMeetingDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`); // Use a fixed date
    const end = new Date(`1970-01-01T${endTime}:00`); // Use a fixed date

    // Calculate the difference in milliseconds
    const durationInMilliseconds = end - start;

    // Convert milliseconds to minutes
    return Math.max(0, Math.floor(durationInMilliseconds / 60000)); // Return 0 if negative
  };

  return (
    <div>
      <HomeNavBar />
      <section className='j_index_main' style={{ backgroundColor: "#060A11" }}>
        {requestSent && (
          <div className="position-fixed top-0 end-0 p-3 m-3 j_Invite text-white" style={{ zIndex: '1', }}>
            {joinRequestStatus}
          </div>
        )}
        <div className="row">
          <div className="col-1 p-0 j_sidebar_width">
            <SideBar />
          </div>
          <div className="col-11 p-0 j_contant_width">
            <div className="j_home_connent">
              <h4 className='text-white text-center j_home_connent_h4'>Welcome to Effortless Communication - <br /> Let's Connect!</h4>
            </div>
            <div className="row justify-content-center j_flex_direction">
              <div className="col-4 g-5 ">
                <div className="j_home_cards"
                  onClick={() => {
                    if (!gettoken && !userId) {
                      enqueueSnackbar('Please login to create new meeting', {
                        variant: 'error', autoHideDuration: 3000, anchorOrigin: {
                          vertical: 'top', // Position at the top
                          horizontal: 'right', // Position on the right
                        }
                      });
                      return;
                    }
                    setActiveItem('New Meeting');
                    const newMeetingId = generateMeetingId(20);
                    const meetingLink = `${FRONT_URL}/screen/${newMeetingId}`;
                    setTimeout(() => {
                      navigate(`/screen/${newMeetingId}`, { state: { meetingLink, status: true, hostUserId: userId } });
                    }, 1000);
                  }}
                  style={{
                    border: activeItem === 'New Meeting' ? '2px solid #bfbfbf' : 'none',
                  }}>
                  <img
                    src={meeting}
                    alt="new meeting"
                    style={{ height: '25px', width: '25px', filter: activeItem === 'New Meeting' ? 'brightness(1)' : 'brightness(0.5)' }}
                  />
                  <span className='j_text_sixze text-nowrap mt-4 mb-0' style={{ color: activeItem === 'New Meeting' ? '#fff' : '#bfbfbf', }}>New Meeting</span>
                </div>
              </div>
              <div className="col-4 g-5 ">
                <div className="j_home_cards" type="button"
                  onClick={() => {
                    if (!gettoken && !userId) {
                      enqueueSnackbar('Please login to schedule a meeting', {
                        variant: 'error', autoHideDuration: 3000, anchorOrigin: {
                          vertical: 'top', // Position at the top
                          horizontal: 'right', // Position on the right
                        }
                      });
                      return;
                    }
                    setActiveItem('Schedule Meeting');
                    handleScheduleshow();
                  }}
                  style={{
                    border: activeItem === 'Schedule Meeting' ? '2px solid #bfbfbf' : 'none',
                  }}>
                  <img
                    src={Schedule}
                    alt="schedule meeting"
                    style={{ height: '25px', width: '25px', filter: activeItem === 'Schedule Meeting' ? 'brightness(1)' : 'brightness(0.5)' }}
                  />
                  <span className='j_text_sixze text-nowrap mt-4 mb-0' style={{ color: activeItem === 'Schedule Meeting' ? '#fff' : '#bfbfbf', }}>Schedule Meeting</span>
                </div>
              </div>
              <div className="col-4 g-5 ">
                <div className="j_home_cards" type="button"
                  // onClick={() => {
                  //   if (!gettoken || !userId) {
                  //     alert('Please login to Join a meeting');
                  //     return;
                  //   }
                  //   setActiveItem('Join Meeting');
                  //   handlejoinshow()
                  // }}
                  onClick={() => {
                    if (!gettoken && !userId) {
                      enqueueSnackbar('Please login to Join a meeting', {
                        variant: 'error', autoHideDuration: 3000, anchorOrigin: {
                          vertical: 'top', // Position at the top
                          horizontal: 'right', // Position on the right
                        }
                      });
                      return;
                    }
                    setActiveItem('Join Meeting');
                    handlejoinshow()
                  }}
                  style={{
                    border: activeItem === 'Join Meeting' ? '2px solid #bfbfbf' : 'none',
                  }}>
                  <img
                    src={plus}
                    alt="join meeting"
                    style={{ height: '25px', width: '25px', filter: activeItem === 'Join Meeting' ? 'brightness(1)' : 'brightness(0.5)' }}
                  />
                  <span className='j_text_sixze text-nowrap mt-4 mb-0' style={{ color: activeItem === 'Join Meeting' ? '#fff' : '#bfbfbf', }}>Join Meeting</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================ Schedule Meeting Modal ============================  */}
        <Modal
          show={ScheduleModal}
          onHide={handleScheduleclose}
          size="lg"
          centered
          contentClassName="j_modal_schedule "
          dialogClassName="j_Schedule_width"
        >
          <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
            <Modal.Title className="j_join_title text-white">Schedule Meeting</Modal.Title>
            <IoClose
              style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }}
              onClick={handleScheduleclose}
            />
          </Modal.Header>
          <div className="j_modal_header"></div>
          <Modal.Body className="py-0">
            <Formik
              initialValues={{
                userId: userId,
                title: '',
                date: '',
                startTime: '',
                endTime: '',
                meetingLink: '',
                description: '',
                reminder: [],
                recurringMeeting: 'DoesNotRepeat',
                customRecurrence: {
                  repeatType: '',
                  repeatEvery: "1",
                  repeatOn: [],
                  ends: '0',
                  endDate: '',
                  Recurrence: '1',
                  Monthfirst: '',
                },
                invitees: []
              }}
              validationSchema={scheduleSchema}
              onSubmit={(values, { resetForm }) => {
                if (!gettoken && !userId) {
                  enqueueSnackbar('Please login to create a schedule', {
                    variant: 'error', autoHideDuration: 3000, anchorOrigin: {
                      vertical: 'top', // Position at the top
                      horizontal: 'right', // Position on the right
                    }
                  });
                  return;
                }
                const currentUserPlanType = currentUser?.planType; // Adjust this based on your actual user object structure

                // Check if the user is trying to schedule a meeting that exceeds their plan limits
                if (currentUserPlanType === 'Basic') {
                  const meetingDuration = calculateMeetingDuration(values.startTime, values.endTime);
                  if (meetingDuration > 30) {
                    enqueueSnackbar('Your plan allows meetings up to 30 minutes only.', {
                      variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                        vertical: 'top', // Position at the top
                        horizontal: 'right', // Position on the right
                      }
                    });
                    return;
                  }

                  // Check if the number of participants exceeds 50
                  if (values.invitees.length >= 50) {
                    // alert('Your Basic plan allows a maximum of 50 participants.');
                    enqueueSnackbar('Your plan allows a maximum of 50 participants.', {
                      variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                        vertical: 'top', // Position at the top
                        horizontal: 'right', // Position on the right
                      }
                    });
                    return;
                  }
                } else if (currentUserPlanType === 'Professional') {
                  // Example: Check if the meeting duration exceeds 40 minutes
                  const meetingDuration = calculateMeetingDuration(values.startTime, values.endTime); // Implement this function based on your logic
                  if (meetingDuration > 300) {
                    enqueueSnackbar('Your plan allows meetings up to 5 hours only.', {
                      variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                        vertical: 'top', // Position at the top
                        horizontal: 'right', // Position on the right
                      }
                    });
                    return;
                  }

                  // Check if the number of participants exceeds 50
                  if (values.invitees.length >= 150) {
                    // alert('Your Basic plan allows a maximum of 150 participants.');
                    enqueueSnackbar('Your plan allows a maximum of 150 participants.', {
                      variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                        vertical: 'top', // Position at the top
                        horizontal: 'right', // Position on the right
                      }
                    });
                    return;
                  }
                } else {
                  const meetingDuration = calculateMeetingDuration(values.startTime, values.endTime); // Implement this function based on your logic
                  if (meetingDuration > 600) {
                    enqueueSnackbar('Your plan allows meetings up to 10 hours only.', {
                      variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                        vertical: 'top', // Position at the top
                        horizontal: 'right', // Position on the right
                      }
                    });
                    return;
                  }

                  // Check if the number of participants exceeds 50
                  if (values.invitees.length >= 300) {
                    // alert('Your Basic plan allows a maximum of 300  participants.');
                    enqueueSnackbar('Your plan allows a maximum of 300  participants.', {
                      variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                        vertical: 'top', // Position at the top
                        horizontal: 'right', // Position on the right
                      }
                    });
                    return;
                  }
                }

                dispatch(createschedule(values)).then((response) => {
                  // console.log("Response from API:", response);
                  if (response.payload?.status === 200) {
                    resetForm();
                    handleScheduleclose();
                  }
                });
              }}
            >
              {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                  <div className="row B_flex_reverse">
                    <div className="col-12 col-lg-8 ps-0 j_schedule_border">
                      <div className="mb-3 pt-3">
                        <label htmlFor="title" className="form-label text-white j_join_text">Title</label>
                        <input
                          type="text"
                          className="form-control j_input j_join_text"
                          id="title"
                          name="title"
                          value={values.title}
                          onChange={handleChange}
                          placeholder="Enter title for meeting"
                        />
                        {touched.title && errors.title && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.title}</div>}
                      </div>

                      <div className="j_schedule_DnT B_schedule_DnT">
                        <div className="mb-3">
                          <label htmlFor="date" className="form-label text-white j_join_text">Date</label>
                          <input
                            type="date"
                            className="form-control j_input j_join_text B_schedule_input"
                            id="date"
                            name="date"
                            value={values.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]} // This sets today's date as the minimum
                          />
                          {touched.date && errors.date && (
                            <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.date}</div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="startTime" className="form-label text-white j_join_text">Start Time</label>
                          <input
                            type="time"
                            className="form-control j_input j_join_text B_schedule_input"
                            id="startTime"
                            name="startTime"
                            value={values.startTime}
                            onChange={handleChange}
                            min={
                              values.date === new Date().toISOString().split("T")[0]
                                ? new Date().toTimeString().split(":").slice(0, 2).join(":")
                                : undefined
                            }
                          />
                          {touched.startTime && errors.startTime && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.startTime}</div>}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="endTime" className="form-label text-white j_join_text">End Time</label>
                          <input
                            type="time"
                            className="form-control j_input j_join_text B_schedule_input"
                            id="endTime"
                            name="endTime"
                            value={values.endTime}
                            onChange={handleChange}
                          />
                          {touched.endTime && errors.endTime && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.endTime}</div>}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="meetingLink" className="form-label text-white j_join_text">Meeting Link</label>
                        <select
                          className="form-select j_select j_join_text"
                          id="meetingLink"
                          name="meetingLink"
                          value={values.meetingLink}
                          onChange={handleChange}
                        >
                          <option value="">Select</option>
                          <option value="GenerateaOneTimeMeetingLink">Generate a one time meeting link</option>
                          <option value="UseMyPersonalRoomLink">Use my personal room link</option>
                        </select>
                        {touched.meetingLink && errors.meetingLink && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.meetingLink}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="description" className="form-label text-white j_join_text">Description</label>
                        <textarea
                          className="form-control j_input j_join_text"
                          id="description"
                          name="description"
                          rows="3"
                          value={values.description}
                          onChange={handleChange}
                          placeholder="Enter a description for meeting"
                        />
                        {touched.description && errors.description && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.description}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-white j_join_text">Reminder</label>
                        <div>
                          {['5 min before', '10 min before', '15 min before', '30 min before',
                            '1 hr before', '2 hr before', '1 day before', '2 days before'].map((reminder) => (
                              <button
                                key={reminder}
                                type="button"
                                className={`btn j_schedule_btn ${values.reminder.includes(reminder) ? 'j_schedule_selected_btn' : ''}`}
                                onClick={() => {
                                  const newReminders = values.reminder.includes(reminder)
                                    ? values.reminder.filter(r => r !== reminder)
                                    : [...values.reminder, reminder];
                                  setFieldValue('reminder', newReminders);
                                }}
                              >
                                {reminder}
                              </button>
                            ))}
                        </div>
                        {touched.reminder && errors.reminder && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.reminder}</div>}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="recurringMeeting" className="form-label text-white j_join_text">Recurring Meetings</label>
                        <select
                          className="form-select j_select j_join_text"
                          id="recurringMeeting"
                          name="recurringMeeting"
                          value={values.recurringMeeting}
                          onChange={(e) => {
                            handleChange(e);
                            if (e.target.value === 'custom') {
                              handleCustomModalShow();
                            }
                          }}
                        >
                          <option value="DoesNotRepeat">Does not repeat</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="custom">Custom</option>
                        </select>
                        {touched.recurringMeeting && errors.recurringMeeting &&
                          <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.recurringMeeting}</div>}
                      </div>

                      <div className="modal-footer j_schedule_footer border-0 p-0 pt-4 pb-3 B_Gap_Button">
                        <button
                          type="button"
                          className="btn btn-outline-light j_home_button B_schedule_btn1 fw-semibold"
                          onClick={handleScheduleclose}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-light j_home_button fw-semibold">
                          Schedule
                        </button>
                      </div>
                    </div>

                    <div className="col-12 col-lg-4 pe-0 B_paddingStart">
                      <div className="mb-3 pt-3 B_MarGin">
                        <p className='mb-0 text-white'>
                          Invitees ({values.invitees.length + (userId ? 1 : 0)})
                        </p>
                        <div className="position-relative mt-1">
                          <IoSearch className='position-absolute' style={{ top: "50%", transform: "translateY(-50%)", left: "4px", fontSize: "15px", color: "rgba(255, 255, 255, 0.7)" }} />
                          <input
                            ref={searchInputRef}
                            type="search"
                            name="invitees"
                            className="form-control text-white j_input ps-4 j_join_text"
                            placeholder="Add people by name or email..."
                            style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                            onChange={(e) => {
                              const searchTerm = e.target.value.toLowerCase();
                              const filtered = allusers.filter(user =>
                                user.email.toLowerCase().includes(searchTerm) ||
                                user.name.toLowerCase().includes(searchTerm)
                              );
                              setFilteredUsers(filtered);
                              setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                          />
                        </div>
                        {showDropdown && (
                          <div
                            ref={dropdownRef}
                            className="position-absolute mt-1 B_suggestion"
                            style={{
                              backgroundColor: "#202F41",
                              borderRadius: '5px',
                              width: '31%',
                              zIndex: 1000,
                              maxHeight: '200px',
                              overflowY: 'auto'
                            }}
                          >
                            {filteredUsers.length > 0 ? (
                              filteredUsers
                                .filter(user => user._id !== userId)
                                .map((user) => (
                                  <div
                                    key={user._id}
                                    className="d-flex align-items-center p-2 cursor-pointer hover-bg-dark"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      if (!values.invitees.some(invitee => invitee.email === user.email)) {
                                        setFieldValue('invitees', [...values.invitees, {
                                          _id: user._id,
                                          name: user.name,
                                          email: user.email,
                                          photo: user.photo
                                        }]);
                                      }
                                      setShowDropdown(false);
                                    }}
                                  >
                                    <div className="me-2">
                                      {user.photo ? (
                                        <img
                                          src={`${IMG_URL}${user.photo}`}
                                          alt="Profile"
                                          className="rounded-circle"
                                          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                        />
                                      ) : (
                                        <div
                                          className="rounded-circle d-flex align-items-center justify-content-center"
                                          style={{
                                            fontSize: '12px',
                                            width: '30px',
                                            height: '30px',
                                            // backgroundColor: '#364758',
                                            backgroundColor: `hsl(${Array.from(user._id || user.email || user.name || '').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}, 70%, 45%)`,
                                            color: 'white'
                                          }}
                                        >
                                          {/* {user.name.charAt(0).toUpperCase()} */}
                                          {user.name?.charAt(0).toUpperCase()}{user.name?.split(' ')[1] ? user.name?.split(' ')[1]?.charAt(0).toUpperCase() : ''}
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-white">
                                      <div style={{ fontSize: '14px' }}>{user.name}</div>
                                      <div style={{ fontSize: '12px', color: '#8B9CAF' }}>{user.email}</div>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <div className="p-3 text-center text-white" style={{ fontSize: '14px' }}>
                                No users found
                              </div>
                            )}
                          </div>
                        )}
                        {touched.invitees && errors.invitees && (
                          <div style={{ fontSize: '14px', marginTop: '4px', color: '#cd1425' }}>
                            {errors.invitees}
                          </div>
                        )}
                        {(values.invitees.length > 0 || userId) && (
                          <div className="mt-2">
                            {allusers
                              .filter(user => user._id === userId)
                              .map(user => (
                                <div key={user._id} className="d-flex align-items-center mb-1">
                                  <div className="j_margin_end">
                                    {user.photo ? (
                                      <img
                                        src={`${IMG_URL}${user.photo}`}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                          fontSize: '12px',
                                          width: '30px',
                                          height: '30px',
                                          backgroundColor: `hsl(${Array.from(user._id || user.email || user.name || '').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}, 70%, 45%)`,
                                          color: 'white'
                                        }}
                                      >
                                        {/* {user.name.charAt(0).toUpperCase()} */}
                                        {user.name?.charAt(0).toUpperCase()}{user.name?.split(' ')[1] ? user.name?.split(' ')[1]?.charAt(0).toUpperCase() : ''}
                                      </div>
                                    )}
                                  </div>
                                  <div className="ms-2">
                                    <span className="text-white" style={{ fontSize: '13.5px' }}>{user.email}</span>
                                    <p className="mb-0" style={{ fontSize: '13px', color: '#BFBFBF' }}>Host</p>
                                  </div>
                                </div>
                              ))}

                            {values.invitees.map((invitee, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="j_margin_end">
                                    {invitee.photo ? (
                                      <img
                                        src={`${IMG_URL}${invitee.photo}`}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                          fontSize: '12px',
                                          width: '30px',
                                          height: '30px',
                                          // backgroundColor: '#364758',
                                          backgroundColor: `hsl(${Array.from(invitee._id || invitee.email || invitee.name || '').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}, 70%, 45%)`,
                                          color: 'white'
                                        }}
                                      >
                                        {/* {invitee.name.charAt(0).toUpperCase()} */}
                                        {invitee.name?.charAt(0).toUpperCase()}{invitee.name?.split(' ')[1] ? invitee.name?.split(' ')[1]?.charAt(0).toUpperCase() : ''}
                                      </div>
                                    )}
                                  </div>
                                  <div className="j_margin_start">
                                    <span className="text-white" style={{ fontSize: '14px' }}>{invitee.email}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-link text-danger p-0 ms-2"
                                  onClick={() => {
                                    const newInvitees = values.invitees.filter((_, i) => i !== index);
                                    setFieldValue('invitees', newInvitees);
                                  }}
                                >
                                  <img src={bin} alt="bin" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {values.invitees.length > 0 && (
                          <button
                            type="button"
                            className="btn btn-link text-white p-0"
                            style={{
                              fontSize: '14px',
                              textDecoration: 'underline',
                              border: 'none',
                              background: 'none'
                            }}
                            onClick={() => setFieldValue('invitees', [])}
                          >
                            Remove all
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ============================ Schedule Meeting custom Modal ============================  */}
                  {/* <Modal
                    show={customModal}
                    onHide={handlecustomclose}
                    centered
                    contentClassName="j_modal_join"
                  >
                    <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
                      <Modal.Title className="text-white j_join_title">Custom Recurrence</Modal.Title>
                      <IoClose
                        style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }}
                        onClick={handlecustomclose}
                      />
                    </Modal.Header>
                    <div className="j_modal_header"></div>
                    <Modal.Body>
                      <div className="j_schedule_Repeat">
                        <div className="mb-3 flex-fill me-2 j_select_fill">
                          <label htmlFor="RepeatType" className="form-label text-white j_join_text">Repeat Type</label>
                          <select
                            className="form-select j_select j_join_text"
                            id="RepeatType"
                            name="customRecurrence.repeatType"
                            value={values.customRecurrence.repeatType}
                            onChange={handleChange}
                          >
                            <option value="0">Select</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        </div>
                        <div className="mb-3 flex-fill j_select_fill">
                          <label htmlFor="RepeatEvery" className="form-label text-white j_join_text">Repeat Every</label>
                          <div className='position-relative'>
                            <input
                              type="text"
                              className="form-control j_input j_join_text"
                              id="RepeatEvery"
                              name="customRecurrence.repeatEvery"
                              value={values.customRecurrence.repeatEvery}
                              onChange={(e) => setFieldValue('customRecurrence.repeatEvery', e.target.value)}
                            />
                            <div className="j_custom_icons">
                              <FaAngleUp
                                style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                onClick={() => setFieldValue('customRecurrence.repeatEvery', Number(values.customRecurrence.repeatEvery) + 1)}
                              />
                              <FaAngleDown
                                style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                onClick={() => setFieldValue('customRecurrence.repeatEvery', Math.max(values.customRecurrence.repeatEvery - 1, 1))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {values.customRecurrence.repeatType === 'weekly' && (
                        <div className="mb-3">
                          <label className="form-label text-white j_join_text">Repeat On</label>
                          <div className="d-flex B_Repeat_on_btn">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                              <button
                                key={day}
                                className={`btn ${values.customRecurrence.repeatOn.includes(day) ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                onClick={() => {
                                  const newDays = values.customRecurrence.repeatOn.includes(day)
                                    ? values.customRecurrence.repeatOn.filter(d => d !== day)
                                    : [...values.customRecurrence.repeatOn, day];
                                  setFieldValue('customRecurrence.repeatOn', newDays);
                                }}
                              >
                                {day.charAt(0)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {values.customRecurrence.repeatType === 'monthly' && (
                        <div className="mb-3">
                          <label className="text-white j_join_text">Every</label>
                          <select
                            className="form-select j_select j_join_text"
                            name="customRecurrence.Monthfirst"
                            value={values.customRecurrence.Monthfirst}
                            onChange={handleChange}
                          >
                            <option value="0">Select</option>
                            <option value="firstmonday">Monthly on first monday</option>
                            <option value="firstday">Monthly on first day</option>
                          </select>
                        </div>
                      )}

                      <div className="j_schedule_Repeat">
                        <div className="mb-3 flex-fill me-2  j_select_fill">
                          <label htmlFor="ends" className="form-label text-white j_join_text">Ends</label>
                          <select
                            className="form-select j_select j_join_text"
                            name="customRecurrence.ends"
                            value={values.customRecurrence.ends}
                            onChange={handleChange}
                          >
                            <option value="0">Select</option>
                            <option value="never">Never</option>
                            {values.customRecurrence.repeatType !== 'daily' && <option value="on">On</option>}
                            <option value="after">After</option>
                          </select>
                        </div>

                        {values.customRecurrence.ends === "on" && (
                          <div className="mb-3 flex-fill j_select_fill">
                            <label htmlFor="endDate" className="form-label text-white j_join_text"></label>
                            <input
                              type="date"
                              className="form-control j_input j_join_text j_special_m"
                              name="customRecurrence.endDate"
                              value={values.customRecurrence.endDate}
                              onChange={handleChange}
                            />
                            {touched.customRecurrence?.endDate && errors.customRecurrence?.endDate && (
                              <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.customRecurrence.endDate}</div>
                            )}
                          </div>
                        )}

                        {values.customRecurrence.ends === "after" && (
                          console.log(values.customRecurrence.Recurrence),

                          <div className="mb-3 flex-fill j_select_fill J_Fill_bottom">
                            <label className="form-label text-white j_join_text"></label>
                            <div className='position-relative'>
                              <input
                                type="text"
                                name='customRecurrence.Recurrence'
                                className="form-control j_input j_join_text j_special_m"
                                value={`${values.customRecurrence.Recurrence} Recurrence`}
                                onChange={(e) => setFieldValue('customRecurrence.Recurrence', e.target.value)}
                              />
                              <div className="j_custom_icons">
                                <FaAngleUp
                                  style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                  onClick={() => setFieldValue('customRecurrence.Recurrence', Number(values.customRecurrence.Recurrence) + 1)}
                                />
                                <FaAngleDown
                                  style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                  onClick={() => setFieldValue('customRecurrence.Recurrence', Math.max(values.customRecurrence.Recurrence - 1, 1))}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <Modal.Footer className="j_custom_footer border-0 p-0 pt-4 pb-3">
                        <Button
                          variant="outline-light"
                          className="j_custom_button fw-semibold"
                          onClick={() => { handlecustomclose(); handleScheduleshow() }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="light"
                          className="j_custom_button fw-semibold"
                          onClick={() => {
                            console.log("customRecurrence", values.customRecurrence);
                            setFieldValue('customRecurrence', values.customRecurrence);
                            handlecustomclose();
                          }}
                        >
                          Done
                        </Button>
                      </Modal.Footer>
                    </Modal.Body>
                  </Modal> */}

                  {isCustomModalVisible && (
                    <div className="custom-modal">
                      <div className="custom-modal-content">
                        <div className="custom-modal-header">
                          <h2 className="text-white j_join_title">Custom Recurrence</h2>
                          <IoClose
                            style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }}
                            onClick={handleCustomModalClose}
                          />
                        </div>
                        <div className="j_modal_header m-0 pt-1"></div>
                        <div className="custom-modal-body">
                          <div className="j_schedule_Repeat">
                            <div className="mb-3 flex-fill me-2 j_select_fill">
                              <label htmlFor="RepeatType" className="form-label text-white j_join_text">Repeat Type</label>
                              <select
                                className="form-select j_select j_join_text"
                                id="RepeatType"
                                name="customRecurrence.repeatType"
                                value={values.customRecurrence.repeatType}
                                onChange={handleChange}
                              >
                                <option value="0">Select</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                              </select>
                            </div>
                            <div className="mb-3 flex-fill j_select_fill">
                              <label htmlFor="RepeatEvery" className="form-label text-white j_join_text">Repeat Every</label>
                              <div className='position-relative'>
                                <input
                                  type="text"
                                  className="form-control j_input j_join_text"
                                  id="RepeatEvery"
                                  name="customRecurrence.repeatEvery"
                                  value={values.customRecurrence.repeatEvery}
                                  onChange={(e) => setFieldValue('customRecurrence.repeatEvery', e.target.value)}
                                />
                                <div className="j_custom_icons">
                                  <FaAngleUp
                                    style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                    onClick={() => setFieldValue('customRecurrence.repeatEvery', Number(values.customRecurrence.repeatEvery) + 1)}
                                  />
                                  <FaAngleDown
                                    style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                    onClick={() => setFieldValue('customRecurrence.repeatEvery', Math.max(values.customRecurrence.repeatEvery - 1, 1))}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {values.customRecurrence.repeatType === 'weekly' && (
                            <div className="mb-3">
                              <label className="form-label text-white j_join_text">Repeat On</label>
                              <div className="d-flex B_Repeat_on_btn">
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                  <button
                                    key={day}
                                    className={`btn ${values.customRecurrence.repeatOn.includes(day) ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                                    onClick={() => {
                                      const newDays = values.customRecurrence.repeatOn.includes(day)
                                        ? values.customRecurrence.repeatOn.filter(d => d !== day)
                                        : [...values.customRecurrence.repeatOn, day];
                                      setFieldValue('customRecurrence.repeatOn', newDays);
                                    }}
                                  >
                                    {day.charAt(0)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {values.customRecurrence.repeatType === 'monthly' && (
                            <div className="mb-3">
                              <label className="text-white j_join_text">Every</label>
                              <select
                                className="form-select j_select j_join_text"
                                name="customRecurrence.Monthfirst"
                                value={values.customRecurrence.Monthfirst}
                                onChange={handleChange}
                              >
                                <option value="0">Select</option>
                                <option value="firstmonday">Monthly on first monday</option>
                                <option value="firstday">Monthly on first day</option>
                              </select>
                            </div>
                          )}

                          <div className="j_schedule_Repeat">
                            <div className="mb-3 me-2 j_select_fill">
                              <label htmlFor="ends" className="form-label text-white j_join_text">Ends</label>
                              <select
                                className="form-select j_select j_join_text"
                                name="customRecurrence.ends"
                                value={values.customRecurrence.ends}
                                onChange={handleChange}
                              >
                                <option value="0">Select</option>
                                <option value="never">Never</option>
                                {values.customRecurrence.repeatType !== 'daily' && <option value="on">On</option>}
                                <option value="after">After</option>
                              </select>
                            </div>

                            {values.customRecurrence.ends === "on" && (
                              <div className="mb-3 flex-fill j_select_fill">
                                <label htmlFor="endDate" className="form-label text-white j_join_text"></label>
                                <input
                                  type="date"
                                  className="form-control j_input j_join_text j_special_m"
                                  name="customRecurrence.endDate"
                                  value={values.customRecurrence.endDate}
                                  onChange={handleChange}
                                />
                                {touched.customRecurrence?.endDate && errors.customRecurrence?.endDate && (
                                  <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.customRecurrence.endDate}</div>
                                )}
                              </div>
                            )}

                            {values.customRecurrence.ends === "after" && (
                              console.log(values.customRecurrence.Recurrence),

                              <div className="mb-3 flex-fill j_select_fill J_Fill_bottom">
                                <label className="form-label text-white j_join_text"></label>
                                <div className='position-relative'>
                                  <input
                                    type="text"
                                    name='customRecurrence.Recurrence'
                                    className="form-control j_input j_join_text j_special_m"
                                    value={`${values.customRecurrence.Recurrence} Recurrence`}
                                    onChange={(e) => setFieldValue('customRecurrence.Recurrence', e.target.value)}
                                  />
                                  <div className="j_custom_icons">
                                    <FaAngleUp
                                      style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                      onClick={() => setFieldValue('customRecurrence.Recurrence', Number(values.customRecurrence.Recurrence) + 1)}
                                    />
                                    <FaAngleDown
                                      style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                      onClick={() => setFieldValue('customRecurrence.Recurrence', Math.max(values.customRecurrence.Recurrence - 1, 1))}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="j_custom_footer d-flex border-0 p-0 pt-4 pb-3">
                          <button
                            className="btn btn-outline-light j_custom_button fw-semibold"
                            onClick={handleCustomModalClose}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-light j_custom_button fw-semibold"
                            onClick={() => {
                              // Handle the done action
                              setFieldValue('customRecurrence', values.customRecurrence);
                              handleCustomModalClose();
                            }}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

        {/* ============================ join Meeting Modal ============================ */}
        <Modal
          show={joinModal}
          onHide={handlejoinclose}
          centered
          contentClassName="j_modal_join"
        >
          <Modal.Header className="border-0 d-flex justify-content-between align-items-center">
            <Modal.Title className="text-white j_join_title">Join Meeting</Modal.Title>
            <IoClose
              style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }}
              onClick={handlejoinclose}
            />
          </Modal.Header>
          <div className="j_modal_header"></div>
          <Modal.Body>
            <form onSubmit={(e) => handleJoinSubmit(e)}
            // onSubmit={(e) => {
            //   e.preventDefault();

            //   if (!meetingId.trim()) {
            //     setError('Please enter a meeting ID');
            //     return;
            //   }

            //   // Find meeting in allschedule that matches the entered ID
            //   const meeting = allschedule.find(schedule =>
            //     schedule.meetingLink.includes(meetingId.trim())
            //   );

            //   if (!meeting) {
            //     setError('Invalid meeting ID');
            //     return;
            //   }

            //   // Check if current time is within meeting time
            //   const meetingDate = new Date(meeting.date);
            //   const today = new Date();
            //   const startTime = meeting.startTime.split(':');
            //   const endTime = meeting.endTime.split(':');

            //   meetingDate.setHours(parseInt(startTime[0]), parseInt(startTime[1]));
            //   const meetingEndDate = new Date(meeting.date);
            //   meetingEndDate.setHours(parseInt(endTime[0]), parseInt(endTime[1]));

            //   // Instead of directly navigating to the meeting, send a join request
            //   if (socket) {
            //     socket.emit('request-to-join', {
            //       roomId: meetingId,
            //       userId: currentUser?._id,
            //       userName: currentUser?.name
            //     });

            //     setRequestSent(true);
            //     setJoinRequestStatus('Waiting for host approval...');

            //     // Don't close the modal yet, update it to show waiting status
            //     // handlejoinclose();
            //     // navigate(`/screen/${meetingId}`);
            //   } else {
            //     setError('Connection error. Please try again.');
            //   }
            // }}
            >
              <div className="mb-3">
                <label htmlFor="meetingId" className="form-label text-white j_join_text">
                  Meeting ID or Personal Link
                </label>
                <input
                  type="text"
                  className="form-control j_input j_join_text"
                  id="meetingId"
                  value={meetingId}
                  onChange={(e) => {
                    setMeetingId(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter meeting ID"
                />
                {error && (
                  <div style={{ color: '#cd1425', fontSize: '14px' }}>{error}</div>
                )}
              </div>
              {/* <div className="mb-3">
                <label htmlFor="meetingPassword" className="form-label text-white j_join_text">
                  Password
                </label>
                <input
                  type="text"
                  className="form-control j_input j_join_text"
                  id="meetingPassword"
                  placeholder="Enter Password"
                />
              </div> */}
              {/^\d+$/.test(meetingId) && (
                <div className="mb-3">
                  <label htmlFor="meetingPassword" className="form-label text-white j_join_text">
                    Password
                  </label>
                  <input
                    type="text"
                    className="form-control j_input j_join_text"
                    id="meetingPassword"
                    placeholder="Enter Password"
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="meetingName" className="form-label text-white j_join_text">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control j_input j_join_text"
                  id="meetingName"
                  value={currentUser?.name}
                  placeholder="Enter Name"
                  readOnly
                />
              </div>
              <Modal.Footer className="border-0 p-0 pt-4 justify-content-center">
                <Button
                  variant="outline-light"
                  className="btn btn-outline-light j_join_button m-1"
                  onClick={handlejoinclose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="light"
                  className="btn btn-light j_join_button m-1"
                  disabled={requestSent}
                >
                  {requestSent ? 'Requesting...' : 'Join'}
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>

        <Modal centered show={ReviewModel} onHide={handleCloseReviewModel} className='B_review_model'>
          <Modal.Header className=' border-0 B_review_model_header' >
            <Modal.Title className='B_review_model_title my-1'>How was your meeting experience?</Modal.Title>
          </Modal.Header>
          <div className='j_modal_header'>
          </div>
          <Modal.Body className='B_review_model_body'>
            <Formik
              initialValues={{
                userId: userId,
                rating: 0,
                trouble: [],
                comments: ''
              }}
              validationSchema={Yup.object().shape({
                rating: Yup.number().min(1, 'Please select a rating').required('Rating is required'),
                comments: Yup.string().required('Comments are required')
              })}
              onSubmit={(values, { resetForm }) => {
                const troubleArray = activeButton.map(item => ({ [item]: item }));
                const reviewData = {
                  userId: userId,
                  rating: rating,
                  trouble: troubleArray,
                  comments: values.comments
                };
                dispatch(createreview(reviewData)).then((response) => {
                  if (response.payload.status == 200 || response.payload.status == 201) {
                    resetForm();
                    setRating(0);
                    setActiveButton([]);
                    handleCloseReviewModel();
                  }
                });
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                  <div className='mt-3'>
                    Help us improve - share your thoughts
                  </div>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= rating ? 'B_yellow_star' : 'B_grey_star'}
                        onClick={() => {
                          handleRating(star);
                          setFieldValue('rating', star);
                        }}
                        style={{ cursor: 'pointer', marginRight: '20px', fontSize: '20px', marginTop: '20px' }}
                      />
                    ))}
                  </div>
                  {errors.rating && touched.rating && (
                    <div className="mt-2" style={{ color: '#cd1425' }}>{errors.rating}</div>
                  )}

                  <div className='B_review_model_text'>
                    What aspect of session gives you trouble?
                  </div>
                  <div className='d-flex gap-5 B_gapDiv justify-content-center'>
                    <div
                      className='B_review_model_Box text-decoration-none'
                      onClick={() => handleButtonClick('audio')}
                      style={{
                        cursor: 'pointer',
                        color: 'white',
                        border: activeButton.includes('audio') ? '1px solid #BFBFBF' : '2px solid transparent',
                        padding: '10px',
                        borderRadius: '5px'
                      }}
                    >
                      <img
                        src={MeetingAudio}
                        alt=""
                        style={{
                          opacity: activeButton.includes('audio') ? 1 : 0.5,
                          color: 'white'
                        }}
                      />
                      <p className='B_Box_Textt' style={{ color: activeButton.includes('audio') ? 'white' : '#BFBFBF' }}>Audio</p>
                    </div>
                    <div
                      className='B_review_model_Box text-decoration-none'
                      onClick={() => handleButtonClick('video')}
                      style={{
                        cursor: 'pointer',
                        color: 'white',
                        border: activeButton.includes('video') ? '1px solid #BFBFBF' : '2px solid transparent',
                        padding: '10px',
                        borderRadius: '5px'
                      }}
                    >
                      <img
                        src={MeetingVideo}
                        alt=""
                        style={{
                          opacity: activeButton.includes('video') ? 1 : 0.5,
                          color: 'white'
                        }}
                      />
                      <p className='B_Box_Textt' style={{ color: activeButton.includes('video') ? 'white' : '#BFBFBF' }}>Video</p>
                    </div>
                    <div
                      className='B_review_model_Box text-decoration-none'
                      onClick={() => handleButtonClick('connection')}
                      style={{
                        cursor: 'pointer',
                        color: 'white',
                        border: activeButton.includes('connection') ? '1px solid #BFBFBF' : '2px solid transparent',
                        padding: '10px',
                        borderRadius: '5px'
                      }}
                    >
                      <img
                        src={MeetingConnection}
                        className='B_review_model_Box_img'
                        alt=""
                        style={{
                          opacity: activeButton.includes('connection') ? 1 : 0.5,
                          color: 'white'
                        }}
                      />
                      <p className='B_Box_Textt' style={{ color: activeButton.includes('connection') ? 'white' : '#BFBFBF' }}>Screen Sharing</p>
                    </div>

                  </div>
                  <div className='mt-5 B_textAreaa' style={{ textAlign: "left" }}>
                    <p className='B_addtional_text'>Additional Comments</p>
                    <textarea
                      name="comments"
                      value={values.comments}
                      onChange={handleChange}
                      className='B_text_Area'
                      placeholder="Enter additional comments"
                      style={{
                        width: '100%',
                        height: '100px',
                        borderRadius: '4px',
                        border: '1px solid #2d394b',
                        backgroundColor: '#202F41',
                        color: '#BFBFBF',
                        padding: '10px',
                        resize: 'none'
                      }}
                    />
                    {errors.comments && touched.comments && (
                      <div className="" style={{ color: '#cd1425' }}>{errors.comments}</div>
                    )}
                  </div>
                  <div className=' BB_margin_home gap-5' style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: "20px" }}>
                    <div className='B_hover_bttn fw-semibold' onClick={handleCloseReviewModel}
                    >
                      Back To Home
                    </div>

                    <button
                      type="submit"
                      className='B_lastbtn fw-semibold'
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: 'none',
                        color: '#000',
                        padding: '8px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease',
                        width: '170px',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

      </section >
    </div >
  )
}

export default Home