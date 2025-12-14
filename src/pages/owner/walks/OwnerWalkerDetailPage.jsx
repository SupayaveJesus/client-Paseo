// src/pages/owner/walks/OwnerWalkerDetailPage.jsx
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Badge
} from "react-bootstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import { getWalkerById } from "../../../service/walkerService";
import {
  FaArrowLeft,
  FaDog,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt
} from "react-icons/fa";

const OwnerWalkerDetailPage = () => {
  useAuthentication(true, "owner");

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fromWalk = location.state?.fromWalk || null;

  const [walker, setWalker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getWalkerById(id)
      .then((data) => setWalker(data))
      .catch((err) => {
        console.error(err);
        alert("Error al cargar datos del paseador");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <Container className="mt-3">
          <p>Cargando paseador...</p>
        </Container>
      </>
    );
  }

  if (!walker) {
    return (
      <>
        <Header />
        <Container className="mt-3">
          <p>No se encontró el paseador.</p>
          <Button variant="secondary" onClick={() => navigate("/owner/walks")}>
            Volver
          </Button>
        </Container>
      </>
    );
  }

  const rawRating = walker.avgRating;
  const ratingText =
    rawRating != null ? `${Number(rawRating).toFixed(1)}` : "N/A";
  const reviewsCount = walker.reviewsCount ?? 0;

  const costPerHour =
    walker.costPerHour ?? walker.hourlyRate ?? walker.priceHour ?? null;

  const costText =
    costPerHour !== null && costPerHour !== undefined
      ? `${costPerHour} Bs/hora`
      : "No especificado";

  return (
    <>
      <Header />
      <div className="app-page-wrapper">
        <Container>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <Card className="app-card-elevated">
                <Card.Body>
                  {/* Botón volver */}
                  <div className="d-flex justify-content-between mb-3">
                    <Button
                      variant="outline-secondary"
                      className="btn-pill-sm"
                      onClick={() => navigate("/owner/walkers/nearby")}
                    >
                      <FaArrowLeft className="me-1" />
                      Volver
                    </Button>
                    <div className="text-muted small d-flex align-items-center">
                      <FaCalendarAlt className="me-1" /> Paseos a demanda
                    </div>
                  </div>

                  {/* Perfil */}
                  <div className="d-flex align-items-center mb-3">
                    {walker.photoUrl ? (
                      <Image
                        src={`http://localhost:3000/uploads/walkers/${walker.photoUrl}`}
                        roundedCircle
                        width={96}
                        height={96}
                        className="me-3"
                      />
                    ) : (
                      <div className="walker-avatar-placeholder me-3">
                        <FaDog />
                      </div>
                    )}

                    <div>
                      <div className="app-section-eyebrow mb-1">
                        Paseador disponible
                      </div>
                      <h2 className="app-section-title mb-1">
                        {walker.name}
                      </h2>
                      <div className="d-flex align-items-center gap-2">
                        {ratingText !== "N/A" ? (
                          <Badge bg="warning" text="dark">
                            <FaStar className="me-1" />
                            {ratingText} ({reviewsCount} reseñas)
                          </Badge>
                        ) : (
                          <span className="text-muted small">
                            Sin reseñas aún
                          </span>
                        )}
                        <Badge bg="info" className="text-dark">
                          {costText}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <Row className="mb-3">
                    <Col md={6}>
                      <p className="mb-1 text-muted small">
                        <FaDog className="me-1" />
                        Experiencia
                      </p>
                      <p className="mb-2">
                        Amante de los perros y gatos. Paseos seguros y
                        personalizados según la energía de tu mascota.
                      </p>
                    </Col>
                    <Col md={6}>
                      <p className="mb-1 text-muted small">
                        <FaMapMarkerAlt className="me-1" />
                        Zona de trabajo
                      </p>
                      <p className="mb-2">
                        Trabaja en tu zona (datos de la última ubicación
                        conocida).
                      </p>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between">
                    <Button
                      variant="primary"
                      className="btn-pill-primary"
                      onClick={() =>
                        navigate("/owner/walks/new", {
                          state: {
                            walkerId: walker.id,
                            walkerName: walker.name,
                            fromWalk
                          }
                        })
                      }
                    >
                      Solicitar paseo con {walker.name}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="btn-pill-sm"
                      onClick={() => navigate("/owner/walkers/nearby")}
                    >
                      Elegir otro paseador
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default OwnerWalkerDetailPage;
