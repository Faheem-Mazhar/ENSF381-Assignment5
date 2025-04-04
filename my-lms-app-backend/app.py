from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
from students import get_students
from students import add_student
from students import get_student
from students import get_student_courses
from students import add_course_to_student
from students import remove_course_from_student

app = Flask(__name__)
CORS(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    add_student(data)
    
    if data['username'] in get_students():
        return jsonify({"message": "User already exists"}), 400
    else:
        return jsonify({"message": "User registered successfully"}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    valid_student = get_student(data['username'], data['password'])
    
    if valid_student:
        return jsonify({"message": "User logged in successfully"}), 200
    else:
        return jsonify({"message": "Invalid username or password"}), 400

@app.route('/enroll/<int:student_id>/<int:course_id>', methods=['POST'])
def enroll():
    data = request.json
    

@app.route('/courses', methods=['GET'])
def get_courses():
    with open('data/courses.json', 'r') as f:
        courses = json.load(f)
    return jsonify(courses['courses']), 200

@app.route('/testimonials', methods=['GET'])
def get_testimonials():
    with open('data/testimonials.json', 'r') as f:
        testimonials = json.load(f)
    return jsonify(testimonials['testimonials']), 200

@app.route('/student_courses/<int:student_id>', methods=['GET'])
def get_student_courses(student_id):
    with open('data/student_courses.json', 'r') as f:
        student_courses = json.load(f)
    return jsonify(student_courses), 200

@app.route('/courses/<int:course_id>', methods=['GET'])
def get_course_details(course_id):
    with open('data/courses.json', 'r') as f:
        courses = json.load(f)
    course_details = next((course for course in courses if course['id'] == course_id), None)
    return jsonify(course_details), 200

@app.route('/drop/<int:student_id>/<int:course_id>', methods=['DELETE'])
def drop_course(student_id, course_id):
    with open('data/student_courses.json', 'r') as f:
        student_courses = json.load(f)
    student_courses = [course for course in student_courses if course['student_id'] != student_id or course['course_id'] != course_id]
    with open('data/student_courses.json', 'w') as f:
        json.dump(student_courses, f)
    return jsonify({"message": "Course dropped successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)