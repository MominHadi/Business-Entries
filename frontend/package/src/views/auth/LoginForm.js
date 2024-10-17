import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({})

    const Navigate = useNavigate();

    const handleSubmit = (e) => {

        e.preventDefault();
        // Handle login logic here
        console.log({ username, password });
        const errors = {};
        if (!username) {
            errors.username = 'Please enter Username'
        }

        if (!password) {
            errors.password = 'Please enter Password'
        }

        if (username === "admin" && password === 'admin@123') {
            localStorage.setItem('isAuthenticated', 'true'); // Set authentication flag
            localStorage.setItem('lastLoginTime', new Date().getTime()); // Set last login time
            Navigate('/', { replace: true });
        } else {
            errors.invalidStatement = "Invalid Username or Password";
        }

        setFormErrors(errors)

    };
    const cardStyle = {
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px', // Limit the card width
        marginTop: '50px',
    };

    const inputStyle = {
        borderRadius: '5px',
        padding: '10px',
    };

    const buttonStyle = {
        marginTop: '20px',
    };

    const titleStyle = {
        marginBottom: '1.5rem',
        textAlign: 'center',
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={4}>  {/* Narrower form */}
                    <Card style={cardStyle}>
                        <CardBody>
                            <CardTitle tag="h3" style={titleStyle}>Login</CardTitle>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="username">Username</Label>
                                    <Input
                                        type="text"
                                        id="username"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={inputStyle}
                                    />
                                    {formErrors.username && <div className="text-danger">{formErrors.username}</div>}
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input
                                        type="password"
                                        id="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={inputStyle}
                                    />
                                    {formErrors.password && <div className="text-danger">{formErrors.password}</div>}

                                </FormGroup>

                                {formErrors.invalidStatement && <div className="text-danger">{formErrors.invalidStatement}</div>}
                                <Button color="primary" block style={buttonStyle}>
                                    Login
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
