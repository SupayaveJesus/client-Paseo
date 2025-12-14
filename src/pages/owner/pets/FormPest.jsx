import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { FaDog, FaSave, FaTimes } from "react-icons/fa";
import Header from "../../../components/Header";
import RequiredLabel from "../../../components/RequiredLabel";
import useAuthentication from "../../../hooks/useAuthentication";
import { createPet, updatePet } from "../../../service/petService";

const FormPet = () => {
  useAuthentication(true, "owner");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // si hay id, es edición

  const petFromState = location.state?.pet || null;
  const isEdit = !!id;

  const [validated, setValidated] = useState(false);
  const [name, setName] = useState(petFromState?.name || "");
  const [type, setType] = useState(petFromState?.type || "");
  const [notes, setNotes] = useState(petFromState?.notes || "");

  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("");

  useEffect(() => {
    if (isEdit && !petFromState) {
      setMessage("No se encontraron datos de la mascota. Volviendo a la lista.");
      navigate("/owner/pets");
    }
  }, [isEdit, petFromState, navigate]);

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
    sendForm();
  };

  const sendForm = () => {
    const payload = {
      name,
      type,
      notes
    };

    const request = isEdit ? updatePet(id, payload) : createPet(payload);

    request
      .then(() => {
        navigate("/owner/pets");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Error al guardar mascota");
      });
  };

  const onCancelClick = () => {
    navigate("/owner/pets");
  };

  return (
    <>
      <Header />
      <Container className="app-page">
        <Row className="justify-content-center">
          <Col md={6} xl={5}>
            <Card className="app-card-elevated">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-2">
                    <FaDog size={26} color="#2563eb" />
                  </div>
                  <div>
                    <h2 className="app-section-title mb-0">
                      {isEdit ? "Editar mascota" : "Nueva mascota"}
                    </h2>
                    <small className="text-muted">
                      Completa los datos básicos de tu peludito.
                    </small>
                  </div>
                </div>

                {message && (
                  <div className={`alert alert-${messageVariant || "danger"}`}>
                    {message}
                  </div>
                )}

                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                  <Row>
                    <Col>
                      <FormGroup className="mb-3">
                        <RequiredLabel htmlFor="txtNombre">
                          Nombre
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

                      <FormGroup className="mb-3">
                        <RequiredLabel htmlFor="txtTipo">
                          Tipo
                        </RequiredLabel>
                        <FormControl
                          id="txtTipo"
                          required
                          maxLength={50}
                          type="text"
                          placeholder="Perro, Gato, etc."
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                        />
                        <FormControl.Feedback type="invalid">
                          El tipo es obligatorio
                        </FormControl.Feedback>
                      </FormGroup>

                      <FormGroup className="mb-3">
                        <Form.Label htmlFor="txtNotas">Notas</Form.Label>
                        <FormControl
                          as="textarea"
                          id="txtNotas"
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Alérgico, juguetón, no le gustan otros perros, etc."
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="mt-3 d-flex">
                    <Button className="btn-pill-primary" type="submit">
                      <FaSave className="me-2" />
                      Guardar
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="ms-2"
                      onClick={onCancelClick}
                    >
                      <FaTimes className="me-1" />
                      Cancelar
                    </Button>
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

export default FormPet;
