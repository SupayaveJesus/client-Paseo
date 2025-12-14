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
  Badge,
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
import { FaClock, FaPaw, FaStickyNote, FaPlay, FaStop } from "react-icons/fa";

const formatDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString();
};

const statusToBadge = (status) => {
  const map = {
    PENDING: "warning",
    ACCEPTED: "info",
    IN_PROGRESS: "primary",
    FINISHED: "success",
    REJECTED: "danger",
  };

  const labelMap = {
    PENDING: "PENDIENTE",
    ACCEPTED: "ACEPTADO",
    IN_PROGRESS: "EN CURSO",
    FINISHED: "FINALIZADO",
    REJECTED: "RECHAZADO",
  };

  return <Badge bg={map[status] || "secondary"}>{labelMap[status] || status}</Badge>;
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
      <div className="app-page-wrapper">
        <Container>
          {message && (
            <Alert
              variant={messageVariant}
              onClose={() => setMessage("")}
              dismissible
              className="mb-3"
            >
              {message}
            </Alert>
          )}

          <Row>
            <Col md={8}>
              <Card className="app-card-elevated">
                <Card.Body>
                  <div className="app-section-eyebrow mb-1">
                    Paseo asignado
                  </div>
                  <h2 className="app-section-title mb-3">
                    Paseo #{walk.id}
                  </h2>

                  <p>
                    <FaClock className="me-2 text-muted" />
                    <strong>Fecha / hora:</strong> {formatDate(walk.scheduledAt)}
                  </p>
                  <p>
                    <strong>Estado:</strong> {statusToBadge(walk.status)}
                  </p>
                  <p>
                    <FaPaw className="me-2 text-muted" />
                    <strong>Mascota:</strong> {walk.pet?.name}
                  </p>
                  <p>
                    <FaStickyNote className="me-2 text-muted" />
                    <strong>Notas del dueño:</strong>{" "}
                    {walk.notes || "Sin notas"}
                  </p>

                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {canStart && (
                      <Button
                        variant="success"
                        className="btn-pill-primary"
                        disabled={actionLoading}
                        onClick={handleStartWalk}
                      >
                        <FaPlay className="me-2" />
                        {actionLoading ? "Procesando..." : "Iniciar paseo"}
                      </Button>
                    )}

                    {canEnd && (
                      <Button
                        variant="danger"
                        className="btn-pill-secondary"
                        disabled={actionLoading}
                        onClick={handleEndWalk}
                      >
                        <FaStop className="me-2" />
                        {actionLoading ? "Procesando..." : "Finalizar paseo"}
                      </Button>
                    )}

                    <Button
                      variant="outline-secondary"
                      className="btn-pill-sm"
                      onClick={() => navigate("/walker/walks")}
                    >
                      Volver a mis paseos
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4} className="mt-3 mt-md-0">
              {canUploadPhoto && (
                <Card className="app-card-elevated">
                  <Card.Body>
                    <h5 className="mb-2">Subir foto del paseo</h5>
                    <p className="text-muted small">
                      Sube una o varias fotos para que el dueño vea cómo fue el
                      paseo.
                    </p>
                    <Form onSubmit={handlePhotoSubmit}>
                      <FormControl
                        type="file"
                        accept="image/*"
                        className="mb-2"
                        onChange={(e) =>
                          setPhotoFile(e.target.files[0] || null)
                        }
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        className="btn-pill-primary"
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
      </div>
    </>
  );
};

export default WalkerWalkDetailPage;
