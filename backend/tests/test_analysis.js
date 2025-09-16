// Test file for JavaScript analysis

// Security issue: eval usage
function insecureFunction(userInput) {
    return eval(userInput);
}

// Undefined variable
function buggyFunction() {
    console.log(undefinedVar);
}

// SQL Injection vulnerability
function queryDb(userInput) {
    const query = "SELECT * FROM users WHERE id = " + userInput;
    return query;
}

// XSS vulnerability
function displayUserInput(input) {
    document.innerHTML = input;
}