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
import { registerWalker } from "../../service/authService";

const WalkerRegister = () => {
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [priceHour, setPriceHour] = useState("");
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

    if (hasErrors) {
      return;
    }

    sendRegisterForm();
  };

  const sendRegisterForm = () => {
    const data = {
      name,
      email,
      password,
      priceHour,
      photoFile
    };

    registerWalker(data)
      .then(() => {
        alert("Registro de paseador exitoso. Ahora inicia sesión.");
        navigate("/login-walker");
      })
      .catch((error) => {
        console.error(error);
        alert("Error al registrarse como paseador");
      });
  };

  const onCancelClick = () => {
    navigate("/login-walker");
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
                      <h1>Registro de Paseador</h1>

                      <FormGroup className="mt-2">
                        <RequiredLabel htmlFor="txtNombre">Nombre completo</RequiredLabel>
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
                        <RequiredLabel htmlFor="txtEmail">Email</RequiredLabel>
                        <FormControl
                          id="txtEmail"
                          required
                          maxLength={100}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormControl.Feedback type="invalid">
                          El email es obligatorio
                        </FormControl.Feedback>
                      </FormGroup>

                      <FormGroup className="mt-2">
                        <RequiredLabel htmlFor="txtPassword">Password</RequiredLabel>
                        <FormControl
                          id="txtPassword"
                          required
                          maxLength={100}
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormControl.Feedback type="invalid">
                          El password es obligatorio
                        </FormControl.Feedback>
                      </FormGroup>

                      <FormGroup className="mt-2">
                        <RequiredLabel htmlFor="txtPriceHour">
                          Precio por hora (Bs)
                        </RequiredLabel>
                        <FormControl
                          id="txtPriceHour"
                          required
                          type="number"
                          min={0}
                          step="0.1"
                          value={priceHour}
                          onChange={(e) => setPriceHour(e.target.value)}
                        />
                        <FormControl.Feedback type="invalid">
                          El precio por hora es obligatorio
                        </FormControl.Feedback>
                      </FormGroup>

                      <FormGroup className="mt-2">
                        <Form.Label htmlFor="filePhoto">Foto de perfil (opcional)</Form.Label>
                        <FormControl
                          id="filePhoto"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setPhotoFile(e.target.files[0]);
                            } else {
                              setPhotoFile(null);
                            }
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="mt-3">
                    <Button variant="primary" type="submit">
                      Registrarse
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
                    <span>¿Ya tienes cuenta? </span>
                    <Link to="/login-walker">Inicia sesión</Link>
                  </div>

                  <div className="mt-2">
                    <Link to="/register-owner">¿Eres dueño? Regístrate aquí</Link>
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

export default WalkerRegister;
