import { useState } from "react";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    FormControl,
    FormGroup,
    Row
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import RequiredLabel from "../../components/RequiredLabel";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";

const WalkerLoginPage = () => {
    const navigate = useNavigate();
    const { doLogin } = useAuthentication(false, "walker");

    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onFormSubmit = (event) => {
        const form = event.currentTarget;
        let hasErrors = false;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false) {
            hasErrors = true;
        }
        setValidated(true);

        if (hasErrors) {
            return;
        }

        const loginData = { email, password };

        doLogin(loginData).catch(() => {
            alert("Email o contraseña incorrectos");
        });
    };

    const onCancelClick = () => {
        navigate("/login-owner");
    };

    return (
        <>
            <Header />
            <Container>
                <Row className="mt-2">
                    <Col md={6} xl={4}>
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    <Row>
                                        <Col>
                                            <h1>Iniciar sesión</h1>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtEmail">Email</RequiredLabel>
                                                <FormControl
                                                    id="txtEmail"
                                                    required
                                                    maxLength={100}
                                                    type="text"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                <FormControl.Feedback type="invalid">
                                                    El email es obligatorio
                                                </FormControl.Feedback>
                                            </FormGroup>
                                            <FormGroup>
                                                <RequiredLabel htmlFor="txtPassword">
                                                    Password
                                                </RequiredLabel>
                                                <FormControl
                                                    id="txtPassword"
                                                    maxLength={100}
                                                    required
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <FormControl.Feedback type="invalid">
                                                    El password es obligatorio
                                                </FormControl.Feedback>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <div className="mt-2">
                                        <Button variant="primary" type="submit">
                                            Iniciar sesión
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="ms-2"
                                            onClick={onCancelClick}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>

                                    <div className="mt-3">
                                        <Link to="/login-owner">¿Eres dueño?</Link>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default WalkerLoginPage;
