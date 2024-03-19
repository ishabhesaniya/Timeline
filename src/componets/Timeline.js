import React, { useState, useEffect } from 'react';
import './Timeline.css'; // Import the CSS file

const TimelineApp = () => {
    const [updateIndex, setUpdateIndex] = useState(null);
    const [timelineData, setTimelineData] = useState([]);
    const [year, setYear] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cardImage, setCardImage] = useState('');
    const [displayImage, setDisplayImage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('timelineData')) || [];
        setTimelineData(data);
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCardImage(reader.result);
                setDisplayImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleYearChange = (e) => {
        const value = e.target.value;
        // Validate that the value is a digit and not more than 4 characters
        if (/^\d{0,4}$/.test(value)) {
            setYear(value);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setYear('');
        setTitle('');
        setDescription('');
        setUpdateIndex(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        let updatedData;
    
        if (updateIndex !== null) {
            updatedData = [...timelineData];
            updatedData[updateIndex] = { year, title, description, cardImage, created_at: new Date().toISOString() };
        } else {
            updatedData = [...timelineData, { year, title, description, cardImage, created_at: new Date().toISOString() }];
        }
    
        try {
            localStorage.setItem('timelineData', JSON.stringify(updatedData));
            setTimelineData(updatedData);
            closeModal();
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                alert('Storage quota exceeded. Please clear some space in your browser storage.');
            } else {
                alert('An error occurred while saving the data.');
            }
        }
    };
    
    
      
    const editTimeline = (index) => {
        const { year, title, description, cardImage } = timelineData[index];
        setYear(year);
        setTitle(title);
        setDescription(description);
        setCardImage(cardImage);
        setUpdateIndex(index);
        openModal();
    };
    
    const removeTimeline = (index) => {
        if (window.confirm('Are you sure you want to delete?')) {
            const updatedData = [...timelineData];
            updatedData.splice(index, 1); // Remove 1 element at the specified index
            setTimelineData(updatedData);
            localStorage.setItem('timelineData', JSON.stringify(updatedData));
        }
    };
    
    

    const randomColor = () => {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return `rgb(${red}, ${green}, ${blue})`;
    };

    // Sort the timelineData array by year
    const sortedTimelineData = timelineData.slice().sort((a, b) => {
        return parseInt(a.year) - parseInt(b.year);
    });

    return (
        <div>
            <h1>Timeline App</h1>
            <button className="add-timeline-btn" onClick={openModal}>Add Timeline</button>
            <div className="form-container" style={{ display: showModal ? 'flex' : 'none' }}>
                <form className="form" onSubmit={handleSubmit}>
                    <i className="fa-solid fa-xmark close-btn" onClick={closeModal}></i>
                    <label htmlFor="image">Image</label>
                    <input type="file" id="image" onChange={handleImageChange} />
                    {selectedImage && <img src={displayImage} alt="Selected" />}
                    <label htmlFor="year">Year</label>
                    <input type="text" id="year" value={year} onChange={handleYearChange} />
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="description">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

                    <button type="submit">Save</button>
                </form>
            </div>

            <div className='main'>
                {sortedTimelineData.map((data, index) => {
                    const eventColor = randomColor();
                    return (
                        <div className="event" key={index}>
                            {data.cardImage && <img src={data.cardImage} alt="Event" className="event-img" />}
                            <div className="year" style={{ backgroundColor: eventColor }}>
                                <div className="year-content">{data.year}</div>
                                <div className="edit-remove">
                                    <i className="fa-regular fa-pen-to-square edit-btn" onClick={() => editTimeline(index)}></i>
                                    <i className="fa-regular fa-trash-can remove-btn" onClick={() => removeTimeline(index)}></i>
                                </div>
                            </div>
                            <div className={`hr event-${index}`} style={{ backgroundColor: eventColor }}></div>
                            <div className={`border event-${index}`} style={{ backgroundColor: eventColor }}>
                                <h3 className="title">{data.title}</h3>
                                <div className="details">{data.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TimelineApp;
