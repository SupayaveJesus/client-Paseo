// src/pages/walker/WalkerWalkDetailPage.jsx
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Image,
  ListGroup,
  Row
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import { getWalkDetail, getWalkPhotos } from "../../service/walkService";
import {
  startWalk,
  endWalk,
  uploadWalkPhoto
} from "../../service/walkerService";

const BASE_URL = "http://localhost:3000";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
};

const WalkerWalkDetailPage = () => {
  useAuthentication(true, "walker");
  const { id } = useParams();
  const navigate = useNavigate();

  const [walk, setWalk] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([getWalkDetail(id), getWalkPhotos(id)])
      .then(([w, ph]) => {
        setWalk(w);
        setPhotos(ph);
      })
      .catch((err) => {
        console.error(err);
        alert("Error al cargar detalle del paseo");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onStartClick = () => {
    if (!window.confirm("¿Iniciar este paseo?")) return;
    startWalk(id)
      .then(() => {
        loadData();
      })
      .catch(() => alert("Error al iniciar el paseo"));
  };

  const onEndClick = () => {
    if (!window.confirm("¿Finalizar este paseo?")) return;
    endWalk(id)
      .then(() => {
        loadData();
      })
      .catch(() => alert("Error al finalizar el paseo"));
  };

  const onUploadSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Selecciona una foto");
      return;
    }
    setUploading(true);
    uploadWalkPhoto(id, file)
      .then(() => {
        setFile(null);
        loadData();
      })
      .catch(() => {
        alert("Error al subir la foto");
      })
      .finally(() => setUploading(false));
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="mt-3">
          <p>Cargando...</p>
        </Container>
      </>
    );
  }

  if (!walk) {
    return (
      <>
        <Header />
        <Container className="mt-3">
          <p>No se encontró el paseo.</p>
          <Button
            variant="secondary"
            onClick={() => navigate("/walker/walks")}
          >
            Volver
          </Button>
        </Container>
      </>
    );
  }

  const canStart = walk.status === "ACCEPTED";
  const canEnd = walk.status === "IN_PROGRESS";

  return (
    <>
      <Header />
      <Container className="mt-3">
        <Row>
          <Col md={8}>
            <Card>
              <Card.Body>
                <h2>Detalle del paseo #{walk.id}</h2>
                <p>
                  <strong>Fecha / hora:</strong>{" "}
                  {formatDate(walk.scheduledAt)}
                </p>
                <p>
                  <strong>Estado:</strong> {walk.status}
                </p>
                <p>
                  <strong>Mascota:</strong> {walk.pet?.name}</p>
                <p>
                  <strong>Notas del dueño:</strong>{" "}
                  {walk.notes || "Sin notas"}
                </p>

                <h5 className="mt-3">Recorrido (puntos)</h5>
                {walk.locations && walk.locations.length > 0 ? (
                  <ListGroup style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {walk.locations.map((loc) => (
                      <ListGroup.Item key={loc.id}>
                        {loc.lat}, {loc.lng} - {formatDate(loc.timestamp)}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p>Aún no hay puntos de ubicación registrados.</p>
                )}

                <div className="mt-3">
                  {canStart && (
                    <Button
                      className="me-2"
                      variant="success"
                      onClick={onStartClick}
                    >
                      Iniciar paseo
                    </Button>
                  )}
                  {canEnd && (
                    <Button
                      className="me-2"
                      variant="danger"
                      onClick={onEndClick}
                    >
                      Finalizar paseo
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/walker/walks")}
                  >
                    Volver
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mt-3 mt-md-0">
            <Card>
              <Card.Body>
                <h5>Fotos del paseo</h5>
                {photos.length === 0 && <p>No hay fotos.</p>}
                <div>
                  {photos.map((p) => (
                    <div key={p.id} className="mb-2">
                      {p.photoUrl && (
                        <Image
                          src={`${BASE_URL}/uploads/walks/${p.photoUrl}`}
                          thumbnail
                          style={{ maxWidth: "100%" }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <hr />

                <Form onSubmit={onUploadSubmit}>
                  <FormGroup className="mb-2">
                    <Form.Label>Subir nueva foto</Form.Label>
                    <FormControl
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0] || null)}
                    />
                  </FormGroup>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={uploading}
                  >
                    {uploading ? "Subiendo..." : "Subir foto"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WalkerWalkDetailPage;
