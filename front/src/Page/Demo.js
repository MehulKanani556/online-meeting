import React, { useState, useEffect } from 'react';

// Import your image assets
import onmicrophone from '../Image/d_onmicrophone.svg';
import offmicrophone from '../Image/d_offmicrophone.svg';
import oncamera from '../Image/d_oncamera.svg';
import offcamera from '../Image/d_offcamera.svg';
import hand from '../Image/d_hand.svg';

const Demo = () => {
    // State for managing visible participants
    const [maxVisibleParticipants, setMaxVisibleParticipants] = useState(9);
    const [showAllParticipants, setShowAllParticipants] = useState(false);
    const [isVerticalLayout, setIsVerticalLayout] = useState(false);

    const [participants, setParticipants] = useState([
        { id: 1, name: 'Johan Kumar', initials: 'JK', hasVideo: false, hasAudio: true },
        { id: 2, name: 'Lisa Nihar', initials: 'LN', hasVideo: false, hasAudio: false },
        { id: 3, name: 'Kiara Patel', initials: 'KP', hasVideo: false, hasAudio: true },
        { id: 4, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 5, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 6, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 7, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 8, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 9, name: 'Liza Patel', initials: 'LP', hasVideo: false, hasAudio: true },
        { id: 10, name: 'Liza Patel', initials: 'LP', hasVideo: true, hasAudio: true },
        // You can add more participants as needed
    ]);

    const [orientation, setOrientation] = useState({
        isPortrait: window.innerHeight > window.innerWidth,
        width: window.innerWidth,
        height: window.innerHeight
    });


    // Handle responsive grid size and orientation
    useEffect(() => {
        const handleResize = () => {
            // Check if the screen is in portrait or landscape orientation
            const isPortrait = window.innerHeight > window.innerWidth;
            setIsVerticalLayout(isPortrait);

            // Set visible participants based on screen size
            if (window.innerWidth <= 576) {
                setMaxVisibleParticipants(4);
            } else if (window.innerWidth <= 992) {
                setMaxVisibleParticipants(isPortrait ? 6 : 6);
            } else {
                setMaxVisibleParticipants(9);
            }
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get visible participants
    const visibleParticipants = participants.slice(0, maxVisibleParticipants);
    const extraParticipants = participants.length > maxVisibleParticipants ?
        participants.length - maxVisibleParticipants : 0;

    // Toggle participants list
    const toggleParticipantsList = () => {
        setShowAllParticipants(!showAllParticipants);
    };

    return (
        <>
            <div className={`participants-grid ${isVerticalLayout ? 'vertical-layout' : 'horizontal-layout'}`}>
                {visibleParticipants.map((participant, index) => (
                    <div key={participant.id} className="grid-item">


                            // Avatar display
                        <div className="avatar-container">
                            {participant.hasVideo ? (
                                <div className="video-container">
                                    <video
                                        alt={participant.name}
                                        className="video-element"
                                    />
                                    <div className="video-overlay">
                                        <span className="participant-name">{participant.name}</span>
                                        <div className="mic-status">
                                            {participant.hasAudio ? (
                                                <i className="bi bi-mic-fill"></i>
                                            ) : (
                                                <i className="bi bi-mic-mute-fill"></i>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="avatar-circle"
                                    style={{
                                        backgroundColor: `hsl(${participant.id * 60}, 70%, 45%)`
                                    }}
                                >
                                    {participant.initials}
                                </div>
                            )}

                            <div className="controls-top">
                                <div className="controls-container">
                                    <img src={hand} className="control-icon" alt="Raise hand" />
                                    {participant.hasAudio ? (
                                        <img src={offcamera} className="control-icon" alt="Camera off" />
                                    ) : (
                                        <img src={oncamera} className="control-icon" alt="Camera on" />
                                    )}
                                </div>
                            </div>
                            <div className="controls-bottom">
                                <span className="participant-name">{participant.name}</span>
                                <div className="mic-status">
                                    {participant.hasAudio ? (
                                        <img src={offmicrophone} className="control-icon" alt="Microphone off" />
                                    ) : (
                                        <img src={onmicrophone} className="control-icon" alt="Microphone on" />
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Display extra participants indicator */}
                        {index === maxVisibleParticipants - 1 && extraParticipants > 0 && (
                            <div
                                onClick={toggleParticipantsList}
                                className="extra-participants"
                            >
                                <span>+{extraParticipants} others</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal for showing all participants */}
            {showAllParticipants && (
                <div className="participants-modal-overlay" onClick={toggleParticipantsList}>
                    <div className="participants-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5>All Participants</h5>
                            <button className="close-button" onClick={toggleParticipantsList}>×</button>
                        </div>
                        <div className="modal-body">
                            {participants.map((participant) => (
                                <div key={participant.id} className="participant-item">
                                    <div
                                        className="participant-avatar"
                                        style={{
                                            backgroundColor: `hsl(${participant.id * 60}, 70%, 45%)`
                                        }}
                                    >
                                        {participant.initials}
                                    </div>
                                    <div className="participant-info">
                                        <span>{participant.name}</span>
                                    </div>
                                    <div className="participant-status">
                                        {participant.hasAudio ? (
                                            <img src={offmicrophone} className="status-icon" alt="Microphone off" />
                                        ) : (
                                            <img src={onmicrophone} className="status-icon" alt="Microphone on" />
                                        )}
                                        {participant.hasVideo ? (
                                            <img src={oncamera} className="status-icon" alt="Camera on" />
                                        ) : (
                                            <img src={offcamera} className="status-icon" alt="Camera off" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Demo;