import React from 'react'
import SideBar from '../Component/SideBar'
import HomeNavBar from '../Component/HomeNavBar'

function Schedule() {
    return (
        <div>
            <HomeNavBar />
            <section className='j_index_main' style={{ backgroundColor: "#060A11" }}>
                <div className="row">
                    <div className="col-1 p-0 j_sidebar_width">
                        <SideBar />
                    </div>
                    <div className="col-11 p-0 j_contant_width">
                    </div>
                </div>
            </section >
        </div>
    )
}

export default Schedule;