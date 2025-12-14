// src/pages/owner/walks/OwnerSelectWalkerPage.jsx
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
  Badge
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import { findNearbyWalkers } from "../../../service/ownerWalkerService";
import {
  FaSearchLocation,
  FaMapMarkerAlt,
  FaStar,
  FaUser,
  FaClock,
  FaEye
} from "react-icons/fa";

const OwnerSelectWalkerPage = () => {
  useAuthentication(true, "owner");
  const navigate = useNavigate();
  const location = useLocation();

  const fromWalk = location.state?.fromWalk || null;

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
    if (!("geolocation" in navigator)) {
      setVariant("warning");
      setMessage(
        "Tu navegador no soporta geolocalización. Se usará una ubicación por defecto."
      );
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
          "No se pudo obtener tu ubicación. Se usará una ubicación por defecto."
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
      <div className="app-page-wrapper">
        <Container>
          <Row>
            <Col>
              <Card className="app-card-elevated">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="app-section-eyebrow">
                        <FaSearchLocation className="me-1" />
                        Buscar paseador
                      </div>
                      <h2 className="app-section-title mb-0">
                        Paseadores cerca de ti
                      </h2>
                      <small className="text-muted">
                        Usamos tu ubicación aproximada para mostrar quién está
                        trabajando cerca.
                      </small>
                    </div>
                    <Button
                      variant="outline-secondary"
                      className="btn-pill-sm"
                      onClick={() => navigate("/owner/walks")}
                    >
                      Volver a paseos
                    </Button>
                  </div>

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

                  <Table
                    responsive
                    hover
                    size="sm"
                    className="app-table mt-2"
                  >
                    <thead>
                      <tr>
                        <th>
                          <FaUser className="me-1 text-muted" />
                          Paseador
                        </th>
                        <th>
                          <FaStar className="me-1 text-warning" />
                          Rating
                        </th>
                        <th>
                          <FaClock className="me-1 text-muted" />
                          Costo por hora
                        </th>
                        <th>
                          <FaMapMarkerAlt className="me-1 text-muted" />
                          Distancia (km)
                        </th>
                        <th>Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walkers.length === 0 && !loading && (
                        <tr>
                          <td colSpan={5} className="text-center text-muted">
                            No hay paseadores activos en tu zona.
                          </td>
                        </tr>
                      )}
                      {walkers.map((w) => (
                        <tr key={w.id}>
                          <td>{w.name}</td>
                          <td>
                            {w.avgRating || w.rating ? (
                              <Badge bg="warning" text="dark">
                                <FaStar className="me-1" />
                                {formatNumber(w.avgRating || w.rating)}
                              </Badge>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td>
                            {w.pricePerHour
                              ? `${formatNumber(w.pricePerHour)} Bs`
                              : "No especificado"}
                          </td>
                          <td>{formatNumber(w.distanceKm)}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="btn-pill-sm"
                              onClick={() =>
                                navigate(`/owner/walkers/${w.id}`, {
                                  state: { walker: w, fromWalk }
                                })
                              }
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

export default OwnerSelectWalkerPage;
