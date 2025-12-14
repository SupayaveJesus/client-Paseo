// src/pages/walker/WalkerHomePage.jsx
import { useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import { setAvailability } from "../../service/walkerService";
import { WALKER_AVAILABILITY_STORAGE_KEY } from "../../hooks/useWalkerAutoLocation";
import {
  FaWalking,
  FaStar,
  FaToggleOn,
  FaToggleOff,
  FaRoute,
} from "react-icons/fa";

const WalkerHomePage = () => {
  useAuthentication(true, "walker");

  const navigate = useNavigate();

  const [available, setAvailable] = useState(() => {
    const stored = localStorage.getItem(WALKER_AVAILABILITY_STORAGE_KEY);
    return stored === "true";
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("info");

  const onToggleAvailability = () => {
    const newState = !available;
    setLoading(true);
    setMessage("");

    setAvailability(newState)
      .then(() => {
        setAvailable(newState);
        localStorage.setItem(
          WALKER_AVAILABILITY_STORAGE_KEY,
          String(newState)
        );

        setMessageVariant("success");
        setMessage(
          newState
            ? "Disponibilidad encendida. Se enviará tu ubicación periódicamente."
            : "Disponibilidad apagada. Se detendrá el envío de ubicación."
        );
      })
      .catch((err) => {
        console.error(err);
        setMessageVariant("danger");
        setMessage("Error al cambiar disponibilidad.");
      })
      .finally(() => setLoading(false));
  };

  const statusText = available ? "TRABAJANDO" : "DESCONECTADO";

  return (
    <>
      <Header />
      <div className="app-page-wrapper">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={9}>
              <Card className="app-card-elevated">
                <Card.Body>
                  <Row className="align-items-center">
                    {/* Texto principal */}
                    <Col md={7}>
                      <div className="app-section-eyebrow mb-1">
                        <FaWalking className="me-1" />
                        Panel del paseador
                      </div>
                      <h2 className="app-section-title mb-2">
                        Pasea perritos y gana dinero extra.
                      </h2>
                      <p className="text-muted mb-3">
                        Desde aquí gestionas tus paseos, revisas las opiniones
                        de los dueños y activas tu estado de trabajo.
                      </p>

                      <div className="mb-3 d-flex flex-wrap gap-2">
                        <Button
                          className="btn-pill-primary"
                          onClick={() => navigate("/walker/walks")}
                        >
                          <FaRoute className="me-2" />
                          Mis paseos
                        </Button>
                        <Button
                          variant="outline-primary"
                          className="btn-pill-secondary"
                          onClick={() => navigate("/walker/reviews")}
                        >
                          <FaStar className="me-2" />
                          Mis reviews
                        </Button>
                      </div>

                      <hr />

                      <p className="mb-2">
                        <strong>Estado de disponibilidad:</strong>{" "}
                        <span className={available ? "text-success" : "text-muted"}>
                          {statusText}
                        </span>
                      </p>

                      <Button
                        variant={available ? "outline-danger" : "outline-success"}
                        className="btn-pill-secondary"
                        onClick={onToggleAvailability}
                        disabled={loading}
                      >
                        {loading ? (
                          "Guardando..."
                        ) : available ? (
                          <>
                            <FaToggleOff className="me-2" />
                            Apagar disponibilidad
                          </>
                        ) : (
                          <>
                            <FaToggleOn className="me-2" />
                            Encender disponibilidad
                          </>
                        )}
                      </Button>

                      {message && (
                        <Alert
                          variant={messageVariant}
                          className="mt-3"
                          dismissible
                          onClose={() => setMessage("")}
                        >
                          {message}
                        </Alert>
                      )}
                    </Col>

                    {/* Lado derecho: ilustración simple */}
                    <Col
                      md={5}
                      className="mt-4 mt-md-0 d-flex justify-content-center"
                    >
                      <div className="owner-home-right">
                        <div className="owner-hero-circle owner-hero-main">
                          <FaWalking />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default WalkerHomePage;
