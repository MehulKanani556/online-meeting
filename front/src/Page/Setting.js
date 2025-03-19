import React, { useState } from 'react'
import HomeNavBar from '../Component/HomeNavBar'
import SideBar from '../Component/SideBar'

function Setting() {
    const [settingformat, setsettingformat] = useState('general')
    return (
        <div>
            <HomeNavBar />
            <section className='j_index_main' style={{ backgroundColor: "#060A11" }}>
                <div className="row">
                    <div className="col-1 p-0 j_sidebar_width">
                        <SideBar />
                    </div>
                    <div className="col-11 p-0 j_contant_width">
                        <section className="j_setting">
                            <div className='d-flex justify-content-center'>
                                <div className='d-flex' style={{ backgroundColor: '#101924', padding: '4px', borderRadius: '8px' }}>
                                    <button
                                        type="button"
                                        className="j_setting_button border-0 rounded"
                                        style={{
                                            backgroundColor: settingformat === 'general' ? '#2A323B' : 'transparent',
                                            color: settingformat === 'general' ? '#ffffff' : '#87898B'
                                        }}
                                        onClick={() => setsettingformat('general')}
                                    >
                                        General
                                    </button>
                                    <button
                                        type="button"
                                        className="j_setting_button border-0 rounded"
                                        style={{
                                            backgroundColor: settingformat === 'meeting' ? '#2A323B' : 'transparent',
                                            color: settingformat === 'meeting' ? '#ffffff' : '#87898B'
                                        }}
                                        onClick={() => setsettingformat('meeting')}
                                    >
                                        Meeting
                                    </button>
                                    <button
                                        type="button"
                                        className="j_setting_button border-0 rounded"
                                        style={{
                                            backgroundColor: settingformat === 'recording' ? '#2A323B' : 'transparent',
                                            color: settingformat === 'recording' ? '#ffffff' : '#87898B'
                                        }}
                                        onClick={() => setsettingformat('recording')}
                                    >
                                        Recording
                                    </button>
                                </div>
                            </div>
                            {settingformat === 'general' && (
                                <div className="j_general_settings">
                                    <h5 className='text-white j_margin_setting pt-3 pb-2'>Use original audio</h5>
                                    <p className='d-flex align-items-center'>
                                        <input type="checkbox" className='form-check-input j_setting_check' defaultChecked />
                                        <label className='ms-2 '>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting py-2'>Add to Google Calendar</h5>
                                    <p className='d-flex align-items-center'>
                                        <input type="checkbox" className='form-check-input j_setting_check' />
                                        <label className='ms-2'>
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's stan
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting py-2'>Chat notification</h5>
                                    <p className='d-flex align-items-center'>
                                        <input type="checkbox" className='form-check-input j_setting_check' />
                                        <label className='ms-2'>
                                            Display a chat and play a sound whenever a new chat arrives.
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting py-2'>Join notification</h5>
                                    <p className='d-flex align-items-center'>
                                        <input type="checkbox" className='form-check-input j_setting_check' defaultChecked />
                                        <label className='ms-2'>
                                            Play a sound notification when a participants joined or leave the meeting.
                                        </label>
                                    </p>
                                </div>
                            )}
                            {settingformat === 'meeting' && (
                                <div className="j_general_settings">
                                    <h5 className='text-white j_margin_setting py-2'>Allow participants to join before the host</h5>
                                    <p className='d-flex align-items-center'>
                                        <input type="checkbox" className='form-check-input j_setting_check' defaultChecked />
                                        <label className='ms-2 '>
                                            Enable the participant to join a meeting without for the host.
                                            Note: Participants can enter the meeting without the host, starting from the host, starting from one hour before the schedule time
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting pt-3'>Display a participants name on their video</h5>
                                    <p className='d-flex align-items-center'>
                                        <input type="checkbox" className='form-check-input j_setting_check' />
                                        <label className='ms-2'>
                                            Enable the participant to join a meeting without for the host.
                                            Note: Participants can enter the meeting without the host, starting from the host, starting from one hour before the schedule time
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting pt-3'>View video muted participants</h5>
                                    <p className='d-flex align-items-center'>
                                        <input type="checkbox" className='form-check-input j_setting_check' defaultChecked />
                                        <label className='ms-2'>
                                            Display a user profile picture in the video feed when their video is turned off.
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting pt-3'>All participants to share screen</h5>
                                    <p className='d-flex align-items-center'>
                                        <input type="checkbox" className='form-check-input j_setting_check' />
                                        <label className='ms-2'>
                                            Allow all participants to share their screen.
                                        </label>
                                    </p>
                                </div>
                            )}
                            {settingformat === 'recording' && (
                                <div className="j_general_settings">
                                    <h5 className='text-white j_margin_setting pt-3'>Auto record meeting</h5>
                                    <p className='d-flex align-items-center'>
                                        <input type="checkbox" className='form-check-input j_setting_check' defaultChecked />
                                        <label className='ms-2 '>
                                            Enable automatic recording all meetings you created
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting pt-3'>Recording layout for meeting</h5>
                                    <select class="form-select j_select" aria-label="Default select example">
                                        <option value="0">Select</option>
                                        <option value="1">All video feed with shared screen</option>
                                        <option value="2">Active speaker with shared screen</option>
                                    </select>
                                </div>
                            )}

                        </section>
                    </div>
                </div>
            </section >
        </div>
    )
}

export default Setting;