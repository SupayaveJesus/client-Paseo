// src/pages/owner/OwnerHomePage.jsx
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";

const OwnerHomePage = () => {
  useAuthentication(true, "owner"); 
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Container className="mt-3">
        <Row>
          <Col md={6} xl={4}>
            <Card>
              <Card.Body>
                <h2>Inicio - Dueño</h2>
                <p>Bienvenido a tu panel de dueño de mascota.</p>
                <div className="mt-3">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/owner/pets")}
                  >
                    Mis mascotas
                  </Button>
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => navigate("/owner/walks")}
                  >
                    Paseos
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OwnerHomePage;
