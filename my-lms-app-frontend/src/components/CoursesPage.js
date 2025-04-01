import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import courses from '../data/courses';
import '../styles/CoursesPage.css';

// CourseItem Component
const CourseItem = ({ course, onEnroll }) => {
    const [showDescription, setShowDescription] = useState(false);

    return (
        <div 
            className="course-item"
            onMouseEnter={() => setShowDescription(true)}
            onMouseLeave={() => setShowDescription(false)}
        >
            <img src={course.image} alt={course.name} className="course-image" />
            <h3>{course.name}</h3>
            <p>Instructor: {course.instructor}</p>
            {showDescription && (
                <div className="course-description">
                    <p>{course.description}</p>
                </div>
            )}
            <button onClick={() => onEnroll(course)} className="enroll-button">
                Enroll Now
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
const EnrollmentList = ({ onEnrollmentChange }) => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        const savedCourses = localStorage.getItem('enrolledCourses');
        if (savedCourses) {
            setEnrolledCourses(JSON.parse(savedCourses));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        if (onEnrollmentChange) {
            onEnrollmentChange(enrolledCourses);
        }
    }, [enrolledCourses, onEnrollmentChange]);

    useEffect(() => {
        const handleAddCourse = (event) => {
            const course = event.detail;
            setEnrolledCourses(prev => [...prev, course]);
        };

        const element = document.querySelector('.enrollment-list');
        if (element) {
            element.addEventListener('addCourse', handleAddCourse);
            return () => element.removeEventListener('addCourse', handleAddCourse);
        }
    }, []);

    const handleDrop = (courseId) => {
        setEnrolledCourses(prevCourses => 
            prevCourses.filter(course => course.id !== courseId)
        );
    };

    const totalCreditHours = enrolledCourses.length * 3;

    return (
        <div className="enrollment-list">
            <h2>Enrolled Courses</h2>
            {enrolledCourses.map(course => (
                <EnrolledCourse 
                    key={course.id} 
                    course={course} 
                    onDrop={handleDrop}
                />
            ))}
            <div className="total-credits">
                <h3>Total Credit Hours: {totalCreditHours}</h3>
            </div>
        </div>
    );
};

// CourseCatalog Component
const CourseCatalog = ({ enrolledCourses, onEnroll }) => {
    const handleEnroll = (course) => {
        if (!enrolledCourses.some(c => c.id === course.id)) {
            onEnroll(course);
        }
    };

    return (
        <div className="course-catalog">
            <h2>Available Courses</h2>
            <div className="courses-grid">
                {courses.map(course => (
                    <CourseItem 
                        key={course.id} 
                        course={course}
                        onEnroll={handleEnroll}
                    />
                ))}
            </div>
        </div>
    );
};

// Main CoursesPage Component
const CoursesPage = () => {
    const [currentEnrollments, setCurrentEnrollments] = useState([]);

    const handleEnroll = (course) => {
        const enrollmentListElement = document.querySelector('.enrollment-list');
        if (enrollmentListElement) {
            const event = new CustomEvent('addCourse', { detail: course });
            enrollmentListElement.dispatchEvent(event);
        }
    };

    return (
        <div className="courses-page">
            <Header />
            <div className="content">
                <CourseCatalog 
                    enrolledCourses={currentEnrollments}
                    onEnroll={handleEnroll}
                />
                <EnrollmentList 
                    onEnrollmentChange={setCurrentEnrollments}
                />
            </div>
            <Footer />
        </div>
    );
};

export default CoursesPage;