import React, { useState } from 'react'
import home from '../Image/j_home.svg'
import meeting from '../Image/j_meeting.svg'
import Schedule from '../Image/j_Schedule.svg'
import setting from '../Image/j_setting.svg'

function SideBar() {
    const [activeItem, setActiveItem] = useState('Home')

    return (
        <div className="j_Home_sidebar">
            <ul>
                {['Home', 'Meeting', 'Schedule', 'Setting'].map(item => (
                    <li
                        key={item}
                    >
                        <a className='j_sidebar_a text-decoration-none text-white'
                            onClick={() => setActiveItem(item)}
                            style={{
                                opacity: activeItem === item ? 1 : 0.5,
                                borderLeft: activeItem === item ? '4px solid #fff' : 'none',
                            }}
                            href="#">
                            <img
                                src={item === 'Home' ? home : item === 'Meeting' ? meeting : item === 'Schedule' ? Schedule : setting}
                                alt={item.toLowerCase()}
                            />
                            {item}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SideBar