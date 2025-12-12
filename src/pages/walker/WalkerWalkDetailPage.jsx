// src/pages/walker/WalkerWalkDetailPage.jsx
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  Row,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import {
  getWalkerWalkDetail,
  startWalk,
  endWalk,
  uploadWalkPhoto,
} from "../../service/walkerService";

const formatDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString();
};

const WalkerWalkDetailPage = () => {
  useAuthentication(true, "walker");

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [walk, setWalk] = useState(null);

  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("success");

  const [photoFile, setPhotoFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadDetail = () => {
    setLoading(true);
    getWalkerWalkDetail(id)
      .then((data) => {
        setWalk(data);
      })
      .catch((error) => {
        console.error("getWalkerWalkDetail error:", error);
        setMessageVariant("danger");
        setMessage("Error al cargar detalle del paseo");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const canStart = walk && walk.status === "ACCEPTED";
  const canEnd = walk && walk.status === "IN_PROGRESS";
  const canUploadPhoto =
    walk && (walk.status === "IN_PROGRESS" || walk.status === "FINISHED");

  const handleStartWalk = () => {
    if (!walk) return;
    setActionLoading(true);
    setMessage("");
    startWalk(walk.id)
      .then(() => {
        setMessageVariant("success");
        setMessage("Paseo marcado como EN CURSO");
        loadDetail();
      })
      .catch((err) => {
        console.error("startWalk error:", err);
        setMessageVariant("danger");
        setMessage("No se pudo iniciar el paseo");
      })
      .finally(() => setActionLoading(false));
  };

  const handleEndWalk = () => {
    if (!walk) return;
    setActionLoading(true);
    setMessage("");
    endWalk(walk.id)
      .then(() => {
        setMessageVariant("success");
        setMessage("Paseo marcado como FINALIZADO");
        loadDetail();
      })
      .catch((err) => {
        console.error("endWalk error:", err);
        setMessageVariant("danger");
        setMessage("No se pudo finalizar el paseo");
      })
      .finally(() => setActionLoading(false));
  };

  const handlePhotoSubmit = (e) => {
    e.preventDefault();
    if (!walk || !photoFile) {
      setMessageVariant("warning");
      setMessage("Selecciona una foto primero");
      return;
    }

    setUploadingPhoto(true);
    setMessage("");
    uploadWalkPhoto(walk.id, photoFile)
      .then(() => {
        setMessageVariant("success");
        setMessage("Foto subida correctamente");
        setPhotoFile(null);
      })
      .catch((err) => {
        console.error("uploadWalkPhoto error:", err);
        setMessageVariant("danger");
        setMessage("No se pudo subir la foto");
      })
      .finally(() => setUploadingPhoto(false));
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
          <Button variant="secondary" onClick={() => navigate("/walker/walks")}>
            Volver
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt-3">
        {message && (
          <Alert
            variant={messageVariant}
            onClose={() => setMessage("")}
            dismissible
          >
            {message}
          </Alert>
        )}

        <Row>
          <Col md={8}>
            <Card>
              <Card.Body>
                <h2>Detalle del paseo #{walk.id}</h2>
                <p>
                  <strong>Fecha / hora:</strong> {formatDate(walk.scheduledAt)}
                </p>
                <p>
                  <strong>Estado:</strong> {walk.status}</p>
                <p>
                  <strong>Mascota:</strong> {walk.pet?.name}
                </p>
                <p>
                  <strong>Notas del dueño:</strong>{" "}
                  {walk.notes || "Sin notas"}
                </p>

                <div className="mt-3">
                  {canStart && (
                    <Button
                      variant="success"
                      className="me-2"
                      disabled={actionLoading}
                      onClick={handleStartWalk}
                    >
                      {actionLoading ? "Procesando..." : "Iniciar paseo"}
                    </Button>
                  )}

                  {canEnd && (
                    <Button
                      variant="danger"
                      className="me-2"
                      disabled={actionLoading}
                      onClick={handleEndWalk}
                    >
                      {actionLoading ? "Procesando..." : "Finalizar paseo"}
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
            {canUploadPhoto && (
              <Card>
                <Card.Body>
                  <h5>Subir foto del paseo</h5>
                  <Form onSubmit={handlePhotoSubmit}>
                    <FormControl
                      type="file"
                      accept="image/*"
                      className="mb-2"
                      onChange={(e) => setPhotoFile(e.target.files[0] || null)}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={uploadingPhoto || !photoFile}
                    >
                      {uploadingPhoto ? "Subiendo..." : "Subir foto"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WalkerWalkDetailPage;
