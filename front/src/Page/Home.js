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
import { getAllUsers, getUserById } from '../Redux/Slice/user.slice';
import { IMAGE_URL } from '../Utils/baseUrl';

function Home() {
  const dispatch = useDispatch()
  const [activeItem, setActiveItem] = useState('')
  const [RepeatEvery, setRepeatEvery] = useState(1)
  const [RepeatEvery1, setRepeatEvery1] = useState(1)
  const [selectedDays, setSelectedDays] = useState([]);
  const [repeatType, setRepeatType] = useState('0');
  const [endsSelection, setEndsSelection] = useState("0");
  const [ScheduleModal, setScheduleModal] = useState(false)
  const [customModal, setcustomModal] = useState(false)
  const [joinModal, setjoinModal] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleScheduleclose = () => setScheduleModal(false)
  const handleScheduleshow = () => setScheduleModal(true)
  const handlecustomclose = () => setcustomModal(false)
  const handlecustomshow = () => setcustomModal(true)
  const handlejoinclose = () => setjoinModal(false)
  const handlejoinshow = () => setjoinModal(true)

  const IMG_URL = IMAGE_URL
  const userId = sessionStorage.getItem('userId')
  const allusers = useSelector((state) => state.user.allusers);
  const allschedule = useSelector((state) => state.schedule.allschedule);
  console.log(allschedule);

  useEffect(() => {
    dispatch(getAllschedule())
    dispatch(getAllUsers())
  }, [])

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

  const scheduleSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),

    date: Yup.date()
      .required('Date is required'),

    startTime: Yup.string()
      .required('Start time is required'),

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
      .oneOf(['DoesNotRepeat', 'daily', 'weekly', 'monthly', 'custom'], 'Please select a valid recurring option')
      .required('Please select recurring meeting option'),

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
            .min(Yup.ref('date'), 'End date must be after start date')
        })
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

  return (
    <div>
      <HomeNavBar />
      <section className='j_index_main' style={{ backgroundColor: "#060A11" }}>
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
                  onClick={() => setActiveItem('New Meeting')}
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
                  onClick={() => { setActiveItem('Join Meeting'); handlejoinshow() }}
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
                title: '',
                date: '',
                startTime: '',
                endTime: '',
                meetingLink: '',
                description: '',
                reminder: [],
                recurringMeeting: '',
                customRecurrence: {
                  repeatType: '',
                  repeatEvery: 1,
                  repeatOn: [],
                  ends: '',
                  endDate: ''
                },
                invitees: []
              }}
              validationSchema={scheduleSchema}
              onSubmit={(values, { resetForm }) => {
                dispatch(createschedule(values)).then((response) => {
                  if (response.payload?._id) {
                    resetForm();
                    handleScheduleclose();
                  }
                });
              }}
            >
              {({ values, errors, touched, handleSubmit, handleChange, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-6 col-md-8 ps-0 j_schedule_border">
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
                          />
                          {touched.date && errors.date && <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.date}</div>}
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
                              handleScheduleclose();
                              handlecustomshow();
                            }
                          }}
                        >
                          <option value="">select</option>
                          <option value="DoesNotRepeat">Does not repeat</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly on Monday</option>
                          <option value="monthly">Monthly on 3 February</option>
                          <option value="custom">Custom</option>
                        </select>
                        {touched.recurringMeeting && errors.recurringMeeting &&
                          <div style={{ color: '#cd1425', fontSize: '14px' }}>{errors.recurringMeeting}</div>}
                      </div>

                      <div className="modal-footer j_schedule_footer border-0 p-0 pt-4 pb-3">
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

                    <div className="col-6 col-md-4 pe-0">
                      <div className="mb-3 pt-3">
                        <p className='mb-0 text-white'>
                          {/* Invitees (0) */}
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
                            className="position-absolute mt-1"
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
                                            backgroundColor: '#364758',
                                            color: 'white'
                                          }}
                                        >
                                          {user.name.charAt(0).toUpperCase()}
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
                                          backgroundColor: '#364758',
                                          color: 'white'
                                        }}
                                      >
                                        {user.name.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                  <div className="ms-2">
                                    <span className="text-white" style={{ fontSize: '14px' }}>{user.email}</span>
                                    <p className="mb-0" style={{ fontSize: '13px', color: '#BFBFBF' }}>Host</p>
                                  </div>
                                </div>
                              ))}

                            {values.invitees.map((invitee, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="me-2">
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
                                  <div className="ms-2">
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
                </form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>

        {/* ============================ Schedule Meeting custom Modal ============================  */}
        <Modal
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
            <form>
              <div className="mb-3">
                <label htmlFor="meetingTitle" className="form-label text-white j_join_text">Meeting ID or Personal Link</label>
                <input type="text" className="form-control j_input" id="meetingTitle" placeholder="Enter meeting ID " />
              </div>
              <div className="mb-3">
                <label htmlFor="meetingTitle" className="form-label text-white j_join_text">Password</label>
                <input type="text" className="form-control j_input" id="meetingTitle" placeholder="Enter password " />
              </div>
              <div className="mb-3">
                <label htmlFor="meetingTitle" className="form-label text-white j_join_text">Name</label>
                <input type="text" className="form-control j_input" id="meetingTitle" placeholder="Enter Name " />
              </div>
              {/* <div className="modal-footer border-0 justify-content-between p-0 pt-4">
                <button type="button" className="btn btn-outline-light j_join_button m-0" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-light j_join_button m-0">Join</button>
              </div> */}
            </form>
            <Modal.Footer className="border-0 p-0 pt-4 justify-content-center">
              <Button
                variant="outline-light"
                className="btn btn-outline-light j_join_button m-1"
                onClick={handlejoinclose}
              >
                Cancel
              </Button>
              <Button
                variant="light"
                className="btn btn-light j_join_button m-1"
              >
                Join
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>

      </section >
    </div >
  )
}

export default Home