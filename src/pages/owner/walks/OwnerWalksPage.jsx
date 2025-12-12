// src/pages/owner/walks/OwnerWalksPage.jsx
import { useEffect, useState } from "react";
import {
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

const OwnerWalksPage = () => {
  useAuthentication(true, "owner");
  const navigate = useNavigate();

  const [walks, setWalks] = useState([]);

  // messages
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
    return <Badge bg={map[status] || "secondary"}>{status}</Badge>;
  };

  const currentWalks = walks.filter((w) =>
    ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(w.status)
  );
  const historyWalks = walks.filter((w) =>
    ["REJECTED", "FINISHED"].includes(w.status)
  );

  const renderPetPhoto = (walk) => {
    if (!walk.pet || !walk.pet.photoUrl) return "Sin foto";
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
      <Container className="mt-3">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <h2>Paseos</h2>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/owner/walkers/nearby")}
                  >
                    Nuevo paseo
                  </Button>

                </div>

                <h4 className="mt-3">Paseos actuales</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Fecha / hora</th>
                      <th>Mascota</th>
                      <th>Paseador</th>
                      <th>Estado</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentWalks.map((w) => (
                      <tr key={w.id}>
                        <td>{formatDate(w.scheduledAt)}</td>
                        <td>
                          {renderPetPhoto(w)}&nbsp; {w.pet?.name}
                        </td>
                        <td>{w.walker?.name || "Sin asignar"}</td>
                        <td>{getStatusBadge(w.status)}</td>
                        <td>
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(`/owner/walks/${w.id}`)
                            }
                          >
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {currentWalks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No hay paseos actuales
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <h4 className="mt-4">Historial de paseos</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Fecha / hora</th>
                      <th>Mascota</th>
                      <th>Paseador</th>
                      <th>Estado</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyWalks.map((w) => (
                      <tr key={w.id}>
                        <td>{formatDate(w.scheduledAt)}</td>
                        <td>
                          {renderPetPhoto(w)}&nbsp; {w.pet?.name}
                        </td>
                        <td>{w.walker?.name || "Sin asignar"}</td>
                        <td>{getStatusBadge(w.status)}</td>
                        <td>
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(`/owner/walks/${w.id}`)
                            }
                          >
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {historyWalks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center">
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
    </>
  );
};

export default OwnerWalksPage;
