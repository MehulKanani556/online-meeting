import React, { useState } from 'react'
import HomeNavBar from '../Component/HomeNavBar'
import SideBar from '../Component/SideBar'
import Schedule from '../Image/j_Schedule.svg'
import meeting from '../Image/j_meeting.svg'
import plus from '../Image/j_plus.svg'
import { IoClose, IoSearch } from 'react-icons/io5'
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";

function Home() {
  const [activeItem, setActiveItem] = useState('New Meeting')
  const [selectedReminders, setSelectedReminders] = useState([])
  const [RepeatEvery, setRepeatEvery] = useState(1)
  const [selectedDays, setSelectedDays] = useState([]);

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const toggleReminder = (reminder) => {
    setSelectedReminders(prev =>
      prev.includes(reminder)
        ? prev.filter(r => r !== reminder)
        : [...prev, reminder]
    )
  }

  const handleIncrement = () => {
    setRepeatEvery(prev => prev + 1);
  }

  const handleDecrement = () => {
    setRepeatEvery(prev => Math.max(prev - 1, 1));
  }

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
                <div className="j_home_cards" type="button" data-bs-toggle="modal" data-bs-target="#ScheduleMeetingModal"
                  onClick={() => setActiveItem('Schedule Meeting')}
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
                <div className="j_home_cards" type="button" data-bs-toggle="modal" data-bs-target="#joinMeetingModal"
                  onClick={() => setActiveItem('Join Meeting')}
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

        {/* ============================ Schedule Meeting Modal ============================ */}
        <div className="modal fade" id="ScheduleMeetingModal" tabIndex={-1} aria-labelledby="ScheduleMeetingModalLabel" aria-hidden="true">
          <div className="modal-dialog j_Schedule_width modal-lg modal-dialog-centered">
            <div className="modal-content j_modal_schedule">
              <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                <h1 className="modal-title j_join_title text-white" id="ScheduleMeetingModalLabel">Schedule Meeting</h1>
                <IoClose style={{ color: '#fff', fontSize: '22px' }} type="button" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="j_modal_header"></div>
              <div className="modal-body py-0">
                <div className="row">
                  <div className="col-8 ps-0 j_schedule_border">
                    <form>
                      <div className="mb-3 pt-3">
                        <label htmlFor="meetingTitle" className="form-label text-white j_join_text">Title</label>
                        <input type="text" className="form-control j_input j_join_text" id="meetingTitle" placeholder="Enter title for meeting" />
                      </div>
                      <div className="j_schedule_DnT">
                        <div className="mb-3">
                          <label htmlFor="meetingDate" className="form-label text-white j_join_text">Date</label>
                          <input type="date" className="form-control j_input j_join_text" id="meetingDate" />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="startTime" className="form-label text-white j_join_text">Start Time</label>
                          <input type="time" className="form-control j_input j_join_text" id="startTime" />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="endTime" className="form-label text-white j_join_text">End Time</label>
                          <input type="time" className="form-control j_input j_join_text" id="endTime" />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="meetingLink" className="form-label text-white j_join_text">Meeting Link</label>
                        <select className="form-select j_select j_join_text" id="meetingLink">
                          <option value="0">Select</option>
                          <option value="1">Generate a one time meeting link</option>
                          <option value="2">Use my personal room link</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label text-white j_join_text">Description</label>
                        <textarea className="form-control j_input j_join_text" id="description" rows="3" placeholder="Enter a description for meeting"></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-white j_join_text">Reminder</label>
                        <div>
                          <button
                            type="button"
                            className={`btn j_schedule_btn ${selectedReminders.includes('5 min before') ? 'j_schedule_selected_btn' : ''}`}
                            onClick={() => toggleReminder('5 min before')}
                          >
                            5 min before
                          </button>
                          <button
                            type="button"
                            className={`btn j_schedule_btn ${selectedReminders.includes('10 min before') ? 'j_schedule_selected_btn' : ''}`}
                            onClick={() => toggleReminder('10 min before')}
                          >
                            10 min before
                          </button>
                          <button
                            type="button"
                            className={`btn j_schedule_btn ${selectedReminders.includes('15 min before') ? 'j_schedule_selected_btn' : ''}`}
                            onClick={() => toggleReminder('15 min before')}
                          >
                            15 min before
                          </button>
                          <button
                            type="button"
                            className={`btn j_schedule_btn ${selectedReminders.includes('30 min before') ? 'j_schedule_selected_btn' : ''}`}
                            onClick={() => toggleReminder('30 min before')}
                          >
                            30 min before
                          </button>
                          <button
                            type="button"
                            className={`btn j_schedule_btn ${selectedReminders.includes('1 hr before') ? 'j_schedule_selected_btn' : ''}`}
                            onClick={() => toggleReminder('1 hr before')}
                          >
                            1 hr before
                          </button>
                          <button
                            type="button"
                            className={`btn j_schedule_btn ${selectedReminders.includes('2 hr before') ? 'j_schedule_selected_btn' : ''}`}
                            onClick={() => toggleReminder('2 hr before')}
                          >
                            2 hr before
                          </button>
                          <button
                            type="button"
                            className={`btn j_schedule_btn ${selectedReminders.includes('1 day before') ? 'j_schedule_selected_btn' : ''}`}
                            onClick={() => toggleReminder('1 day before')}
                          >
                            1 day before
                          </button>
                          <button
                            type="button"
                            className={`btn j_schedule_btn ${selectedReminders.includes('2 days before') ? 'j_schedule_selected_btn' : ''}`}
                            onClick={() => toggleReminder('2 days before')}
                          >
                            2 days before
                          </button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="recurringMeetings" className="form-label text-white j_join_text">Recurring Meetings</label>
                        <select className="form-select j_select j_join_text" id="recurringMeetings" onChange={(e) => {
                          if (e.target.value === "custom") {
                            const customModal = new window.bootstrap.Modal(document.getElementById('customModal'));
                            customModal.show();
                          }
                        }}>
                          <option value="0">select</option>
                          <option value="1">Does not repeat</option>
                          <option value="2">Daily</option>
                          <option value="3">Weekly on Monday</option>
                          <option value="4">Monthly on 3 February</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div className="modal-footer j_schedule_footer border-0 p-0 pt-4 pb-3">
                        <button type="button" className="btn btn-outline-light j_home_button fw-semibold" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-light j_home_button fw-semibold">Schedule</button>
                      </div>
                    </form>
                  </div>

                  <div className="col-4 pe-0">
                    <div className="mb-3 pt-3">
                      <p className='mb-0 text-white'>Invitees (0)</p>
                      <div className="position-relative mt-1">
                        <IoSearch className=' position-absolute' style={{ top: "50%", transform: "translateY(-50%)", left: "4px", fontSize: "15px", color: "rgba(255, 255, 255, 0.7)" }} />
                        <input
                          type="search"
                          className="form-control text-white j_input ps-4 j_join_text"
                          placeholder="Add people by name or email..."
                          style={{ borderRadius: '5px', border: 'none', backgroundColor: "#202F41" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================ Schedule Meeting custom Modal ============================ */}
        <div className="modal fade" id="customModal" tabIndex={-1} aria-labelledby="customModalLabel" aria-hidden="true" >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content j_modal_join">
              <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                <h1 className="modal-title text-white j_join_title" id="customModalLabel">Custom Recurrence</h1>
                <IoClose style={{ color: '#fff', fontSize: '22px' }} type="button" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="j_modal_header"></div>
              <div className="modal-body">
                <div className="j_schedule_Repeat">
                  <div className="mb-3 flex-fill me-2  j_select_fill">
                    <label htmlFor="RepeatType" className="form-label text-white j_join_text">Repeat Type</label>
                    <select className="form-select j_select j_join_text" id="RepeatType">
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
                      <input type="text" className="form-control j_input j_join_text" id="RepeatEvery" onChange={(e) => setRepeatEvery(Number(e.target.value) || 1)} value={RepeatEvery} />
                      <div className="j_custom_icons">
                        <FaAngleUp style={{ color: 'white', fontSize: '12px' }} onClick={() => handleIncrement()} />
                        <FaAngleDown style={{ color: 'white', fontSize: '12px' }} onClick={() => handleDecrement()} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-white j_join_text">Repeat On</label>
                  <div className="d-flex">
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

                <div className="j_schedule_Repeat">
                  <div className="mb-3 flex-fill me-2  j_select_fill">
                    <label htmlFor="RepeatType" className="form-label text-white j_join_text">Ends</label>
                    <select className="form-select j_select j_join_text" id="RepeatType">
                      <option value="0">Select</option>
                      <option value="1">Never</option>
                      <option value="2">On</option>
                      <option value="3">After</option>
                    </select>
                  </div>
                  <div className="mb-3 flex-fill  j_select_fill">
                    <label htmlFor="RepeatType" className="form-label text-white j_join_text"></label>
                    <input type="date" className="form-control j_input j_join_text j_special_m" id="RepeatEvery" />
                  </div>
                </div>
                <div className="modal-footer j_custom_footer border-0 p-0 pt-4 pb-3">
                  <button type="button" className="btn btn-outline-light j_custom_button fw-semibold" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" className="btn btn-light j_custom_button fw-semibold">Done</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================ join Meeting Modal ============================ */}
        <div className="modal fade" id="joinMeetingModal" tabIndex={-1} aria-labelledby="joinMeetingModalLabel" aria-hidden="true" >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content j_modal_join">
              <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                <h1 className="modal-title text-white j_join_title" id="joinMeetingModalLabel">Join Meeting</h1>
                <IoClose style={{ color: '#fff', fontSize: '22px' }} type="button" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="j_modal_header"></div>
              <div className="modal-body">
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
                  <div className="modal-footer border-0 justify-content-between p-0 pt-4">
                    <button type="button" className="btn btn-outline-light j_join_button m-0" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-light j_join_button m-0">Join</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </section >
    </div >
  )
}

export default Home