"""Test file for code analysis"""

def insecure_function(user_input):
    """This function has intentional security issues"""
    # Security issue: using eval
    result = eval(user_input)
    
    # Unused import
    import json
    
    # Undefined variable
    print(undefined_var)
    
    return result

# Missing docstring
def another_function():
    pass

# SQL Injection vulnerability
def query_db(user_input):
    query = "SELECT * FROM users WHERE id = " + user_input
    return query