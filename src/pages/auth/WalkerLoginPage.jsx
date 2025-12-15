// src/pages/auth/WalkerLoginPage.jsx
import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Row,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FiLogIn, FiMail, FiLock, FiUser } from "react-icons/fi";
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

    if (hasErrors) return;

    const loginData = { email, password };

    doLogin(loginData).catch(() => {
      alert("Email o contraseña incorrectos");
    });
  };

  const onCancelClick = () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <div className="app-page-wrapper">
        <Container>
          <Row className="justify-content-center mt-4">
            <Col md={6} lg={5} xl={4}>
              <Card className="app-card-elevated">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <small className="text-muted d-flex align-items-center mb-1">
                        <FiUser className="me-1" />
                        Paseador de mascotas
                      </small>
                      <h1 className="h4 mb-0">Iniciar sesión</h1>
                      <p className="text-muted small mb-0">
                        Administra tus paseos y revisa tus reviews.
                      </p>
                    </div>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#e0f2fe",
                      }}
                    >
                      <FiLogIn />
                    </div>
                  </div>

                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={onFormSubmit}
                  >
                    <FormGroup className="mb-3">
                      <RequiredLabel htmlFor="txtEmail">Email</RequiredLabel>
                      <div className="d-flex align-items-center">
                        <span className="me-2 text-muted">
                          <FiMail />
                        </span>
                        <FormControl
                          id="txtEmail"
                          required
                          maxLength={100}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <FormControl.Feedback type="invalid">
                        El email es obligatorio
                      </FormControl.Feedback>
                    </FormGroup>

                    <FormGroup className="mb-3">
                      <RequiredLabel htmlFor="txtPassword">
                        Password
                      </RequiredLabel>
                      <div className="d-flex align-items-center">
                        <span className="me-2 text-muted">
                          <FiLock />
                        </span>
                        <FormControl
                          id="txtPassword"
                          maxLength={100}
                          required
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <FormControl.Feedback type="invalid">
                        El password es obligatorio
                      </FormControl.Feedback>
                    </FormGroup>

                    <div className="mt-3 d-flex gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        className="btn-primary-pill"
                      >
                        Iniciar sesión
                      </Button>
                      <Button
                        variant="outline-secondary"
                        className="btn-secondary-pill"
                        onClick={onCancelClick}
                      >
                        Cancelar
                      </Button>
                    </div>

                    <div className="mt-3 small">
                      <div>
                        ¿Aún no tienes cuenta?{" "}
                        <Link to="/register-walker">
                          Regístrate como paseador
                        </Link>
                      </div>
                      <div className="mt-1">
                        ¿Eres dueño?{" "}
                        <Link to="/login-owner">
                          Inicia sesión como dueño
                        </Link>
                      </div>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default WalkerLoginPage;
