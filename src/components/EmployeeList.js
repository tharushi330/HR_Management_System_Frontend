import React from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function withRouter(Component) {
  return (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class EmployeeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
    };
  }

  componentDidMount() {
    this.fetchEmployees();
  }

  fetchEmployees = () => {
    axios
      .get("http://localhost:8080/api/employees/get-all")
      .then((res) => this.setState({ employees: res.data }))
      .catch((err) => console.error("Error fetching employees:", err));
  };

  handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/employees/delete/${id}`)
      .then(() => this.fetchEmployees())
      .catch((err) => console.error("Error deleting employee:", err));
  };

  render() {
    const { employees } = this.state;
    const { navigate } = this.props;

    return (
      <div className="container mt-4 bg-info p-4 rounded">
        <h2 className="mb-4">Employee List</h2>
        <Button variant="primary" className="mb-3" onClick={() => navigate("/employee")}>
          Add New Employee
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.createdAt}</td>
                <td>{emp.updatedAt}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/edit/${emp.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => this.handleDelete(emp.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default withRouter(EmployeeList);
