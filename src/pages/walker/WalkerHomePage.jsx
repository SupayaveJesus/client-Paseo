import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import { setAvailability, sendLocation } from "../../service/walkerService";

const STORAGE_KEY = "walker_available";

const WalkerHomePage = () => {
  useAuthentication(true, "walker");

  const navigate = useNavigate();

  const [available, setAvailable] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "true"; 
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("info");
  const [sendingLocation, setSendingLocation] = useState(false);

  const onToggleAvailability = () => {
    const newState = !available;
    setLoading(true);
    setMessage("");

    setAvailability(newState)
      .then(() => {
        setAvailable(newState);
        localStorage.setItem(STORAGE_KEY, String(newState)); // 🔹 persistir

        setMessageVariant("success");
        setMessage(
          newState
            ? "Disponibilidad encendida. Empezaremos a enviar tu ubicación periódicamente."
            : "Disponibilidad apagada. Se detuvo el envío de ubicación."
        );
      })
      .catch((err) => {
        console.error(err);
        setMessageVariant("danger");
        setMessage("Error al cambiar disponibilidad.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!available) {
      setSendingLocation(false);
      return;
    }

    if (!("geolocation" in navigator)) {
      setMessageVariant("danger");
      setMessage("Ubicación: tu navegador no soporta geolocalización.");
      return;
    }

    let cancelled = false;

    const sendCurrentLocation = () => {
      setSendingLocation(true);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (cancelled) return;

          const { latitude, longitude } = pos.coords;
          try {
            await sendLocation(latitude, longitude);
            setMessageVariant("success");
            setMessage("Ubicación enviada correctamente al servidor.");
          } catch (err) {
            console.error(err);
            setMessageVariant("danger");
            setMessage("Error al enviar la ubicación al servidor.");
          } finally {
            if (!cancelled) setSendingLocation(false);
          }
        },
        (err) => {
          if (cancelled) return;
          console.error(err);
          setMessageVariant("danger");
          setMessage(
            "No se pudo obtener tu ubicación (revisa permisos de GPS)."
          );
          setSendingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      );
    };

    sendCurrentLocation();
    const intervalId = setInterval(sendCurrentLocation, 3 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [available]);

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
                    {available && sendingLocation && (
                      <span> (enviando ubicación...)</span>
                    )}
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
