// src/pages/auth/OwnerRegister.jsx
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
import { FiUserPlus, FiMail, FiLock, FiUser } from "react-icons/fi";
import RequiredLabel from "../../components/RequiredLabel";
import Header from "../../components/Header";
import { registerOwner } from "../../service/authService";

const OwnerRegister = () => {
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

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

    sendRegisterForm();
  };

  const sendRegisterForm = () => {
    const data = {
      name,
      email,
      password,
      photoFile,
    };

    registerOwner(data)
      .then(() => {
        alert("Registro de dueño exitoso. Ahora inicia sesión.");
        navigate("/login-owner");
      })
      .catch((error) => {
        console.error(error);
        alert("Error al registrarse como dueño");
      });
  };

  const onCancelClick = () => {
    navigate("/login-owner");
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
                        Dueño de mascota
                      </small>
                      <h1 className="h4 mb-0">Registro de dueño</h1>
                      <p className="text-muted small mb-0">
                        Crea tu cuenta para administrar tus paseos.
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
                        background: "#fff1f2",
                      }}
                    >
                      <FiUserPlus />
                    </div>
                  </div>

                  <Form
                    noValidate
                    validated={validated}
                    onSubmit={onFormSubmit}
                  >
                    <Row>
                      <Col>
                        <FormGroup className="mt-2">
                          <RequiredLabel htmlFor="txtNombre">
                            Nombre completo
                          </RequiredLabel>
                          <FormControl
                            id="txtNombre"
                            required
                            maxLength={100}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <FormControl.Feedback type="invalid">
                            El nombre es obligatorio
                          </FormControl.Feedback>
                        </FormGroup>

                        <FormGroup className="mt-2">
                          <RequiredLabel htmlFor="txtEmail">
                            Email
                          </RequiredLabel>
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

                        <FormGroup className="mt-2">
                          <RequiredLabel htmlFor="txtPassword">
                            Password
                          </RequiredLabel>
                          <div className="d-flex align-items-center">
                            <span className="me-2 text-muted">
                              <FiLock />
                            </span>
                            <FormControl
                              id="txtPassword"
                              required
                              maxLength={100}
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <FormControl.Feedback type="invalid">
                            El password es obligatorio
                          </FormControl.Feedback>
                        </FormGroup>

                        <FormGroup className="mt-2">
                          <Form.Label htmlFor="filePhoto">
                            Foto de perfil (opcional)
                          </Form.Label>
                          <FormControl
                            id="filePhoto"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (
                                e.target.files &&
                                e.target.files.length > 0
                              ) {
                                setPhotoFile(e.target.files[0]);
                              } else {
                                setPhotoFile(null);
                              }
                            }}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="mt-3 d-flex gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        className="btn-primary-pill"
                      >
                        Registrarse
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
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login-owner">Inicia sesión</Link>
                      </div>
                      <div className="mt-1">
                        ¿Eres paseador?{" "}
                        <Link to="/register-walker">
                          Regístrate como paseador
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

export default OwnerRegister;
