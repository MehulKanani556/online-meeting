import React, { useEffect, useRef, useState } from 'react'
import SideBar from '../Component/SideBar'
import HomeNavBar from '../Component/HomeNavBar'
import { FaAngleDown, FaAngleUp, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Formik } from 'formik'
import * as Yup from 'yup';
import bin from '../Image/j_bin.svg'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Button, Modal } from 'react-bootstrap';
import { IoClose, IoSearch } from 'react-icons/io5';
import { IMAGE_URL } from '../Utils/baseUrl';
import { useDispatch, useSelector } from 'react-redux';
import { createschedule, getAllschedule } from '../Redux/Slice/schedule.slice';
import { getAllUsers } from '../Redux/Slice/user.slice';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';


const localizer = momentLocalizer(moment);


const CustomToolbar = (toolbar) => {

  const userId = sessionStorage.getItem('userId')

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const label = () => {
    const date = moment(toolbar.date);
    switch (toolbar.view) {
      case 'week':
        const weekStart = date.clone().startOf('week').format('DD MMM YYYY');
        const weekEnd = date.clone().endOf('week').format('DD MMM YYYY');
        return <span>{`${weekStart} - ${weekEnd}`}</span>;
      case 'day':
        return <span>{date.format('DD MMMM  YYYY')}</span>;

      default:
        return <span>{date.format('MMMM YYYY')}</span>;
    }
  };

  const navigate = useNavigate()
  const FRONT_URL = 'localhost:3000'

  // Function to generate a random meeting ID of specified length
  const generateMeetingId = (length) => {
    const array = new Uint8Array(length / 2); // Create a byte array
    window.crypto.getRandomValues(array); // Fill it with random values
    return Array.from(array, byte => ('0' + byte.toString(16)).slice(-2)).join(''); // Convert to hex string
  };


  return (
    <div className="rbc-toolbar j_rbc_toolbar">
      <span className="rbc-btn-group j_LR_rbc_btn">

        <button type="button" onClick={goToBack}>
          <FaChevronLeft />
        </button>

        {/* <button type="button" onClick={goToCurrent}>
                    Today
                </button> */}

        <span className="rbc-toolbar-label j_toolbar_label" style={{ fontWeight: 'bold' }}>
          {label()}
        </span>
        <button type="button" onClick={goToNext}>
          <FaChevronRight />
        </button>
      </span>
      <span className="rbc-btn-group j_btn_rbc_group">
        {toolbar.views.map(view => (
          <button
            key={view}
            type="button"
            className={view === toolbar.view ? 'rbc-active' : ''}
            onClick={() => toolbar.onView(view)}
            style={{
              backgroundColor: view === toolbar.view ? '#2C343D' : '',
              color: view === toolbar.view ? '#fff' : '#BFBFBF',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 20px',
              margin: '0 2px',
              textTransform: 'capitalize'
            }}
          >
            {view}
          </button>
        ))}
      </span>

      <div className="j_schedule_buttons">
        <button className="btn btn-outline-light j_nav_btn" onClick={toolbar.onScheduleShow}>
          Schedule Now
        </button>
        <button className="btn btn-outline-light j_nav_btn" onClick={() => {
          const newMeetingId = generateMeetingId(20);
          const meetingLink = `${FRONT_URL}/screen/${newMeetingId}`; // Create the meeting link
          navigate(`/screen/${newMeetingId}`, { state: { meetingLink, status: true, hostUserId: userId } }); // Pass the meeting link as state
        }}>
          Meet Now
        </button>
      </div>
    </div>
  );
};


