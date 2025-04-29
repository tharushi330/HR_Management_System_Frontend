import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function WithRouter(ComponentWrapped) {
  return function Wrapper(props) {
    const params = useParams();
    const navigate = useNavigate();
    return <ComponentWrapped {...props} id={params.id} navigate={navigate} />;
  };
}

class EmployeeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      department: "",
      searchId: "",
    };
  }

  componentDidMount() {
    const { id } = this.props;

    if (id) {
      this.fetchEmployeeById(id);
    }
  }

  fetchEmployeeById = (id) => {
    axios
      .get(`http://localhost:8080/api/employees/search-by-id/${id}`)
      .then((response) => {
        this.setState({
          name: response.data.name,
          email: response.data.email,
          department: response.data.department,
        });
      })
      .catch((error) => {
        console.error("Error fetching employee:", error);
        alert("Employee not found.");
      });
  };

  handleSearchById = () => {
    const { searchId } = this.state;
    if (!searchId) {
      alert("Please enter an ID to search.");
      return;
    }

    this.fetchEmployeeById(searchId);
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { id, navigate } = this.props;
    const { name, email, department } = this.state;

    if (!name || !email || !department) {
      alert("All fields are required. Please fill in all fields.");
      return;
    }

    const payload = { name, email, department };
    if (id) payload.id = id;

    const url = id
      ? `http://localhost:8080/api/employees/update/${id}`
      : "http://localhost:8080/api/employees/add";

    const requestMethod = id ? axios.put : axios.post;

    requestMethod(url, payload)
      .then(() => {
        alert(`Employee ${id ? "updated" : "added"} successfully!`);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error saving employee:", error);
        alert("Failed. Please try again.");
      });
  };

  render() {
    const { name, email, department, searchId } = this.state;
    const { id, navigate } = this.props;

    return (
      <div
        className="container mt-4"
        style={{
          backgroundColor: id ? "#f8d7da" : "#d4edda", 
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>{id ? "Edit Employee" : "Add Employee"}</h2>

        {!id && (
          <Form.Group className="mb-3">
            <Form.Label>Search by Employee ID</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Enter ID to load employee"
                value={searchId}
                onChange={(e) => this.setState({ searchId: e.target.value })}
                className="me-2"
              />
              <Button variant="info" onClick={this.handleSearchById}>
                Load
              </Button>
            </div>
          </Form.Group>
        )}

        <Form onSubmit={this.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={name}
              onChange={this.handleChange}
              required
              maxLength={100}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={email}
              onChange={this.handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select
              name="department"
              value={department}
              onChange={this.handleChange}
              required
            >
              <option value="">-- Select Department --</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="FINANCE">Finance</option>
              <option value="OPERATIONS">Operations</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="me-2">
            {id ? "Update" : "Submit"}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
        </Form>
      </div>
    );
  }
}

export default WithRouter(EmployeeForm);
