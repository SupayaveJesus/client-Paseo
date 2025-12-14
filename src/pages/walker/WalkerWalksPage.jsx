// src/pages/walker/WalkerWalksPage.jsx
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import {
  getPendingWalks,
  getAcceptedWalks,
  getHistoryWalks,
  acceptWalk,
  rejectWalk,
} from "../../service/walkerService";
import {
  FaListUl,
  FaInbox,
  FaCheckCircle,
  FaHistory,
  FaPaw,
  FaClock,
  FaEye,
} from "react-icons/fa";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
};

const statusBadge = (status) => {
  const map = {
    PENDING: "warning",
    ACCEPTED: "info",
    REJECTED: "danger",
    IN_PROGRESS: "primary",
    FINISHED: "success",
  };
  const labelMap = {
    PENDING: "PENDIENTE",
    ACCEPTED: "ACEPTADO",
    REJECTED: "RECHAZADO",
    IN_PROGRESS: "EN CURSO",
    FINISHED: "FINALIZADO",
  };
  return <Badge bg={map[status] || "secondary"}>{labelMap[status] || status}</Badge>;
};

const WalkerWalksPage = () => {
  useAuthentication(true, "walker");
  const navigate = useNavigate();

  const [pending, setPending] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("success");

  const loadData = () => {
    setLoading(true);
    setMessage("");
    Promise.all([getPendingWalks(), getAcceptedWalks(), getHistoryWalks()])
      .then(([p, a, h]) => {
        setPending(p);
        setAccepted(a);
        setHistory(h);
      })
      .catch((err) => {
        console.error(err);
        setMessageVariant("danger");
        setMessage("Error al cargar paseos del paseador");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const onAcceptClick = (id) => {
    if (!window.confirm("¿Aceptar este paseo?")) return;
    setMessage("");
    acceptWalk(id)
      .then(() => {
        setMessageVariant("success");
        setMessage("Paseo aceptado correctamente");
        loadData();
      })
      .catch((err) => {
        console.error(err);
        setMessageVariant("danger");
        setMessage("Error al aceptar paseo");
      });
  };

  const onRejectClick = (id) => {
    if (!window.confirm("¿Rechazar este paseo?")) return;
    setMessage("");
    rejectWalk(id)
      .then(() => {
        setMessageVariant("success");
        setMessage("Paseo rechazado correctamente");
        loadData();
      })
      .catch((err) => {
        console.error(err);
        setMessageVariant("danger");
        setMessage("Error al rechazar paseo");
      });
  };

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
            <Col>
              {/* Encabezado */}
              <Card className="app-card-elevated mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="app-section-eyebrow">
                        <FaListUl className="me-1" />
                        Agenda del paseador
                      </div>
                      <h2 className="app-section-title mb-0">Mis paseos</h2>
                      <small className="text-muted">
                        Acepta solicitudes, revisa tus paseos en curso y tu historial.
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {loading && <p>Cargando...</p>}

              {/* Pendientes */}
              <Card className="app-card-elevated mb-3">
                <Card.Body>
                  <h4 className="mb-2">
                    <FaInbox className="me-2 text-warning" />
                    Solicitudes pendientes
                  </h4>
                  <Table
                    striped
                    hover
                    size="sm"
                    responsive
                    className="mt-2 app-table"
                  >
                    <thead>
                      <tr>
                        <th>
                          <FaClock className="me-1 text-muted" />
                          Fecha / hora
                        </th>
                        <th>
                          <FaPaw className="me-1 text-muted" />
                          Mascota
                        </th>
                        <th>Notas</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center text-muted">
                            No hay solicitudes pendientes.
                          </td>
                        </tr>
                      )}
                      {pending.map((w) => (
                        <tr key={w.id}>
                          <td>{formatDate(w.scheduledAt)}</td>
                          <td>{w.pet?.name}</td>
                          <td>{w.notes}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="success"
                              className="btn-pill-sm me-2"
                              onClick={() => onAcceptClick(w.id)}
                            >
                              <FaCheckCircle className="me-1" />
                              Aceptar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              className="btn-pill-sm"
                              onClick={() => onRejectClick(w.id)}
                            >
                              Rechazar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Aceptados */}
              <Card className="app-card-elevated mb-3">
                <Card.Body>
                  <h4 className="mb-2">
                    <FaCheckCircle className="me-2 text-primary" />
                    Paseos aceptados
                  </h4>
                  <Table
                    striped
                    hover
                    size="sm"
                    responsive
                    className="mt-2 app-table"
                  >
                    <thead>
                      <tr>
                        <th>
                          <FaClock className="me-1 text-muted" />
                          Fecha / hora
                        </th>
                        <th>
                          <FaPaw className="me-1 text-muted" />
                          Mascota
                        </th>
                        <th>Estado</th>
                        <th>Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accepted.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center text-muted">
                            No tienes paseos aceptados.
                          </td>
                        </tr>
                      )}
                      {accepted.map((w) => (
                        <tr key={w.id}>
                          <td>{formatDate(w.scheduledAt)}</td>
                          <td>{w.pet?.name}</td>
                          <td>{statusBadge(w.status)}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="btn-pill-sm"
                              onClick={() => navigate(`/walker/walks/${w.id}`)}
                            >
                              <FaEye className="me-1" />
                              Ver detalle
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Historial */}
              <Card className="app-card-elevated mb-4">
                <Card.Body>
                  <h4 className="mb-2">
                    <FaHistory className="me-2 text-muted" />
                    Historial de paseos
                  </h4>
                  <Table
                    striped
                    hover
                    size="sm"
                    responsive
                    className="mt-2 app-table"
                  >
                    <thead>
                      <tr>
                        <th>
                          <FaClock className="me-1 text-muted" />
                          Fecha / hora
                        </th>
                        <th>
                          <FaPaw className="me-1 text-muted" />
                          Mascota
                        </th>
                        <th>Estado</th>
                        <th>Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center text-muted">
                            No hay paseos anteriores.
                          </td>
                        </tr>
                      )}
                      {history.map((w) => (
                        <tr key={w.id}>
                          <td>{formatDate(w.scheduledAt)}</td>
                          <td>{w.pet?.name}</td>
                          <td>{statusBadge(w.status)}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="btn-pill-sm"
                              onClick={() => navigate(`/walker/walks/${w.id}`)}
                            >
                              <FaEye className="me-1" />
                              Ver detalle
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default WalkerWalksPage;
