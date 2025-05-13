import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import HomeNavBar from '../Component/HomeNavBar'
import SideBar from '../Component/SideBar'
import { updateUser, getUserById } from '../Redux/Slice/user.slice'
import { enqueueSnackbar } from 'notistack';

function Setting() {
    const dispatch = useDispatch()
    const [settingformat, setsettingformat] = useState('general')
    const userId = sessionStorage.getItem("userId")
    const currentUser = useSelector((state) => state.user.currUser);

    useEffect(() => {
        if (userId) {
            dispatch(getUserById(userId))
        }
    }, [dispatch, userId])

    const validationSchema = Yup.object({
        originalaudio: Yup.boolean(),
        GoogleCalendar: Yup.boolean(),
        Chatnotification: Yup.boolean(),
        Joinnotification: Yup.boolean(),
        joinwithouthost: Yup.boolean(),
        participantsNameandVideo: Yup.boolean(),
        videomuted: Yup.boolean(),
        sharescreen: Yup.boolean(),
        Autorecord: Yup.boolean(),
        Recordinglayout: Yup.string().oneOf(['videowithscharescreen', 'activespeakerscreenshare', '0'])
    })

    const formik = useFormik({
        initialValues: {
            originalaudio: currentUser?.originalaudio || false,
            GoogleCalendar: currentUser?.GoogleCalendar || false,
            Chatnotification: currentUser?.Chatnotification || false,
            Joinnotification: currentUser?.Joinnotification || false,
            joinwithouthost: currentUser?.joinwithouthost || false,
            participantsNameandVideo: currentUser?.participantsNameandVideo || false,
            videomuted: currentUser?.videomuted || false,
            sharescreen: currentUser?.sharescreen || false,
            Autorecord: currentUser?.Autorecord || false,
            Recordinglayout: currentUser?.Recordinglayout || '0'
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            dispatch(updateUser({ id: userId, values }))
        }
    })

    // Handle checkbox changes with automatic save
    const handleSettingChange = (fieldName) => {
     

        if (fieldName === 'GoogleCalendar' && !currentUser?.googleRefreshToken) {
            enqueueSnackbar('Google login is required for this feature.', {
                variant: 'warning', autoHideDuration: 3000, anchorOrigin: {
                  vertical: 'top', // Position at the top
                  horizontal: 'right', // Position on the right
                }
              });
              return;       
        }
        const newValue = !formik.values[fieldName]
        console.log("newValue", newValue);
        formik.setFieldValue(fieldName, newValue)
        formik.submitForm() // This will trigger the update API call
    }

    // Handle select change with automatic save
    const handleSelectChange = (e) => {
        formik.setFieldValue('Recordinglayout', e.target.value)
        formik.submitForm()
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
                                        <input
                                            type="checkbox"
                                            className='form-check-input j_setting_check'
                                            checked={formik.values.originalaudio}
                                            onChange={() => handleSettingChange('originalaudio')}
                                        />
                                        <label className='ms-2'>
                                            It only allow original audio. No edited audio will be allowed.
                                        </label>
                                    </p>
                                    {/* {currentUser?.googleRefreshToken && ( */}
                                        <>
                                            <h5 className='text-white j_margin_setting py-2'>Add to Google Calendar</h5>
                                            <p className='d-flex align-items-center'>
                                                <input
                                                    type="checkbox"
                                                    className='form-check-input j_setting_check'
                                                    checked={formik.values.GoogleCalendar}
                                                    onChange={() => handleSettingChange('GoogleCalendar')}
                                                    // disabled={!currentUser?.googleRefreshToken}
                                                />
                                                <label className='ms-2' style={{ opacity: !currentUser?.googleRefreshToken ? '0.5' : '1' }}>
                                                    This feature helps to join meeting in calendar. If meeting is scheduled then automatically
                                                    it get added in the calender as a event.It helps to remember date and time of meeting
                                                    easliy and also provide remainder for meeting.
                                                </label>
                                            </p>
                                        </>
                                    {/* )} */}
                                    <h5 className='text-white j_margin_setting py-2'>Chat notification</h5>
                                    <p className='d-flex align-items-center'>
                                        <input
                                            type="checkbox"
                                            className='form-check-input j_setting_check'
                                            checked={formik.values.Chatnotification}
                                            onChange={() => handleSettingChange('Chatnotification')}
                                        />
                                        <label className='ms-2'>
                                            Display a chat and play a sound whenever a new chat arrives.
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting py-2'>Join notification</h5>
                                    <p className='d-flex align-items-center'>
                                        <input
                                            type="checkbox"
                                            className='form-check-input j_setting_check'
                                            checked={formik.values.Joinnotification}
                                            onChange={() => handleSettingChange('Joinnotification')}
                                        />
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
                                        <input
                                            type="checkbox"
                                            className='form-check-input j_setting_check'
                                            checked={formik.values.joinwithouthost}
                                            onChange={() => handleSettingChange('joinwithouthost')}
                                        />
                                        <label className='ms-2'>
                                            Enable the participant to join a meeting without for the host.
                                            Note: Participants can enter the meeting without the host, starting from the host, starting from one hour before the schedule time
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting pt-3'>Display a participants name on their video</h5>
                                    <p className='d-flex align-items-center'>
                                        <input
                                            type="checkbox"
                                            className='form-check-input j_setting_check'
                                            checked={formik.values.participantsNameandVideo}
                                            onChange={() => handleSettingChange('participantsNameandVideo')}
                                        />
                                        <label className='ms-2'>
                                            Enable the participant to join a meeting without for the host.
                                            Note: Participants can enter the meeting without the host, starting from the host, starting from one hour before the schedule time
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting pt-3'>View video muted participants</h5>
                                    <p className='d-flex align-items-center'>
                                        <input
                                            type="checkbox"
                                            className='form-check-input j_setting_check'
                                            checked={formik.values.videomuted}
                                            onChange={() => handleSettingChange('videomuted')}
                                        />
                                        <label className='ms-2'>
                                            Display a user profile picture in the video feed when their video is turned off.
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting pt-3'>All participants to share screen</h5>
                                    <p className='d-flex align-items-center'>
                                        <input
                                            type="checkbox"
                                            className='form-check-input j_setting_check'
                                            checked={formik.values.sharescreen}
                                            onChange={() => handleSettingChange('sharescreen')}
                                        />
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
                                        <input
                                            type="checkbox"
                                            className='form-check-input j_setting_check'
                                            checked={formik.values.Autorecord}
                                            onChange={() => handleSettingChange('Autorecord')}
                                        />
                                        <label className='ms-2'>
                                            Enable automatic recording all meetings you created
                                        </label>
                                    </p>
                                    <h5 className='text-white j_margin_setting pt-3'>Recording layout for meeting</h5>
                                    <select
                                        className="form-select j_select"
                                        value={formik.values.Recordinglayout}
                                        onChange={handleSelectChange}
                                    >
                                        <option value="0">Select</option>
                                        <option value="videowithscharescreen">All video feed with shared screen</option>
                                        <option value="activespeakerscreenshare">Active speaker with shared screen</option>
                                    </select>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Setting;