import React from 'react'
import SideBar from '../Component/SideBar'
import HomeNavBar from '../Component/HomeNavBar'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

const events = [
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

const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    // const label = () => {
    //     const date = moment(toolbar.date);
    //     return (
    //         <span>{date.format('MMMM YYYY')}</span>
    //     );
    // };
    const label = () => {
        const date = moment(toolbar.date);
        switch (toolbar.view) {
            case 'week':
                const weekStart = date.clone().startOf('week').format('DD MMM YYYY');
                const weekEnd = date.clone().endOf('week').format('DD MMM YYYY');
                return <span>{`${weekStart} - ${weekEnd}`}</span>;
            case 'day':
                return <span>{date.format('DD MMMM  YYYY')}</span>;
            // return <span>{date.format('dddd, DD MMMM  YYYY')}</span>;
            default:
                return <span>{date.format('MMMM YYYY')}</span>;
        }
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
                <span className="rbc-toolbar-label" style={{ fontWeight: 'bold' }}>
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
        </div>
    );
};


function Schedule() {
    return (
        <div>
            <HomeNavBar />
            <section className='j_index_main' style={{ backgroundColor: "#060A11" }}>
                <div className="row">
                    <div className="col-1 p-0 j_sidebar_width">
                        <SideBar />
                    </div>
                    <div className="col-11 p-0">
                        <div className='j_calender'>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '100%', width: '100%' }}
                                views={['month', 'week', 'day']}
                                defaultView="month"
                                components={{
                                    toolbar: CustomToolbar
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section >
        </div>
    )
}

export default Schedule;