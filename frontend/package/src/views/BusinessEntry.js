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
    Table
} from "reactstrap";
import { useNavigate } from 'react-router-dom'
import SweetAlert2 from "react-sweetalert2";
import DataTable from 'react-data-table-component';
import { FaTrashAlt, FaPlus } from 'react-icons/fa'; // Import icons

import { useEffect, useState } from "react";
import nationality from 'i18n-nationality';
import { API_URL } from "./config/apiConfig";
import axios from "axios";
const BusinessEntry = () => {
    const [nationalities, setNationalities] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [swalProps, setSwalProps] = useState({ show: false });

    const [formData, setFormData] = useState({
        invoiceNo: "",
        businessCategory: "",
        subCategory: "",
        customerName: "",
        companyName: "",
        passportNo: "",
        nationality: "",
        contactNo: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
        items: [
            {
                name: "",
                units: 1,
                price: 0,
                discountPercent: 0,
                vatPercent: 0,
                amount: 0,
            }
        ],
        totalAmount: 0
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
    const Navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {

        axios.get(`${API_URL}/api/businessEntry/invoiceNo`)
        .then(response => {
            if (response.data && response.data.data.seriesValue) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    invoiceNo: response.data.data.seriesValue
                }));
            }
        })
        .catch(error => {
            console.log(error, 'Errors')
        });

        // nationality.registerLocale(require('i18n-nationality/langs/en.json'));

        // const allNationalities = nationality.getNames('en');

        // const nationalitiesArray = Object.entries(allNationalities).map(([code, name]) => ({
        //     code,
        //     name,
        // }));

        // setNationalities(nationalitiesArray);

   
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // Recalculate totalAmount after item change
        let newTotalAmount = 0;
        newItems.forEach(item => {
            const amount = parseFloat(item.amount) || 0;
            const discount = parseFloat(item.discountPercent) || 0;
            const vatPercent = parseFloat(item.vatPercent) || 0;
            const price = parseFloat(item.price) || 0;

            const discountAmount = (parseFloat(price) * parseFloat(discount)) / 100;
            const discountedValue = (parseFloat(price) - parseFloat(discountAmount));
            const vatAmount = discountAmount > 0 ? (parseFloat(discountedValue) * parseFloat(vatPercent)) / 100 :
                (parseFloat(price) * parseFloat(vatPercent)) / 100;
            item.amount = parseFloat((parseFloat(price) - parseFloat(discountAmount)) + parseFloat(vatAmount)).toFixed(2);
            newTotalAmount += item.amount;

        });

        setFormData({ ...formData, items: newItems });
        setTotalAmount(parseFloat(newTotalAmount).toFixed(2)); // Update totalAmount here
    };


    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { name: "", units: 1, price: 0, vatPercent: 0, discountPercent: 0, amount: 0, }]
        });
    };

    const handleRemoveItem = (index) => {
        const newItems = formData.items.filter((item, i) => i !== index);
        setFormData({ ...formData, items: newItems });
        let newTotalAmount = 0;
        newItems.forEach(item => {
            const amount = parseFloat(item.amount) || 0;
            newTotalAmount += amount;
        });

        setTotalAmount(parseFloat(newTotalAmount).toFixed(2)); // Update totalAmount heres

    };


    const validateFormData = () => {
        const errors = {};
        let newTotalAmount = 0;

        if (!formData.date) errors.date = "Date is required";
        if (!formData.customerName) errors.customerName = "Customer name is required";
        if (!formData.businessCategory) errors.businessCategory = "Business category is required";

        if (formData.businessCategory === 'Attestation' || formData.businessCategory === 'VisaApplication') {
            if (!formData.subCategory) errors.subCategory = "Sub-category is required";

        }
        if (!formData.passportNo) errors.passportNo = "Passport/ID No is required";
        if (!formData.nationality) errors.nationality = "Nationality is required";

        formData.items.forEach((item, index) => {
            const itemErrors = {};
            if (!item.name) itemErrors.name = "Item name is required";
            if (item.units <= 0) itemErrors.units = "Units must be at least 1";
            if (item.price <= 0) itemErrors.price = "Price must be at least 1";
            if (item.discountPercent < 0 || item.discountPercent >= 100) itemErrors.discountPercent = "Enter Valid Discount %";
            if (item.vatPercent < 0 || item.vatPercent >= 100) itemErrors.vatPercent = "Enter Valid VAT %";
            if (item.amount <= 0) itemErrors.amount = "Amount must be greater than 0";
            if (!item.name || item.units <= 0 || item.amount <= 0 ||
                (item.discountPercent < 0 || item.discountPercent >= 100) || (item.vatPercent < 0 || item.vatPercent >= 100)) {
                errors[`item-${index}`] = itemErrors;
            }
            // Calculate the total amount
            if (item.amount > 0) {
                newTotalAmount += parseFloat(item.amount);
            }
        });

        setFormErrors(errors);
        // Set totalAmount only after calculation completes
        setTotalAmount(newTotalAmount);

        return Object.keys(errors).length === 0;
    };
    const submitFormData = () => {
        const isValid = validateFormData();

        console.log(isValid, 'validateFormDatdidii33a');

        if (isValid) {
            formData.totalAmount = parseFloat(totalAmount).toFixed(2)
            // return
            axios.post(`${API_URL}/api/businessEntry`, formData, {
                headers: {
                    'Content-Type': "application/json"
                }
            }).then(response => {

                if (response.status === 201) {
                    console.log(`${API_URL}/${response.data.pdfUrl}`)
                    window.open(`${API_URL}/${response.data.pdfUrl}`);
                    window.location.reload()
                }
            }).catch(error => {
                if (error.response) {
                    if (error.response.status === 409) {

                        setSwalProps({
                            show: true,
                            title: 'Duplicate Entry',
                            text: `${error.response.data.message}`,
                            didClose: () => {
                                setSwalProps({ show: false }); // Reset after the modal closes
                            },
                        });

                    } else if (error.response.status === 400) {

                        setSwalProps({
                            show: true,
                            title: 'Error',
                            text: `${error.response.data.message}`,
                            didClose: () => {
                                setSwalProps({ show: false }); // Reset after the modal closes
                            },
                        });

                    } else {
                        console.error("Error Response Data:", error.response.data);
                    }
                } else if (error.request) {
                    // Handle when no response is received
                    console.error("Error Request:", error.request);
                } else {
                    console.error("Error:", error.message);
                }
            })
            // Submit logic here
        } else {
            console.log(formErrors);
            console.log("Form Validation Failed");
        }
    };


    return (
        <Row>
            <Col>
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-bell me-2"> </i>
                        Business Entry Form
                    </CardTitle>
                    <CardBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="invoiceNo">Invoice No.</Label>
                                    <Input
                                        id="invoiceNo"
                                        name="invoiceNo"
                                        type="text"
                                        value={formData.invoiceNo}
                                        disabled
                                    />
                                    {console.log(formData.invoiceNo, 'formData.invoiceN')}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="date">Date</Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                {formErrors.date && <div className="text-danger">{formErrors.date}</div>}

                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="businessCategory">Business Category</Label>
                                    <Input
                                        id="businessCategory"
                                        name="businessCategory"
                                        type="select"
                                        value={formData.businessCategory}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Attestation">Attestation</option>
                                        <option value="Visa Application">Visa Application</option>
                                        <option value="Travel Insurance">Travel Insurance</option>
                                        <option value="Hotel Booking">Hotel Booking</option>
                                    </Input>
                                    {formErrors.businessCategory && <div className="text-danger">{formErrors.businessCategory}</div>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="subCategory">Sub-Category</Label>
                                    <Input
                                        id="subCategory"
                                        name="subCategory"
                                        type="select"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Sub-Category</option>
                                        {formData.businessCategory === "Attestation" && (
                                            <>
                                                <option value="Indian Apostille">Indian Apostille</option>
                                                <option value="Dubai Embassy and Mofa">Dubai Embassy and Mofa</option>
                                                <option value="Others">Others</option>
                                            </>
                                        )}
                                        {formData.businessCategory === "Visa Application" && (
                                            <>
                                                <option value="Oman Visa - 10 Days">Oman Visa - 10 Days</option>
                                                <option value="Oman Visa - 30 Days">Oman Visa - 30 Days</option>
                                                <option value="Oman Visa Renewal">Oman Visa Renewal</option>
                                                <option value="Dubai Visa 30 Days">Dubai Visa 30 Days</option>
                                                <option value="Others">Others</option>
                                            </>
                                        )}
                                    </Input>
                                    {formErrors.subCategory && <div className="text-danger">{formErrors.subCategory}</div>}
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="customerName">Customer Name</Label>
                                    <Input
                                        id="customerName"
                                        name="customerName"
                                        type="text"
                                        placeholder="Enter customer's full name"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                    />
                                    {formErrors.customerName && <div className="text-danger">{formErrors.customerName}</div>}
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="companyName">Company Name</Label>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        type="text"
                                        placeholder="Enter customer's Company Name (If Mandatory)"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />
                                    {formErrors.companyName && <div className="text-danger">{formErrors.companyName}</div>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="contactNo">Contact Number</Label>
                                    <Input
                                        id="contactNo"
                                        name="contactNo"
                                        type="number"
                                        placeholder="Enter Contact No."
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                    />
                                    {formErrors.contactNo && <div className="text-danger">{formErrors.contactNo}</div>}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="passportNo">Passport/ID No</Label>
                                    <Input
                                        id="passportNo"
                                        name="passportNo"
                                        type="text"
                                        placeholder="Enter applicant's Passport/ID No"
                                        value={formData.passportNo}
                                        onChange={handleChange}
                                    />
                                    {formErrors.passportNo && <div className="text-danger">{formErrors.passportNo}</div>}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="nationality">Nationality</Label>
                                    <Input
                                        id="nationality"
                                        name="nationality"
                                        type="select"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a nationality</option>
                                        {nationalities.map((nat) => (
                                            <option key={nat.name} value={nat.name}>
                                                {nat.name}
                                            </option>
                                        ))}
                                    </Input>
                                    {formErrors.nationality && <div className="text-danger">{formErrors.nationality}</div>}
                                </FormGroup>
                            </Col>
                        </Row>

                        <hr />


                        <div style={{ overflowX: 'auto' }}>
                            <Table bordered responsive hover >
                                <thead>
                                    <tr style={{ backgroundColor: '#f8f9fa', color: '#495057' }}>
                                        <th style={{ minWidth: '150px' }}>Item Name</th>
                                        <th style={{ minWidth: '80px' }}>Units</th>
                                        <th style={{ minWidth: '100px' }}>Price</th>
                                        <th style={{ minWidth: '120px' }}>Discount %</th>
                                        <th style={{ minWidth: '100px' }}>VAT %</th>
                                        <th style={{ minWidth: '120px' }}>Amount</th>
                                        <th style={{ minWidth: '120px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="col-md-3">
                                                <Input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                                    placeholder="Enter Name"
                                                    style={{ padding: '5px', fontSize: '14px' }}
                                                />
                                                {formErrors[`item-${index}`]?.name && <div className="text-danger">{formErrors[`item-${index}`].name}</div>}
                                            </td>
                                            <td className="col-md-1">
                                                <Input
                                                    type="number"
                                                    value={item.units}
                                                    onChange={(e) => handleItemChange(index, "units", e.target.value)}
                                                    placeholder="Units"
                                                    style={{ padding: '5px', fontSize: '14px' }}
                                                />
                                                {formErrors[`item-${index}`]?.units && <div className="text-danger">{formErrors[`item-${index}`].units}</div>}
                                            </td>
                                            <td className="col-md-2">
                                                <Input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(index, "price", e.target.value)}
                                                    placeholder="Price"
                                                    style={{ padding: '5px', fontSize: '14px' }}
                                                />
                                                {formErrors[`item-${index}`]?.price && <div className="text-danger">{formErrors[`item-${index}`].price}</div>}
                                            </td>
                                            <td className="col-md-2">
                                                <Input
                                                    type="number"
                                                    value={item.discountPercent}
                                                    onChange={(e) => handleItemChange(index, "discountPercent", e.target.value)}
                                                    placeholder="Discount"
                                                    style={{ padding: '5px', fontSize: '14px' }}
                                                />
                                                {formErrors[`item-${index}`]?.discountPercent && <div className="text-danger">{formErrors[`item-${index}`].discountPercent}</div>}
                                            </td>
                                            <td className="col-md-2">
                                                <Input
                                                    type="number"
                                                    value={item.vatPercent}
                                                    onChange={(e) => handleItemChange(index, "vatPercent", e.target.value)}
                                                    placeholder="Enter VAT %"
                                                    style={{ padding: '5px', fontSize: '14px' }}
                                                />
                                                {formErrors[`item-${index}`]?.vatPercent && <div className="text-danger">{formErrors[`item-${index}`].vatPercent}</div>}
                                            </td>
                                            <td className="col-md-2">
                                                <Input
                                                    type="number"
                                                    value={item.amount}
                                                    placeholder="Amount"
                                                    style={{ padding: '5px', fontSize: '14px' }}
                                                    disabled
                                                />
                                                {formErrors[`item-${index}`]?.amount && <div className="text-danger">{formErrors[`item-${index}`].amount}</div>}
                                            </td>
                                            <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                                <Button color="success" onClick={() => handleAddItem(index)}>
                                                    <i class="bi bi-plus-lg"></i>
                                                </Button>

                                                {
                                                    index != 0 && <Button color="danger" onClick={() => handleRemoveItem(index)}>
                                                        <i class="bi bi-trash3-fill"></i>
                                                    </Button>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style={{ textAlign: 'center' }}><b>Total Amount</b></td>
                                        <td>
                                            <Input
                                                type="number"
                                                value={totalAmount}
                                                placeholder="Amount"
                                                disabled
                                                style={{ padding: '5px', fontSize: '14px' }}
                                            />
                                        </td>
                                        <td style={{ display: 'flex', justifyContent: 'space-evenly' }}></td>
                                    </tr>
                                </tfoot>
                            </Table>
                        </div>


                        {/* <Table bordered responsive>
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Units</th>
                                    <th>Price</th>
                                    <th>Discount %</th>
                                    <th>VAT %</th>
                                    <th>Amount </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                                placeholder="Enter item name"
                                            />
                                            {formErrors[`item-${index}`]?.name && <div className="text-danger">{formErrors[`item-${index}`].name}</div>}
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                value={item.units}
                                                onChange={(e) => handleItemChange(index, "units", e.target.value)}
                                                placeholder="Units"
                                            />
                                            {formErrors[`item-${index}`]?.units && <div className="text-danger">{formErrors[`item-${index}`].units}</div>}
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handleItemChange(index, "price", e.target.value)}
                                                placeholder="Price"
                                            />
                                            {formErrors[`item-${index}`]?.amount && <div className="text-danger">{formErrors[`item-${index}`].price}</div>}
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                value={item.discount}
                                                onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                                                placeholder="Discount"
                                            />
                                            {formErrors[`item-${index}`]?.amount && <div className="text-danger">{formErrors[`item-${index}`].discount}</div>}
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                value={item.vatPercent}
                                                onChange={(e) => handleItemChange(index, "vatPercent", e.target.value)}
                                                placeholder="Enter VAT %"
                                            />
                                            {formErrors[`item-${index}`]?.vatPercent && <div className="text-danger">{formErrors[`item-${index}`].vatPercent}</div>}
                                        </td>
                                        <td>
                                            <Input
                                                type="number"
                                                value={item.amount}
                                                // onChange={(e) => handleItemChange(index, "a", e.target.value)}
                                                placeholder="Amount"
                                                disabled
                                            />
                                            {formErrors[`item-${index}`]?.amount && <div className="text-danger">{formErrors[`item-${index}`].amount}</div>}
                                        </td>
                                        <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                            <Button color="success" onClick={() => handleAddItem(index)}>
                                                <i class="bi bi-plus-lg"></i>
                                            </Button>

                                            {
                                                index != 0 && <Button color="danger" onClick={() => handleRemoveItem(index)}>
                                                    <i class="bi bi-trash3-fill"></i>
                                                </Button>
                                            }

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>

                                <tr>
                                    <td></td>
                                    <td style={{ textAlign: 'center' }}><b>Total Amount</b>  </td>
                                    <td>
                                        <Input
                                            type="number"
                                            value={totalAmount}
                                            placeholder="Amount"
                                            disabled
                                        />   </td>
                                    <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>

                                    </td>
                                </tr>
                            </tfoot>
                        </Table> */}


                        <hr />

                        <FormGroup>
                            <Label for="notes">Notes</Label>
                            <Input
                                id="notes"
                                name="notes"
                                type="textarea"
                                placeholder="Additional notes"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </FormGroup>
                        <div style={{ textAlign: 'center' }}>
                            <Button color="primary" onClick={submitFormData}>
                                <i class="bi bi-download"></i>  Submit
                            </Button>
                        </div>

                    </CardBody>
                </Card>
            </Col>
            <SweetAlert2 {...swalProps} />

        </Row>
    );
};

export default BusinessEntry;
