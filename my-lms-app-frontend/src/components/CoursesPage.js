import React, { useState, useEffect, useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/CoursesPage.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// CourseItem Component
const CourseItem = ({ course, onEnroll, isAuthenticated }) => {
    const [showDescription, setShowDescription] = useState(false);
    
    // Import images dynamically
    const getImagePath = (imageName) => {
        try {
            // Try to get the image from the images folder
            return require(`../images/${imageName}.jpg`);
        } catch (error) {
            // Fallback to a default image if the specific one is not found
            return require('../images/course1.jpg');
        }
    };

    return (
        <div 
            className="course-item"
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
        >
            <img 
                src={getImagePath(course.image)} 
                alt={course.name} 
                className="course-image" 
            />
            <h3>{course.name}</h3>
            <p>Instructor: {course.instructor}</p>
            {showDescription && (
                <div className="course-description">
                    <p>{course.description}</p>
                </div>
            )}
            <button 
                onClick={() => onEnroll(course)} 
                className="enroll-button"
                disabled={!isAuthenticated}
            >
                {isAuthenticated ? "Enroll Now" : "Login to Enroll"}
            </button>
        </div>
    );
};

// EnrolledCourse Component
const EnrolledCourse = ({ course, onDrop }) => {
    const [enrollmentCount, setEnrollmentCount] = useState(1);

    const handleDrop = () => {
        const newCount = enrollmentCount - 1;
        if (newCount === 0) {
            onDrop(course.id);
        } else {
            setEnrollmentCount(newCount);
        }
    };

    return (
        <div className="enrolled-course">
            <h4>{course.name}</h4>
            <p>Credit Hours: 3</p>
            <p>Enrollment Count: {enrollmentCount}</p>
            <button onClick={handleDrop} className="drop-button">
                Drop Course
            </button>
        </div>
    );
};

// EnrollmentList Component
const EnrollmentList = ({ onEnrollmentChange, username, refreshTrigger }) => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEnrolledCourses = async () => {
        if (!username) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:5000/student_courses/${username}`);
            if (!response.ok) {
                throw new Error('Failed to fetch enrolled courses');
            }
            const data = await response.json();
            setEnrolledCourses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrolledCourses();
    }, [username, refreshTrigger]);

    useEffect(() => {
        if (onEnrollmentChange) {
            onEnrollmentChange(enrolledCourses);
        }
    }, [enrolledCourses, onEnrollmentChange]);

    const handleDrop = async (courseId) => {
        if (!username) return;
        
        try {
            const response = await fetch(`http://127.0.0.1:5000/drop/${username}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ course_id: courseId })
            });
            
            if (!response.ok) {
                throw new Error('Failed to drop course');
            }
            
            // Refresh the enrolled courses list after dropping
            fetchEnrolledCourses();
        } catch (err) {
            console.error('Error dropping course:', err);
            alert('Failed to drop course. Please try again.');
        }
    };

    const totalCreditHours = enrolledCourses.length * 3;

    if (loading) return <div>Loading enrolled courses...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="enrollment-list">
            <h2>Enrolled Courses</h2>
            {enrolledCourses.length === 0 ? (
                <p>You are not enrolled in any courses.</p>
            ) : (
                enrolledCourses.map(course => (
                    <EnrolledCourse 
                        key={course.id} 
                        course={course} 
                        onDrop={handleDrop}
                    />
                ))
            )}
            <div className="total-credits">
                <h3>Total Credit Hours: {totalCreditHours}</h3>
            </div>
        </div>
    );
};

// CourseCatalog Component
const CourseCatalog = ({ enrolledCourses, onEnroll, isAuthenticated, username, refreshEnrollments }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch courses from backend API
        fetch('http://127.0.0.1:5000/courses')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                return response.json();
            })
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleEnroll = async (course) => {
        if (!isAuthenticated || !username) {
            return;
        }
        
        if (!enrolledCourses.some(c => c.id === course.id)) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/enroll/${username}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ course_id: course.id })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to enroll in course');
                }
                
                // Call the onEnroll callback to update the UI
                onEnroll(course);
                
                // Trigger a refresh of the enrolled courses list
                refreshEnrollments();
            } catch (err) {
                console.error('Error enrolling in course:', err);
                alert('Failed to enroll in course. Please try again.');
            }
        }
    };

    if (loading) return <div>Loading courses...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="course-catalog">
            <h2>Available Courses</h2>
            <div className="courses-grid">
                {courses.map(course => (
                    <CourseItem 
                        key={course.id} 
                        course={course}
                        onEnroll={handleEnroll}
                        isAuthenticated={isAuthenticated}
                    />
                ))}
            </div>
        </div>
    );
};

// Main CoursesPage Component
const CoursesPage = () => {
    const [currentEnrollments, setCurrentEnrollments] = useState([]);
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleEnroll = (course) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        setCurrentEnrollments(prev => [...prev, course]);
    };

    const refreshEnrollments = () => {
        // Increment the refresh trigger to cause a re-fetch
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="courses-page">
            <Header />
            <div className="content">
                <CourseCatalog 
                    enrolledCourses={currentEnrollments}
                    onEnroll={handleEnroll}
                    isAuthenticated={isAuthenticated}
                    username={user?.username}
                    refreshEnrollments={refreshEnrollments}
                />
                <EnrollmentList 
                    onEnrollmentChange={setCurrentEnrollments}
                    username={user?.username}
                    refreshTrigger={refreshTrigger}
                />
            </div>
            <Footer />
        </div>
    );
};

export default CoursesPage;