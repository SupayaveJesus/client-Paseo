// src/pages/walker/WalkerReviewsPage.jsx
import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Table
} from "react-bootstrap";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import { getMyReviews } from "../../service/reviewService";

const WalkerReviewsPage = () => {
  useAuthentication(true, "walker");

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMyReviews()
      .then((data) => setReviews(data))
      .catch((err) => {
        console.error(err);
        alert("Error al cargar reviews");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <Container className="mt-3">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <h2>Mis reviews</h2>
                {loading && <p>Cargando...</p>}
                <Table striped bordered hover size="sm" className="mt-2">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Puntuación</th>
                      <th>Comentario</th>
                      <th>ID Paseo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.length === 0 && !loading && (
                      <tr>
                        <td colSpan={4} className="text-center">
                          Aún no tienes reviews.
                        </td>
                      </tr>
                    )}
                    {reviews.map((r) => (
                      <tr key={r.id}>
                        <td>
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleString()
                            : ""}
                        </td>
                        <td>{r.rating}</td>
                        <td>{r.comment}</td>
                        <td>{r.walkId}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default WalkerReviewsPage;
