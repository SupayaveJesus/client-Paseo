// src/pages/walker/WalkerHomePage.jsx
import { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import { setAvailability } from "../../service/walkerService";

const WalkerHomePage = () => {
  // requiere estar logueado como walker
  useAuthentication(true, "walker");

  const navigate = useNavigate();
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  const onToggleAvailability = () => {
    const newState = !available;
    setLoading(true);
    setAvailability(newState)
      .then(() => {
        setAvailable(newState);
      })
      .catch(() => {
        alert("Error al cambiar disponibilidad");
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
                <h2>Inicio - Paseador</h2>
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WalkerHomePage;
