import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    Button,
    FormGroup,
    Label,
    Input,
    Spinner
} from "reactstrap";
import { useNavigate } from 'react-router-dom';
import SweetAlert2 from "react-sweetalert2";
import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import { API_URL } from "./config/apiConfig";

const BusinessEntryReports = () => {
    const [reportsData, setReportsData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0); // State for total amount
    const [swalProps, setSwalProps] = useState({ show: false });
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
    });

    const [formErrors, setFormErrors] = useState({
        fromDate: "",
        toDate: "",
    });

    const columns = [
        {
            name: 'Invoice No',
            selector: row => row.invoiceNo,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Customer Name',
            selector: row => row.customerName,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'Total Amount',
            selector: row => row.totalAmount,
            sortable: true,
        },
    ];

    const validateFormData = () => {
        const errors = {};
        if (!formData.fromDate) errors.fromDate = "From Date is required";
        if (!formData.toDate) errors.toDate = "To Date is required";
        if (formData.fromDate && formData.toDate && new Date(formData.fromDate) > new Date(formData.toDate)) {
            errors.dateRange = "From Date cannot be later than To Date";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitFormData = () => {
        const isValid = validateFormData();
        if (isValid) {
            setIsLoading(true);
            axios.post(`${API_URL}/api/reports`, formData).then(response => {
                if (response.status === 200) {
                    const fetchedData = response.data.data;
                    const total = fetchedData.reduce((acc, item) => acc + parseFloat(item.totalAmount || 0), 0);
                    setReportsData(fetchedData);
                    setTotalAmount(total); // Set the total amount
                }
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                setIsLoading(false);
            });
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Create a total row object
    const totalRow = {
        invoiceNo: "",
        date: "",
        customerName: "Total",
        category: "",
        totalAmount: totalAmount.toFixed(2), // Ensure it's formatted to 2 decimal places
    };

    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            <i className="bi bi-bell me-2"> </i>
                            Business Entry Report
                        </CardTitle>
                        <CardBody>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="fromDate">From Date</Label>
                                        <Input
                                            id="fromDate"
                                            name="fromDate"
                                            type="date"
                                            value={formData.fromDate}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                    {formErrors.fromDate && <div className="text-danger">{formErrors.fromDate}</div>}
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="toDate">To Date</Label>
                                        <Input
                                            id="toDate"
                                            name="toDate"
                                            type="date"
                                            value={formData.toDate}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>
                                    {formErrors.toDate && <div className="text-danger">{formErrors.toDate}</div>}
                                </Col>
                            </Row>
                            <hr />
                            <div style={{ textAlign: 'center' }}>
                                <Button color="primary" onClick={submitFormData}>
                                    <i className="bi bi-download"></i> Generate Report
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <SweetAlert2 {...swalProps} />
            </Row>
            {isLoading ? (
                <Row className="text-center">
                    <Col>
                        <Spinner style={{ width: '3rem', height: '3rem' }} color="primary" />
                        <div>Loading...</div>
                    </Col>
                </Row>
            ) : (
                reportsData.length > 0 ? (
                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <DataTable
                                        title="Business Entry Report"
                                        columns={columns}
                                        data={[...reportsData, totalRow]} // Append the total row
                                        pagination
                                        highlightOnHover
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                ) : (
                    <Row>
                        <Col>
                            <Card>
                                <CardBody>
                                    <h5 style={{ textAlign: 'center' }}>No entries found for the selected date range.</h5>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )
            )}
        </>
    );
};

export default BusinessEntryReports;
