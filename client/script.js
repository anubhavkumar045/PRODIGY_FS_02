const API_URL = 'http://localhost:5000/api';

let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();
    
    document.getElementById('employee-form').addEventListener('submit', handleSubmit);
    document.getElementById('cancel-btn').addEventListener('click', resetForm);
});

async function loadEmployees() {
    try {
        const response = await fetch(`${API_URL}/employees`);
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

function displayEmployees(employees) {
    const tbody = document.getElementById('employee-tbody');
    tbody.innerHTML = '';
    
    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.position}</td>
            <td>${employee.department}</td>
            <td>$${employee.salary.toLocaleString()}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editEmployee('${employee._id}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteEmployee('${employee._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const employeeData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        position: document.getElementById('position').value,
        department: document.getElementById('department').value,
        salary: parseFloat(document.getElementById('salary').value)
    };
    
    try {
        if (editingId) {
            await fetch(`${API_URL}/employees/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });
        } else {
            await fetch(`${API_URL}/employees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });
        }
        
        resetForm();
        loadEmployees();
    } catch (error) {
        console.error('Error saving employee:', error);
    }
}

async function editEmployee(id) {
    try {
        const response = await fetch(`${API_URL}/employees`);
        const employees = await response.json();
        const employee = employees.find(emp => emp._id === id);
        
        if (employee) {
            editingId = id;
            document.getElementById('name').value = employee.name;
            document.getElementById('email').value = employee.email;
            document.getElementById('position').value = employee.position;
            document.getElementById('department').value = employee.department;
            document.getElementById('salary').value = employee.salary;
            
            document.getElementById('form-title').textContent = 'Edit Employee';
            document.getElementById('submit-btn').textContent = 'Update Employee';
        }
    } catch (error) {
        console.error('Error loading employee:', error);
    }
}

async function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            await fetch(`${API_URL}/employees/${id}`, {
                method: 'DELETE'
            });
            loadEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    }
}

function resetForm() {
    editingId = null;
    document.getElementById('employee-form').reset();
    document.getElementById('form-title').textContent = 'Add New Employee';
    document.getElementById('submit-btn').textContent = 'Add Employee';
}
