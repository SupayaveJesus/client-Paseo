// src/pages/owner/walks/OwnerSelectWalkerPage.jsx
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Table
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import { findNearbyWalkers } from "../../../service/ownerWalkerService";

const OwnerSelectWalkerPage = () => {
  useAuthentication(true, "owner");
  const navigate = useNavigate();

  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("info");

  const fetchNearby = (lat, lng) => {
    setLoading(true);
    setMessage("");

    findNearbyWalkers(lat, lng)
      .then((data) => {
        setWalkers(data || []);
        if (!data || data.length === 0) {
          setVariant("warning");
          setMessage("No se encontraron paseadores cercanos.");
        }
      })
      .catch(() => {
        setVariant("danger");
        setMessage("Error al obtener paseadores cercanos.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Intentar usar GPS del dueño
    if (!("geolocation" in navigator)) {
      setVariant("warning");
      setMessage(
        "Tu navegador no soporta geolocalización. Se usará una ubicación por defecto."
      );
      // puedes cambiar estas coords si quieres
      fetchNearby(-17.7833, -63.1833);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchNearby(latitude, longitude);
      },
      (err) => {
        console.error(err);
        setVariant("warning");
        setMessage(
          "No se pudo obtener tu ubicación (permiso denegado o timeout). Se usará una ubicación por defecto."
        );
        fetchNearby(-17.7833, -63.1833);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000
      }
    );
  }, []);

  const formatNumber = (n) =>
    typeof n === "number" ? n.toFixed(2) : n ?? "";

  return (
    <>
      <Header />
      <Container className="mt-3">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <h2>Elegir paseador cercano</h2>
                <p>
                  Usaremos tu ubicación para mostrar paseadores cercanos que
                  están trabajando. Luego podrás ver su detalle y solicitar un paseo.
                </p>

                {message && (
                  <Alert
                    variant={variant}
                    dismissible
                    onClose={() => setMessage("")}
                  >
                    {message}
                  </Alert>
                )}

                {loading && <p>Cargando paseadores cercanos...</p>}

                <Table striped bordered hover size="sm" className="mt-2">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Rating</th>
                      <th>Costo por hora</th>
                      <th>Distancia (km)</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walkers.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No hay paseadores activos en tu zona.
                        </td>
                      </tr>
                    )}
                    {walkers.map((w) => (
                      <tr key={w.id}>
                        <td>{w.name}</td>
                        <td>{formatNumber(w.avgRating || w.rating)}</td>
                        <td>{formatNumber(w.pricePerHour)}</td>
                        <td>{formatNumber(w.distanceKm)}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() =>
                              navigate(`/owner/walkers/${w.id}`, {
                                state: { walker: w }
                              })
                            }
                          >
                            Ver detalle
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={() => navigate("/owner/walks")}
                >
                  Volver a paseos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OwnerSelectWalkerPage;
