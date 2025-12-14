// src/pages/walker/WalkerReviewsPage.jsx
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
import { getMyReviews } from "../../service/reviewService";
import { FaStar, FaPaw, FaUser, FaRoute, FaClock } from "react-icons/fa";

const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString();
};

const WalkerReviewsPage = () => {
  useAuthentication(true, "walker");

  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("info");

  useEffect(() => {
    setLoading(true);
    setMessage("");

    getMyReviews()
      .then((data) => {
        setReviews(data);
        if (!data || data.length === 0) {
          setMessageVariant("info");
          setMessage("Aún no tienes reviews.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessageVariant("danger");
        setMessage("Error al cargar reviews");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <div className="app-page-wrapper">
        <Container>
          {message && (
            <Alert
              variant={messageVariant}
              onClose={() => setMessage("")}
              dismissible
              className="mb-3"
            >
              {message}
            </Alert>
          )}

          <Row>
            <Col>
              <Card className="app-card-elevated">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="app-section-eyebrow">
                        <FaStar className="me-1" />
                        Feedback de clientes
                      </div>
                      <h2 className="app-section-title mb-0">Mis reviews</h2>
                      <small className="text-muted">
                        Aquí verás cómo evalúan los dueños tus paseos.
                      </small>
                    </div>
                    <Button
                      variant="outline-secondary"
                      className="btn-pill-sm"
                      onClick={() => navigate("/walker/home")}
                    >
                      Volver al inicio
                    </Button>
                  </div>

                  {loading && <p>Cargando...</p>}

                  {!loading && reviews.length > 0 && (
                    <Table
                      striped
                      hover
                      responsive
                      size="sm"
                      className="mt-2 app-table"
                    >
                      <thead>
                        <tr>
                          <th>
                            <FaClock className="me-1 text-muted" />
                            Fecha
                          </th>
                          <th>
                            <FaStar className="me-1 text-warning" />
                            Puntuación
                          </th>
                          <th>Comentario</th>
                          <th>
                            <FaPaw className="me-1 text-muted" />
                            Mascota
                          </th>
                          <th>
                            <FaUser className="me-1 text-muted" />
                            Cliente
                          </th>
                          <th>
                            <FaRoute className="me-1 text-muted" />
                            Paseo
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews.map((r) => (
                          <tr key={r.id}>
                            <td>{formatDate(r.createdAt)}</td>
                            <td>{r.rating}</td>
                            <td>{r.comment}</td>
                            <td>{r.walk?.pet ? r.walk.pet.name : "-"}</td>
                            <td>
                              {r.client?.name ??
                                r.walk?.owner?.name ??
                                "-"}
                            </td>
                            <td>
                              {r.walk ? (
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  className="btn-pill-sm"
                                  onClick={() =>
                                    navigate(`/walker/walks/${r.walk.id}`)
                                  }
                                >
                                  Ver paseo #{r.walk.id}
                                </Button>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default WalkerReviewsPage;