function Schedule() {

  const [selectedReminders, setSelectedReminders] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [ScheduleModal, setScheduleModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [customModal, setcustomModal] = useState(false);
  const [endsSelection, setEndsSelection] = useState("0");
  const [repeatType, setRepeatType] = useState('0');
  const [RepeatEvery1, setRepeatEvery1] = useState(1);
  const [RepeatEvery, setRepeatEvery] = useState(1);
  const userId = sessionStorage.getItem('userId')
  const gettoken = sessionStorage.getItem('token')
  const IMG_URL = IMAGE_URL
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const allusers = useSelector((state) => state.user.allusers);
  const currentUser = allusers.find((id) => id._id === userId)


  const handleScheduleclose = () => {
    setScheduleModal(false)
    setCustomModalVisible(false)
  };
  const handleScheduleshow = () => setScheduleModal(true);
  const handlecustomclose = () => setcustomModal(false);
  const handlecustomshow = () => setcustomModal(true);

  const [isCustomModalVisible, setCustomModalVisible] = useState(false);

  // Function to handle showing the custom modal
  const handleCustomModalShow = () => setCustomModalVisible(true);
  const handleCustomModalClose = (setFieldValue) => {
    setCustomModalVisible(false);
    // Reset the select dropdown to its previous value if no custom recurrence was set
    // This allows the user to select "custom" again
    setFieldValue('recurringMeeting', 'DoesNotRepeat');
  };

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };


  const handleIncrement = () => {
    setRepeatEvery(prev => prev + 1);
  }

  const handleDecrement = () => {
    setRepeatEvery(prev => Math.max(prev - 1, 1));
  }


  const handleIncrement1 = () => {
    setRepeatEvery1(prev => prev + 1);
  }

  const handleDecrement1 = () => {
    setRepeatEvery1(prev => Math.max(prev - 1, 1));
  }

  const toggleReminder = (reminder) => {
    setSelectedReminders(prev =>
      prev.includes(reminder)
        ? prev.filter(r => r !== reminder)
        : [...prev, reminder]
    )
  }

  useEffect(() => {
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

  const allSchedule = useSelector((state) => state.schedule.allschedule)
  // console.log(allSchedule);

  useEffect(() => {
    dispatch(getAllschedule())
  }, [])

  const eventss = [
    {
      title: 'Project Meeting',
      start: new Date(2025, 2, 11, 8, 15), // march 11, 2025, 8:15 PM
      end: new Date(2025, 2, 11, 9, 30),   // march 11, 2025, 9:30 PM
    },
    {
      title: 'Online Meeting',
      start: new Date(2025, 2, 15, 18, 15), // march 15, 2025, 6:15 PM
      end: new Date(2025, 2, 15, 20, 30),   // march 15, 2025, 8:30 PM
    },
    {
      title: 'Project Meeting',
      start: new Date(2025, 2, 26, 11, 45), // march 26, 2025, 11:45 AM
      end: new Date(2025, 2, 26, 12, 45),   // march 26, 2025, 12:45 PM
    },
    {
      title: 'Online Meeting',
      start: new Date(2025, 2, 26, 13, 45), // march 26, 2025, 1:45 PM
      end: new Date(2025, 2, 26, 14, 45),   // march 26, 2025, 2:45 PM
    },
    {
      title: 'Online Meeting',
      start: new Date(2025, 3, 10, 18, 15), // apr 10, 2025, 6:15 PM
      end: new Date(2025, 3, 10, 20, 30),   // apr 10, 2025, 8:30 PM
    },
    {
      title: 'Project Meeting',
      start: new Date(2025, 3, 24, 11, 45), // apr 24, 2025, 11:45 AM
      end: new Date(2025, 3, 24, 12, 45),   // apr 24, 2025, 12:45 PM
    },
    {
      title: 'Online Meeting',
      start: new Date(2025, 3, 29, 13, 45), // apr 29, 2025, 1:45 PM
      end: new Date(2025, 3, 29, 14, 45),   // apr 29, 2025, 2:45 PM
    },
  ]

  const events = allSchedule.map(schedules => {
    const date = new Date(schedules.date); // Parse the date
    const [hours, minutes] = schedules.startTime?.split(':').map(Number); // Extract hours and minutes from startTime
    const [endHours, endMinutes] = schedules.endTime?.split(':').map(Number);
    return {
      title: schedules.title,
      start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes), // Set start date
      end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHours, endMinutes), // Set end date
    }
  })

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
        <div className="row">
          <div className="col-1 p-0 j_sidebar_width">
            <SideBar />
          </div>
          <div className="col-11 p-0 j_contant_width B_TOP_setMargin">
            <div className='j_calender'>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', width: '100%' }}
                views={['day', 'week', 'month']}
                defaultView="day"
                components={{
                  toolbar: (props) => <CustomToolbar {...props} onScheduleShow={handleScheduleshow} />
                }}
              />
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
                console.log("Submitting values:", values);
                if (!gettoken || !userId) {
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
                  // Example: Check if the meeting duration exceeds 40 minutes
                  const meetingDuration = calculateMeetingDuration(values.startTime, values.endTime); // Implement this function based on your logic
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
                          {/* <input
                            type="date"
                            className="form-control j_input j_join_text B_schedule_input"
                            id="date"
                            name="date"
                            value={values.date}
                            onChange={handleChange}
                          /> */}
                          <input
                            type="date"
                            className="form-control j_input j_join_text B_schedule_input"
                            id="date"
                            name="date"
                            value={values.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]} // This sets today's date as the minimum
                          />
                          {touched.date && errors.date && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.date}</div>}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="startTime" className="form-label text-white j_join_text">Start Time</label>
                          {/* <input
                            type="time"
                            className="form-control j_input j_join_text B_schedule_input"
                            id="startTime"
                            name="startTime"
                            value={values.startTime}
                            onChange={handleChange}
                          /> */}
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
                            if (e.target.value === "custom") {
                              // handleScheduleclose();
                              // handlecustomshow();
                              handleCustomModalShow()
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
                                            width: '30px',
                                            height: '30px',
                                            // backgroundColor: '#364758',
                                            backgroundColor: `hsl(${Array.from(user._id || user.email || user.name || '').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}, 70%, 45%)`,
                                            color: 'white'
                                          }}
                                        >
                                          {/* {user.name.charAt(0).toUpperCase()} */}
                                          {user.name.charAt(0).toUpperCase()}{user.name?.split(' ')[1] ? user.name?.split(' ')[1].charAt(0).toUpperCase() : ''}
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
                                          width: '30px',
                                          height: '30px',
                                          // backgroundColor: '#364758',
                                          backgroundColor: `hsl(${Array.from(user._id || user.email || user.name || '').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}, 70%, 45%)`,
                                          color: 'white'
                                        }}
                                      >
                                        {/* {user.name.charAt(0).toUpperCase()} */}
                                        {user.name.charAt(0).toUpperCase()}{user.name?.split(' ')[1] ? user.name?.split(' ')[1].charAt(0).toUpperCase() : ''}
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
                                          width: '30px',
                                          height: '30px',
                                          backgroundColor: '#364758',
                                          color: 'white'
                                        }}
                                      >
                                        {invitee.name.charAt(0).toUpperCase()}
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
                            onClick={() => {
                              // Reset all custom recurrence fields to default
                              setFieldValue('customRecurrence', {
                                repeatType: '',
                                repeatEvery: "1",
                                repeatOn: [],
                                ends: '0',
                                endDate: '',
                                Recurrence: '1',
                                Monthfirst: '',
                              });
                              handleCustomModalClose(setFieldValue); // This will also reset recurringMeeting to 'DoesNotRepeat'
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-light j_custom_button fw-semibold"
                            onClick={() => {
                              // Validate that required fields are filled
                              if (values.customRecurrence.repeatType &&
                                values.customRecurrence.repeatType !== '0' &&
                                values.customRecurrence.ends &&
                                values.customRecurrence.ends !== '0') {

                                // Keep the custom option selected only if properly configured
                                setFieldValue('recurringMeeting', 'custom');
                                setFieldValue('customRecurrence', values.customRecurrence);
                                setCustomModalVisible(false); // Don't use handleCustomModalClose here
                              } else {
                                // If validation fails, reset everything
                                // alert('Please fill all required fields of Custom Recurrence');
                                // Or you could close and reset:
                                // handleCustomModalClose();
                                enqueueSnackbar('Please fill all required fields of Custom Recurrence', {
                                  variant: 'error', autoHideDuration: 3000, anchorOrigin: {
                                    vertical: 'top', // Position at the top
                                    horizontal: 'right', // Position on the right
                                  }
                                });
                                return;
                              }
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
              <div className="mb-3 flex-fill me-2  j_select_fill">
                <label htmlFor="RepeatType" className="form-label text-white j_join_text">Repeat Type</label>
                <select
                  className="form-select j_select j_join_text"
                  id="RepeatType"
                  onChange={(e) => {
                    setRepeatType(e.target.value);
                    setEndsSelection("0");
                    setSelectedDays([]);
                  }} >
                  <option value="0">Select</option>
                  <option value="1">Daily</option>
                  <option value="2">Weekly</option>
                  <option value="3">Monthly</option>
                  <option value="4">Yearly</option>
                </select>
              </div>
              <div className="mb-3 flex-fill  j_select_fill">
                <label htmlFor="RepeatEvery" className="form-label text-white j_join_text">Repeat Every</label>
                <div className='position-relative'>
                  <input
                    type="text"
                    className="form-control j_input j_join_text"
                    id="RepeatEvery"
                    onChange={(e) => setRepeatEvery(Number(e.target.value) || 1)}
                    value={RepeatEvery}
                  />
                  <div className="j_custom_icons">
                    <FaAngleUp
                      style={{ color: 'white', fontSize: '12px' }}
                      onClick={() => handleIncrement()}
                    />
                    <FaAngleDown
                      style={{ color: 'white', fontSize: '12px' }}
                      onClick={() => handleDecrement()}
                    />
                  </div>
                </div>
              </div>
            </div>
            {repeatType === '2' && (
              <div className="mb-3">
                <label className="form-label text-white j_join_text">Repeat On</label>
                <div className="d-flex B_Repeat_on_btn">
                  <button
                    className={`btn ${selectedDays.includes('Sunday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                    onClick={() => toggleDay('Sunday')}
                  >
                    S
                  </button>
                  <button
                    className={`btn ${selectedDays.includes('Monday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                    onClick={() => toggleDay('Monday')}
                  >
                    M
                  </button>
                  <button
                    className={`btn ${selectedDays.includes('Tuesday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                    onClick={() => toggleDay('Tuesday')}
                  >
                    T
                  </button>
                  <button
                    className={`btn ${selectedDays.includes('Wednesday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                    onClick={() => toggleDay('Wednesday')}
                  >
                    W
                  </button>
                  <button
                    className={`btn ${selectedDays.includes('Thursday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                    onClick={() => toggleDay('Thursday')}
                  >
                    T
                  </button>
                  <button
                    className={`btn ${selectedDays.includes('Friday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                    onClick={() => toggleDay('Friday')}
                  >
                    F
                  </button>
                  <button
                    className={`btn ${selectedDays.includes('Saturday') ? 'j_day_selected_btn' : 'j_day_btn'} me-1`}
                    onClick={() => toggleDay('Saturday')}
                  >
                    S
                  </button>
                </div>
              </div>
            )}

            {repeatType === '3' && (
              <div className="mb-3">
                <label className="text-white j_join_text">Every</label>
                <select
                  className="form-select j_select j_join_text"
                >
                  <option value="0">Select</option>
                  <option value="1">Monthly on first monday</option>
                  <option value="2">Monthly on first day</option>
                </select>
              </div>
            )}

            <div className="j_schedule_Repeat">
              <div className="mb-3 flex-fill me-2  j_select_fill">
                <label htmlFor="RepeatType1" className="form-label text-white j_join_text">Ends</label>
                <select
                  className="form-select j_select j_join_text"
                  id="RepeatType1"
                  value={endsSelection}
                  onChange={(e) => setEndsSelection(e.target.value)}
                >
                  <option value="0">Select</option>
                  <option value="1">Never</option>
                  {repeatType !== '1' && <option value="2">On</option>}
                  <option value="3">After</option>
                </select>
              </div>

              {(endsSelection == "0" || endsSelection == "2") && (
                <div className="mb-3 flex-fill  j_select_fill">
                  <label htmlFor="RepeatType1" className="form-label text-white j_join_text"></label>
                  <input type="date" className="form-control j_input j_join_text j_special_m" id="RepeatEvery1" />
                </div>
              )}

              {endsSelection == "3" && (
                <div className="mb-3 flex-fill j_select_fill J_Fill_bottom">
                  <label className="form-label text-white j_join_text"></label>
                  <div className='position-relative'>
                    <input
                      type="text"
                      className="form-control j_input j_join_text j_special_m"
                      value={`${RepeatEvery1} Recurrence`}
                      readOnly
                    />
                    <div className="j_custom_icons">
                      <FaAngleUp
                        style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                        onClick={handleIncrement1}
                      />
                      <FaAngleDown
                        style={{ color: 'white', fontSize: '12px', cursor: 'pointer' }}
                        onClick={handleDecrement1}
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
                onClick={handleScheduleshow}
              >
                Done
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal> */}
      </section >
    </div>
  )
}

export default Schedule;