import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/Homepage.css';
import course1 from '../images/course1.jpg';

function Homepage() {
    const [courses_data, setCoursesData] = useState([]);
    const [testimonials_data, setTestimonialsData] = useState([]);
    const [randomTestimonials, setRandomTestimonials] = useState([]);

    const getCourses = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/courses');
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    }

    const getTestimonials = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/testimonials');
            if (!response.ok) {
                throw new Error('Failed to fetch testimonials');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            return [];
        }
    }

    const getRandomIndices = (max, count) => {
        if (max === 0) return [];
        const indices = new Set();
        while(indices.size < count && indices.size < max) {
            indices.add(Math.floor(Math.random() * max));
        }
        return Array.from(indices);
    };

    const StarRating = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push('★');
            } else if (i === fullStars && hasHalfStar) {
                stars.push('★');
            } else {
                stars.push('☆');
            }
        }
        
        return <span className="star-rating">{stars.join('')}</span>;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courses, testimonials] = await Promise.all([
                    getCourses(),
                    getTestimonials()
                ]);
                
                setCoursesData(courses);
                setTestimonialsData(testimonials);
                
                if (testimonials.length > 0) {
                    const indices = getRandomIndices(testimonials.length, 2);
                    const selected = indices.map(index => testimonials[index]);
                    setRandomTestimonials(selected);
                }
            } catch (error) {
                console.error('Error in fetchData:', error);
            }
        };
        
        fetchData();
    }, []); // Empty dependency array since we only want to fetch once on mount

    return (
        <div>
            <Header />
            <main className="main-section">
                <h2>About LMS</h2>
                <p>
                    The Learning Management System (LMS) helps students and instructors manage courses, quizzes, and track performance efficiently.
                </p>
                <p className="listTitle">Key Features:</p>
                <ul>
                    <li>Enroll in courses</li>
                    <li>Attempt quizzes</li>
                    <li>View leaderboards</li>
                </ul>
                <h2>Courses</h2>
                <div className="course-list">
                    {getRandomIndices(courses_data.length, 3).map(index => {
                        const course = courses_data[index];
                        return (
                            <div className="course-card" key={course.id}>
                                <img src={course1} alt={`${course.name}`} />
                                <h3>{course.name}</h3>
                                <p>{course.description}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="testimonials">
                    <h2>Testimonials</h2>
                    <div className="testimonial-list">
                        {randomTestimonials.map((testimonial, index) => (
                            <div className="testimonial-card" key={index}>
                                <p className="review">"{testimonial.review}"</p>
                                <p className="student-name">- {testimonial.studentName}</p>
                                <p className="course-name">{testimonial.courseName}</p>
                                <StarRating rating={testimonial.rating} />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Homepage;

