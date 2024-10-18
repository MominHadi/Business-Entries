import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Table,
    Spinner
} from "reactstrap";
import { useNavigate } from 'react-router-dom'
import SweetAlert2 from "react-sweetalert2";

import { useEffect, useState } from "react";
import nationality from 'i18n-nationality';

// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
import DataTable from 'react-data-table-component';

import { API_URL } from "./config/apiConfig";
import axios from "axios";


const BusinessEntryReports = () => {
    const [reportsData, setReportsData] = useState([]);
    const [swalProps, setSwalProps] = useState({ show: false });
    const [isLoading, setIsLoading] = useState(false); // Loader state

    const [formData, setFormData] = useState({

        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],

    });

    const [formErrors, setFormErrors] = useState({
        invoiceNo: "",
        businessCategory: "",
        subCategory: "",
        customerName: "",
        passportNo: "",
        nationality: "",
        contactNo: "",
        items: [],

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
    const Navigate = useNavigate();

    const validateFormData = () => {
        const errors = {};
        let newTotalAmount = 0;

        if (!formData.fromDate) errors.fromDate = "From Date is required";
        if (!formData.toDate) errors.toDate = "To Date is required";
        if (formData.fromDate && formData.toDate && new Date(formData.fromDate) > new Date(formData.toDate)) {
            errors.dateRange = "From Date cannot be later than To Date";
        }

        setFormErrors(errors);
        // Set totalAmount only after calculation completes

        return Object.keys(errors).length === 0;
    };

    const submitFormData = () => {
        const isValid = validateFormData();

        console.log(isValid, 'validateFormData');

        if (isValid) {
            setIsLoading(true);
            axios.post(`${API_URL}/api/reports`, formData).then(response => {
                console.log(response, 'Response')

                if (response.status === 200) {
                    console.log(response.data.data, 'Reponse Data')
                    setReportsData(response.data.data)
                }
            }).catch(error => {
                console.log(error)

            }).finally(() => {
                setIsLoading(false);
            })

        } else {
            console.log(`Validation Failed`)
        }


    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
                                    {formErrors.dateRange && <div className="text-danger">{formErrors.dateRange}</div>}
                                </Col>
                            </Row>


                            <hr />

                            <div style={{ textAlign: 'center' }}>
                                <Button color="primary" onClick={submitFormData}>
                                    <i class="bi bi-download"></i>  Generate Report
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
                                        data={reportsData}
                                        pagination
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
