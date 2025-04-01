import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import courses from '../data/courses.js';
import testimonials from '../data/testimonials.js';
import '../styles/Homepage.css';

function Homepage() {
  const getRandomIndices = (max, count) => {
    const indices = new Set();
    while(indices.size < count) {
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

  const [randomTestimonials, setRandomTestimonials] = useState([]);

  useEffect(() => {
    const indices = getRandomIndices(testimonials.length, 2);
    const selected = indices.map(index => testimonials[index]);
    setRandomTestimonials(selected);
  }, []);

  return (
    <div>
      <Header />
        <main className="main-section">
            <h2>
                About LMS
            </h2>
            <p>
                The Learning Management System (LMS) helps students and instructors manage courses, quizzes, and track performance efficiently.
            </p>
            <p className="listTitle">
                Key Features:
            </p>
            <ul>
                <li>Enroll in courses</li>
                <li>Attempt quizzes</li>
                <li>View leaderboards</li>
            </ul>
            <h2>
                Courses
            </h2>
            <div className="course-list">
                {getRandomIndices(10, 3).map(index => {
                    const course = courses[index];
                    return (
                        <div className="course-card" key={course.id}>
                            <img src={course.image} alt={course.name} />
                            <h3>{course.name}</h3>
                            <p>{course.description}</p>
                        </div>
                    );
                })}
            </div>
            <div className="testimonials">
                <h2>
                    Testimonials
                </h2>
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

