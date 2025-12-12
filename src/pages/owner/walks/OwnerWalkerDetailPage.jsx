import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Container,
    Image,
    Row
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import { getWalkerById } from "../../../service/walkerService";

const OwnerWalkerDetailPage = () => {
    useAuthentication(true, "owner");

    const { id } = useParams();
    const navigate = useNavigate();

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
        rawRating != null
            ? `${Number(rawRating).toFixed(1)}`
            : "N/A";

    const reviewsCount = walker.reviewsCount ?? 0;

    const costPerHour =
        walker.costPerHour ??
        walker.hourlyRate ??
        walker.priceHour ??
        null;

    const costText =
        costPerHour !== null && costPerHour !== undefined
            ? `${costPerHour} Bs/hora`
            : "No especificado";

    return (
        <>
            <Header />
            <Container className="mt-3">
                <Row>
                    <Col md={8}>
                        <Card>
                            <Card.Body>
                                <h2>Detalle del paseador</h2>

                                <div className="d-flex align-items-center mb-3">
                                    {walker.photoUrl && (
                                        <Image
                                            src={`http://localhost:3000/uploads/walkers/${walker.photoUrl}`}
                                            roundedCircle
                                            width={80}
                                            height={80}
                                            className="me-3"
                                        />
                                    )}
                                    <h4 className="mb-0">{walker.name}</h4>
                                </div>

                                <p>
                                    <strong>Nombre:</strong> {walker.name}
                                </p>
                                <p>
                                    <strong>Rating promedio:</strong>{" "}
                                    {ratingText !== "N/A"
                                        ? `${ratingText} (${reviewsCount} reviews)`
                                        : "N/A"}
                                </p>

                                <p>
                                    <strong>Costo por hora:</strong> {costText}
                                </p>

                                <hr />

                                <p>
                                    Para solicitar un paseo con este paseador, continúa al
                                    formulario de creación de paseo.
                                </p>

                                <Button
                                    variant="primary"
                                    className="me-2"
                                    onClick={() =>
                                        navigate("/owner/walks/new", {
                                            state: {
                                                walkerId: walker.id,
                                                walkerName: walker.name
                                            }
                                        })
                                    }
                                >
                                    Solicitar paseo
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate("/owner/walkers/nearby")}
                                >
                                    Volver
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default OwnerWalkerDetailPage;
