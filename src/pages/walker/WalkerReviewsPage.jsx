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

        <Row>
          <Col>
            <Card>
              <Card.Body>
                <h2>Mis reviews</h2>

                {loading && <p>Cargando...</p>}

                {!loading && reviews.length > 0 && (
                  <Table striped bordered hover size="sm" className="mt-2">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Puntuación</th>
                        <th>Comentario</th>
                        <th>Mascota</th>
                        <th>Cliente</th>
                        <th>Paseo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((r) => (
                        <tr key={r.id}>
                          <td>{formatDate(r.createdAt)}</td>
                          <td>{r.rating}</td>
                          <td>{r.comment}</td>
                          <td>
                            {r.walk?.pet
                              ? r.walk.pet.name
                              : "-"}
                          </td>
                          <td>
                            {r.client?.name ??
                              r.walk?.owner?.name ??
                              "-"}
                          </td>
                          <td>
                            {r.walk ? (
                              <Button
                                size="sm"
                                variant="primary"
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
    </>
  );
};

export default WalkerReviewsPage;
