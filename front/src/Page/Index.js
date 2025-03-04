import React, { useState } from 'react'
import HomeNavBar from '../Component/HomeNavBar'
import SideBar from '../Component/SideBar'
import Schedule from '../Image/j_Schedule.svg'
import meeting from '../Image/j_meeting.svg'
import plus from '../Image/j_plus.svg'

function Index() {
    const [activeItem, setActiveItem] = useState('New Meeting')

    return (
        <div>
            <HomeNavBar />
            <section className='j_index_main' style={{ backgroundColor: "#060A11" }}>
                <div className="row">
                    <div className="col-1 p-0">
                        <SideBar />
                    </div>
                    <div className="col-11 p-0 d-flex justify-content-center align-items-center">
                        <div className="j_home_connent">
                            <h4 className='text-white text-center j_home_connent_h4'>Welcome to effortless communication - <br /> Let’s Connect!</h4>
                            <div className="row">
                                {['New Meeting', 'Schedule Meeting', 'join Meeting'].map(item => (
                                    <div className="col-4">
                                        <div className="j_home_cards">
                                            <a className='j_sidebar_a text-decoration-none text-white'
                                                onClick={() => setActiveItem(item)}
                                                style={{
                                                    opacity: activeItem === item ? 1 : 0.5,
                                                    border: activeItem === item ? '4px solid #fff' : 'none',
                                                }}
                                                href="#">
                                                <img
                                                    src={item === 'New Meeting' ? meeting : item === 'Schedule Meeting' ? Schedule : plus}
                                                    alt={item.toLowerCase()}
                                                    style={{ height: '28px', width: '28px' }}
                                                />
                                                {item}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
}

export default Index