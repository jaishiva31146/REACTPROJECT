import React, {useState,useEffect} from 'react';
import { Table, Pagination, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomerInfo=()=>{
    const [errorMessage, setErrorMessage] = useState('');
    const [customers, setCustomers] = useState([]);

    const [currentPage,setCurrentPage]=useState(1);
    const [entries,setEntries]=useState(20);
    const [search, setSearch]=useState('');
    const paginate=(pageNumber)=>setCurrentPage(pageNumber);

    const refreshListEmployee=()=>{
        fetch("http://localhost:8080/users")
            .then(response=>{
                if (!response.ok) 
                {
                    throw new Error('Server Down');
                }
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) {
                    setErrorMessage('No Data Exists');
                } else {
                    setCustomers(data);
                }
            })
            .catch(error => {
                setErrorMessage(error.message);
            });
    };

    useEffect(() => {
        refreshListEmployee();
    }, []);

    const handleEntriesPerPageChange = (e) => {
        setEntries(parseInt(e.target.value));
        setCurrentPage(1);
    };
    const index= [5,10,15,20,25,30,35,40,45,50];

    const totalPages = Math.ceil(customers.length / entries);
    const paginationItems = [];
    paginationItems.push(
        <Pagination.First key="first" onClick={() => paginate(1)} className="rounded-circle" />,
        <Pagination.Prev key="prev" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="rounded-circle" />
    );

    for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
            <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => paginate(i)}
                className="rounded-circle"
            >
                {i}
            </Pagination.Item>
        );
    }
    paginationItems.push(
        <Pagination.Next key="next" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-circle" />,
        <Pagination.Last key="last" onClick={() => paginate(totalPages)} className="rounded-circle" />
    );


    const [sortByDateAsc, setSortByDateAsc] = useState(true);
    const [sortByTimeAsc, setSortByTimeAsc] = useState(true);
    const sortedData=(key)=>{
        if (key === 'date') {
            setSortByDateAsc(!sortByDateAsc);
            const sortedCustomers = [...customers].sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return sortByDateAsc ? dateA - dateB : dateB - dateA;
            });
            setCustomers(sortedCustomers);
        } else if (key === 'time') {
            setSortByTimeAsc(!sortByTimeAsc);
            const sortedCustomers = [...customers].sort((a, b) => {
                const timeA = new Date(a.created_at).getTime();
                const timeB = new Date(b.created_at).getTime();
                return sortByTimeAsc ? timeA - timeB : timeB - timeA;
            });
            setCustomers(sortedCustomers);
        }
    }
    return (
        <>
        <h1>Welcome</h1>
            <Form.Control
                type="search"
                placeholder="Search on the basis of Name and Location"
                className="sm"
                value={search}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
            <br/><br/>    
            <>
                <div className='float-end'>
                    <Form.Group>
                        <Row>
                            <Col>
                                <Form.Label>Showing</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control as="select" value={entries} onChange={handleEntriesPerPageChange}>
                                    {index.map(option=>(
                                        <option key={option}>{option}</option>
                                    ))}
                                </Form.Control>
                            </Col>
                            <Col>
                                <Form.Label>entries</Form.Label>
                            </Col>
                        </Row>
                    </Form.Group>
                </div>
                <div className='float-start'>
                    <Pagination className="rounded-circle">
                        {paginationItems}
                    </Pagination>
                </div>
            </>
            <p>Total <strong>{customers.length} records</strong></p>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>SNo.</th>
                        <th>Employee Name</th>
                        <th>Age</th>
                        <th>Phone Number</th>
                        <th>Location</th>
                        <th onClick={()=>sortedData('date')}>Created At(Date)</th>
                        <th onClick={()=>sortedData('time')}>Created At(Time)</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length === 0 ? (
                        <tr>
                            <td colSpan="6">{errorMessage}</td>
                        </tr>
                    ) : (
                        customers
                        .filter(emp => {
                            if (!search) return true;
                            return (
                                emp.name.toLowerCase().includes(search) ||
                                emp.location.toLowerCase().includes(search)
                            )
                        })
                        .slice((currentPage-1)*entries,currentPage*entries).map((emp) =>(
                            <tr key={index}>
                                <td>{emp.sno}</td>
                                <td>{emp.name}</td>
                                <td>{emp.age}</td>
                                <td>{emp.phone_no}</td>
                                <td>{emp.location}</td>
                                <td>{new Date(emp.created_at).toLocaleDateString()}</td>
                                <td>{new Date(emp.created_at).toLocaleTimeString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </>
    );
}

export default CustomerInfo;