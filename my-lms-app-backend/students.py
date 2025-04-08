# Dictionary to store student information
import json
import os


##This was done with the help of ChatGPT to avoid using a db and just store the login info in a json file for ease of use and to check that the users can be saved.
# File path for storing student data
STUDENTS_FILE = 'data/students.json'

# Initialize students_list from file if it exists, otherwise empty dict
students_list = {}

def load_students():
    global students_list
    if os.path.exists(STUDENTS_FILE):
        with open(STUDENTS_FILE, 'r') as f:
            students_list = json.load(f)
    else:
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(STUDENTS_FILE), exist_ok=True)
        # Initialize with empty dict
        students_list = {}
        save_students()

def save_students():
    with open(STUDENTS_FILE, 'w') as f:
        json.dump(students_list, f, indent=2)

# Load students when module is imported
load_students()

def get_students():
    return students_list

def add_student(student):
    """
    Add a new student to the system
    Expected student format:
    {
        'id': str,
        'username': str,
        'password': str,
        'email': str,
        'enrolled_courses': list
    }
    """
    if 'username' and 'password' and 'email' not in student:
        raise ValueError("Username, password, email is required")
        
    if 'id' not in student:
        length_of_students_list = len(students_list)
        student['id'] = length_of_students_list + 1
    
    if 'enrolled_courses' not in student:
        student['enrolled_courses'] = []
    
    students_list[student['username']] = student
    save_students()
    return students_list

def get_student(username, password):
    if username not in students_list:
        raise KeyError(f"Student with username {username} not found")
    if students_list[username]['password'] != password:
        raise ValueError("Invalid password")
    return True

def get_student_courses(username):
    if username not in students_list:
        raise KeyError(f"Student with username {username} not found")
    
    if 'enrolled_courses' not in students_list[username]:
        students_list[username]['enrolled_courses'] = []
        
    return students_list[username]['enrolled_courses']

def add_course_to_student(username, course_id):
    if username not in students_list:
        raise KeyError(f"Student with username {username} not found")
    
    if 'enrolled_courses' not in students_list[username]:
        students_list[username]['enrolled_courses'] = []
    
    if isinstance(course_id, str) and course_id.isdigit():
        course_id = int(course_id)
        
    if course_id not in students_list[username]['enrolled_courses']:
        students_list[username]['enrolled_courses'].append(course_id)
        save_students()
    
    return students_list[username]['enrolled_courses']

def remove_course_from_student(username, course_id):
    if username not in students_list:
        raise KeyError(f"Student with username {username} not found")
    
    if 'enrolled_courses' not in students_list[username]:
        students_list[username]['enrolled_courses'] = []
    
    if isinstance(course_id, str) and course_id.isdigit():
        course_id = int(course_id)
        
    if course_id in students_list[username]['enrolled_courses']:
        students_list[username]['enrolled_courses'].remove(course_id)
        save_students()
    
    return students_list[username]['enrolled_courses']