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
import { FaImage, FaUpload, FaArrowLeft } from "react-icons/fa";
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
        setMessageVariant("success");
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
      <Container className="app-page">
        <Row className="justify-content-center">
          <Col md={6} xl={5}>
            <Card className="app-card-elevated">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-2">
                    <FaImage size={24} color="#2563eb" />
                  </div>
                  <div>
                    <h2 className="app-section-title mb-0">
                      Foto de mascota
                    </h2>
                    <small className="text-muted">
                      Sube una foto clara para reconocerla fácilmente.
                    </small>
                  </div>
                </div>

                {message && (
                  <div className={`alert alert-${messageVariant || "danger"}`}>
                    {message}
                  </div>
                )}

                {currentPhotoUrl && (
                  <div className="mb-3 text-center">
                    <p className="mb-1 text-muted">Foto actual</p>
                    <Image
                      src={currentPhotoUrl}
                      roundedCircle
                      width={140}
                      height={140}
                    />
                  </div>
                )}

                <Form onSubmit={onSubmit}>
                  <Form.Group controlId="filePetPhoto" className="mb-3">
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

                  <div className="mt-3 d-flex">
                    <Button type="submit" className="btn-pill-primary">
                      <FaUpload className="me-2" />
                      Subir
                    </Button>
                    <Button
                      className="ms-2"
                      variant="outline-secondary"
                      onClick={() => navigate("/owner/pets")}
                    >
                      <FaArrowLeft className="me-1" />
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
