// src/pages/owner/pets/FotoPerfilMascota.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  Row,
  Image
} from "react-bootstrap";
import Header from "../../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import { uploadPetPhoto } from "../../../service/petService";

const PhotoProfilePets = () => {
  useAuthentication(true, "owner");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const petFromState = location.state?.pet || null;

  const [file, setFile] = useState(null);

  // messages
  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("");

  useEffect(() => {
    if (!petFromState) {
      setMessageVariant("danger");
      setMessage("No se encontraron datos de la mascota. Volviendo a la lista.");
      navigate("/owner/pets");
    }
  }, [petFromState, navigate]);

  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!file) {
      setMessageVariant("danger");
      setMessage("Debes seleccionar una imagen");
      return;
    }

    uploadPetPhoto(id, file)
      .then(() => {
        setMessageVariant("danger");
        setMessage("Foto actualizada");
        navigate("/owner/pets");
      })
      .catch((error) => {
        console.error(error);
        setMessageVariant("danger");
        setMessage("Error al subir foto");
      });
  };

  const base = "http://localhost:3000";
  const currentPhotoUrl = petFromState?.photoUrl
    ? `${base}/uploads/pets/${petFromState.photoUrl}`
    : null;

  return (
    <>
      <Header />
      <Container className="mt-3">
        <Row>
          <Col md={6} xl={4}>
            <Card>
              <Card.Body>
                <h2>Foto de mascota</h2>
                {currentPhotoUrl && (
                  <div className="mb-3">
                    <p>Foto actual:</p>
                    <Image src={currentPhotoUrl} rounded width={120} />
                  </div>
                )}
                <Form onSubmit={onSubmit}>
                  <Form.Group controlId="filePetPhoto">
                    <Form.Label>Nueva foto</Form.Label>
                    <FormControl
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setFile(e.target.files[0]);
                        } else {
                          setFile(null);
                        }
                      }}
                    />
                  </Form.Group>

                  <div className="mt-3">
                    <Button type="submit" variant="primary">
                      Subir
                    </Button>
                    <Button
                      className="ms-2"
                      variant="secondary"
                      onClick={() => navigate("/owner/pets")}
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

export default PhotoProfilePets;
