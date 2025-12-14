// src/pages/owner/walks/OwnerWalksPage.jsx
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
  Image
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import { getOwnerWalks } from "../../../service/walkService";

import {
  FaPlusCircle,
  FaRoute,
  FaClock,
  FaPaw,
  FaUser,
  FaEye
} from "react-icons/fa";

const OwnerWalksPage = () => {
  useAuthentication(true, "owner");
  const navigate = useNavigate();

  const [walks, setWalks] = useState([]);
  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("");

  useEffect(() => {
    getOwnerWalks()
      .then((data) => setWalks(data))
      .catch(() => {
        setMessageVariant("danger");
        setMessage("Error al cargar paseos");
      });
  }, []);

  const base = "http://localhost:3000";

  const getStatusBadge = (status) => {
    const map = {
      PENDING: "warning",
      ACCEPTED: "info",
      REJECTED: "danger",
      IN_PROGRESS: "primary",
      FINISHED: "success"
    };

    const labelMap = {
      PENDING: "PENDIENTE",
      ACCEPTED: "ACEPTADO",
      REJECTED: "RECHAZADO",
      IN_PROGRESS: "EN CURSO",
      FINISHED: "FINALIZADO"
    };

    return (
      <Badge bg={map[status] || "secondary"}>
        {labelMap[status] || status}
      </Badge>
    );
  };

  const currentWalks = walks.filter((w) =>
    ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(w.status)
  );
  const historyWalks = walks.filter((w) =>
    ["REJECTED", "FINISHED"].includes(w.status)
  );

  const renderPetPhoto = (walk) => {
    if (!walk.pet || !walk.pet.photoUrl) {
      return (
        <div className="pet-avatar-placeholder">
          <FaPaw />
        </div>
      );
    }
    return (
      <Image
        src={`${base}/uploads/pets/${walk.pet.photoUrl}`}
        roundedCircle
        width={40}
        height={40}
      />
    );
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <>
      <Header />
      <div className="app-page-wrapper">
        <Container>
          {message && (
            <Alert
              variant={messageVariant || "info"}
              dismissible
              onClose={() => setMessage("")}
              className="mb-3"
            >
              {message}
            </Alert>
          )}

          <Row>
            <Col>
              <Card className="app-card-elevated">
                <Card.Body>
                  {/* Encabezado */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="app-section-eyebrow">
                        <FaRoute className="me-1" />
                        Panel de paseos
                      </div>
                      <h2 className="app-section-title mb-0">
                        Paseos de mis mascotas
                      </h2>
                      <small className="text-muted">
                        Revisa tus paseos en curso y el historial de salidas.
                      </small>
                    </div>
                    <Button
                      className="btn-pill-primary"
                      onClick={() => navigate("/owner/walkers/nearby")}
                    >
                      <FaPlusCircle className="me-2" />
                      Nuevo paseo
                    </Button>
                  </div>

                  {/* Paseos actuales */}
                  <h5 className="mt-3 mb-2">Paseos actuales</h5>
                  <Table responsive hover className="app-table">
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
                        <th>
                          <FaUser className="me-1 text-muted" />
                          Paseador
                        </th>
                        <th>Estado</th>
                        <th>Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentWalks.map((w) => (
                        <tr key={w.id}>
                          <td>{formatDate(w.scheduledAt)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              {renderPetPhoto(w)}
                              <span className="ms-2">{w.pet?.name}</span>
                            </div>
                          </td>
                          <td>{w.walker?.name || "Sin asignar"}</td>
                          <td>{getStatusBadge(w.status)}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="btn-pill-sm"
                              onClick={() =>
                                navigate(`/owner/walks/${w.id}`)
                              }
                            >
                              <FaEye className="me-1" />
                              Ver
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {currentWalks.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-muted">
                            No hay paseos actuales
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  {/* Historial */}
                  <h5 className="mt-4 mb-2">Historial de paseos</h5>
                  <Table responsive hover className="app-table">
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
                        <th>
                          <FaUser className="me-1 text-muted" />
                          Paseador
                        </th>
                        <th>Estado</th>
                        <th>Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyWalks.map((w) => (
                        <tr key={w.id}>
                          <td>{formatDate(w.scheduledAt)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              {renderPetPhoto(w)}
                              <span className="ms-2">{w.pet?.name}</span>
                            </div>
                          </td>
                          <td>{w.walker?.name || "Sin asignar"}</td>
                          <td>{getStatusBadge(w.status)}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="btn-pill-sm"
                              onClick={() =>
                                navigate(`/owner/walks/${w.id}`)
                              }
                            >
                              <FaEye className="me-1" />
                              Ver
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {historyWalks.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center text-muted">
                            No hay paseos anteriores
                          </td>
                        </tr>
                      )}
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

export default OwnerWalksPage;
