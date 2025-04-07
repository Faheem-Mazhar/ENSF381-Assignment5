# Completed by:
# Faheem Mazhar - 30140922 
# Moiz Bhatti - 30163705
#

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

@app.route('/enroll/<string:student_id>', methods=['POST'])
def enroll(student_id):
    data = request.json
    course_id = data['course_id']
    
    try:
        add_course_to_student(student_id, course_id)
        return jsonify({"message": "Course enrolled successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

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

@app.route('/student_courses/<string:student_id>', methods=['GET'])
def get_student_courses_api(student_id):
    try:
        # Get student's enrolled course IDs
        enrolled_course_ids = get_student_courses(student_id)
        
        # Get all courses from courses.json
        with open('data/courses.json', 'r') as f:
            all_courses = json.load(f)
        
        # Filter to get only the enrolled courses
        enrolled_courses = [
            course for course in all_courses['courses']
            if course['id'] in enrolled_course_ids
        ]
        
        return jsonify(enrolled_courses), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@app.route('/drop/<string:student_id>', methods=['DELETE'])
def drop_course(student_id):
    data = request.json
    course_id = data['course_id']
    
    try:
        remove_course_from_student(student_id, course_id)
        return jsonify({"message": "Course dropped successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)