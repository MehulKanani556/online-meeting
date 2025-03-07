import React, { useState, useEffect } from 'react'
import home from '../Image/j_home.svg'
import meeting from '../Image/j_meeting.svg'
import Schedule from '../Image/j_Schedule.svg'
import setting from '../Image/j_setting.svg'
import { useNavigate, useLocation } from 'react-router-dom'

function SideBar() {
    const location = useLocation()
    const navigate = useNavigate()

    const getActiveItem = (pathname) => {
        switch(pathname) {
            case '/':
                return 'Home'
            case '/meeting':
                return 'Meeting'
            case '/schedule':
                return 'Schedule'
            case '/setting':
                return 'Setting'
            default:
                return 'Home'
        }
    }

    const [activeItem, setActiveItem] = useState(getActiveItem(location.pathname))

    const handleNavigation = (item) => {
        setActiveItem(item)
        switch(item) {
            case 'Home':
                navigate('/home')
                break
            case 'Meeting':
                navigate('/meeting')
                break
            case 'Schedule':
                navigate('/schedule')
                break
            case 'Setting':
                navigate('/setting')
                break
            default:
                navigate('/')
        }
    }

    useEffect(() => {
        setActiveItem(getActiveItem(location.pathname))
    }, [location])

    return (
        <div className="j_Home_sidebar">
            <ul>
                {['Home', 'Meeting', 'Schedule', 'Setting'].map(item => (
                    <li
                        key={item}
                    >
                        <a className='j_sidebar_a text-decoration-none text-white'
                            onClick={() => handleNavigation(item)}
                            style={{
                                opacity: activeItem === item ? 1 : 0.5,
                                borderLeft: activeItem === item ? '4px solid #fff' : 'none',
                                cursor: 'pointer'
                            }}
                        >
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