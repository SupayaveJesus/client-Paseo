// src/pages/walker/WalkerHomePage.jsx
import { useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import { setAvailability } from "../../service/walkerService";
import { WALKER_AVAILABILITY_STORAGE_KEY } from "../../hooks/useWalkerAutoLocation";

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

  return (
    <>
      <Header />
      <Container className="mt-3">
        <Row>
          <Col md={6}>
            <Card>
              <Card.Body>
                <h2>Inicio</h2>
                <p>
                  Desde aquí puedes gestionar tus paseos, ver tus reviews
                  y encender/apagar tu disponibilidad.
                </p>

                <div className="mb-3">
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => navigate("/walker/walks")}
                  >
                    Mis paseos
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/walker/reviews")}
                  >
                    Mis reviews
                  </Button>
                </div>

                <hr />

                <p>
                  <strong>Estado de disponibilidad:</strong>{" "}
                  {available ? "TRABAJANDO" : "DESCONECTADO"}
                </p>
                <Button
                  variant={available ? "danger" : "success"}
                  onClick={onToggleAvailability}
                  disabled={loading}
                >
                  {loading
                    ? "Guardando..."
                    : available
                    ? "Apagar disponibilidad"
                    : "Encender disponibilidad"}
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WalkerHomePage;
