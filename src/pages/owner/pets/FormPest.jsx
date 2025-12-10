// src/pages/owner/pets/FormMascota.jsx
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
import Header from "../../../components/Header";
import RequiredLabel from "../../../components/RequiredLabel";
import useAuthentication from "../../../hooks/useAuthentication";
import { createPet, updatePet } from "../../../service/petService";

const FormPet = () => {
  useAuthentication(true, "owner");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // si existe, es edición

  const petFromState = location.state?.pet || null;
  const isEdit = !!id;

  const [validated, setValidated] = useState(false);
  const [name, setName] = useState(petFromState?.name || "");
  const [type, setType] = useState(petFromState?.type || "");
  const [notes, setNotes] = useState(petFromState?.notes || "");

  useEffect(() => {
    // si recarga la página en modo editar SIN state, mejor volver a la lista
    if (isEdit && !petFromState) {
      alert("No se encontraron datos de la mascota. Volviendo a la lista.");
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
        alert("Error al guardar mascota");
      });
  };

  const onCancelClick = () => {
    navigate("/owner/pets");
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
                      <h1>{isEdit ? "Editar mascota" : "Nueva mascota"}</h1>

                      <FormGroup>
                        <RequiredLabel htmlFor="txtNombre">Nombre</RequiredLabel>
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

                      <FormGroup>
                        <RequiredLabel htmlFor="txtTipo">Tipo</RequiredLabel>
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

                      <FormGroup>
                        <Form.Label htmlFor="txtNotas">Notas</Form.Label>
                        <FormControl
                          as="textarea"
                          id="txtNotas"
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className="mt-2">
                    <Button variant="primary" type="submit">
                      Guardar
                    </Button>
                    <Button
                      variant="secondary"
                      className="ms-2"
                      onClick={onCancelClick}
                    >
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
