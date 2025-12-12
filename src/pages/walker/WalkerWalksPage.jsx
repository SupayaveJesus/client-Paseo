import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
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

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
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

        <h2>Mis paseos (Paseador)</h2>

        {loading && <p>Cargando...</p>}

        <Card className="mt-3">
          <Card.Body>
            <h4>Solicitudes pendientes</h4>
            <Table striped bordered hover size="sm" className="mt-2">
              <thead>
                <tr>
                  <th>Fecha / hora</th>
                  <th>Mascota</th>
                  <th>Notas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pending.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center">
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
                        className="me-2"
                        onClick={() => onAcceptClick(w.id)}
                      >
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
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

        <Card className="mt-3">
          <Card.Body>
            <h4>Paseos aceptados</h4>
            <Table striped bordered hover size="sm" className="mt-2">
              <thead>
                <tr>
                  <th>Fecha / hora</th>
                  <th>Mascota</th>
                  <th>Estado</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {accepted.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No tienes paseos aceptados.
                    </td>
                  </tr>
                )}
                {accepted.map((w) => (
                  <tr key={w.id}>
                    <td>{formatDate(w.scheduledAt)}</td>
                    <td>{w.pet?.name}</td>
                    <td>{w.status}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/walker/walks/${w.id}`)}
                      >
                        Ver detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Card className="mt-3 mb-4">
          <Card.Body>
            <h4>Historial de paseos</h4>
            <Table striped bordered hover size="sm" className="mt-2">
              <thead>
                <tr>
                  <th>Fecha / hora</th>
                  <th>Mascota</th>
                  <th>Estado</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No hay paseos anteriores.
                    </td>
                  </tr>
                )}
                {history.map((w) => (
                  <tr key={w.id}>
                    <td>{formatDate(w.scheduledAt)}</td>
                    <td>{w.pet?.name}</td>
                    <td>{w.status}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/walker/walks/${w.id}`)}
                      >
                        Ver detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default WalkerWalksPage;
