# Dictionary to store student information
students_list = {}

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
    
    # Ensure enrolled_courses exists and is a list
    if 'enrolled_courses' not in student:
        student['enrolled_courses'] = []
    
    students_list[student['username']] = student
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
    
    # Ensure enrolled_courses exists
    if 'enrolled_courses' not in students_list[username]:
        students_list[username]['enrolled_courses'] = []
        
    return students_list[username]['enrolled_courses']

def add_course_to_student(username, course_id):
    if username not in students_list:
        raise KeyError(f"Student with username {username} not found")
    
    # Ensure enrolled_courses exists
    if 'enrolled_courses' not in students_list[username]:
        students_list[username]['enrolled_courses'] = []
    
    # Convert course_id to int if it's a string
    if isinstance(course_id, str) and course_id.isdigit():
        course_id = int(course_id)
        
    if course_id not in students_list[username]['enrolled_courses']:
        students_list[username]['enrolled_courses'].append(course_id)
    
    return students_list[username]['enrolled_courses']

def remove_course_from_student(username, course_id):
    if username not in students_list:
        raise KeyError(f"Student with username {username} not found")
    
    # Ensure enrolled_courses exists
    if 'enrolled_courses' not in students_list[username]:
        students_list[username]['enrolled_courses'] = []
    
    # Convert course_id to int if it's a string
    if isinstance(course_id, str) and course_id.isdigit():
        course_id = int(course_id)
        
    if course_id in students_list[username]['enrolled_courses']:
        students_list[username]['enrolled_courses'].remove(course_id)
    
    return students_list[username]['enrolled_courses']