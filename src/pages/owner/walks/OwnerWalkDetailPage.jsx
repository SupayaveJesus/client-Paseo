import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  Image,
  ListGroup,
  Row
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import {
  getWalkDetail,
  getWalkPhotos,
  createWalk,
  leaveReview
} from "../../../service/walkService";
import { getPets } from "../../../service/petService";

const BASE_URL = "http://localhost:3000";

const formatDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString();
};

const OwnerWalkDetailPage = () => {
  // solo dueños logueados
  useAuthentication(true, "owner");

  const navigate = useNavigate();
  const { id } = useParams();          // "new" o un id numérico
  const isNew = id === "new" || !id;

  // ---- estado general ----
  const [loading, setLoading] = useState(!isNew);
  const [walk, setWalk] = useState(null);
  const [photos, setPhotos] = useState([]);

  // ---- estado para crear paseo ----
  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState("");
  const [savingNew, setSavingNew] = useState(false);

  // ---- estado para review ----
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  // Cargar datos
  useEffect(() => {
    // MODO NUEVO → solo mascotas
    if (isNew) {
      setLoading(false);
      setWalk(null);
      setPhotos([]);

      getPets()
        .then((data) => {
          setPets(data);
          if (data.length > 0) {
            setPetId(String(data[0].id));
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Error al cargar mascotas");
        });

      return;
    }

    // MODO DETALLE → paseo + fotos
    setLoading(true);
    Promise.all([getWalkDetail(id), getWalkPhotos(id)])
      .then(([walkData, photosData]) => {
        setWalk(walkData);
        setPhotos(photosData);
      })
      .catch((error) => {
        console.error(error);
        alert("Error al cargar detalle del paseo");
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  // ===========================
  //  HANDLER CREAR PASEO
  // ===========================
  const onNewWalkSubmit = (event) => {
    event.preventDefault();

    if (!petId || !date || !time) {
      alert("Mascota, fecha y hora son obligatorios");
      return;
    }

    const scheduledAt = new Date(`${date}T${time}:00`);

    const payload = {
      petId: Number(petId),
      scheduledAt: scheduledAt.toISOString(),
      durationMinutes: Number(durationMinutes),
      notes
    };

    setSavingNew(true);
    createWalk(payload)
      .then((created) => {
        alert("Paseo creado correctamente");
        navigate(`/owner/walks/${created.id}`);
      })
      .catch((error) => {
        console.error(error);
        alert("Error al crear el paseo");
      })
      .finally(() => setSavingNew(false));
  };

  // ===========================
  //  HANDLER REVIEW
  // ===========================
  const canReview =
    !isNew &&
    walk &&
    walk.status === "FINISHED" && // tu backend usa FINISHED
    !walk.review;

  const onReviewSubmit = (event) => {
    event.preventDefault();
    if (!walk) return;

    setLoadingReview(true);
    leaveReview(walk.id, {
      rating: Number(rating),
      comment
    })
      .then(() => {
        alert("Review guardado");
        return getWalkDetail(walk.id);
      })
      .then((updated) => setWalk(updated))
      .catch((error) => {
        console.error(error);
        alert("Error al guardar el review");
      })
      .finally(() => setLoadingReview(false));
  };

  // =====================================================
  //  RENDER MODO NUEVO  (/owner/walks/new)
  // =====================================================
  if (isNew) {
    return (
      <>
        <Header />
        <Container className="mt-3">
          <Row>
            <Col md={8}>
              <Card>
                <Card.Body>
                  <h2>Nuevo paseo</h2>
                  <p>
                    Completa el formulario para solicitar un nuevo paseo
                    para tu mascota.
                  </p>

                  <Form onSubmit={onNewWalkSubmit}>
                    <FormGroup className="mb-2">
                      <Form.Label>Mascota</Form.Label>
                      <FormControl
                        as="select"
                        value={petId}
                        onChange={(e) => setPetId(e.target.value)}
                        required
                      >
                        {pets.length === 0 && (
                          <option value="">No tienes mascotas registradas</option>
                        )}
                        {pets.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.type})
                          </option>
                        ))}
                      </FormControl>
                    </FormGroup>

                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-2">
                          <Form.Label>Fecha</Form.Label>
                          <FormControl
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-2">
                          <Form.Label>Hora</Form.Label>
                          <FormControl
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup className="mb-2">
                      <Form.Label>Duración (minutos)</Form.Label>
                      <FormControl
                        type="number"
                        min={10}
                        step={5}
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(e.target.value)}
                        required
                      />
                    </FormGroup>

                    <FormGroup className="mb-2">
                      <Form.Label>Notas para el paseador</Form.Label>
                      <FormControl
                        as="textarea"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Alérgico, agresivo, miedoso, etc."
                      />
                    </FormGroup>

                    <div className="mt-3">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={savingNew || pets.length === 0}
                      >
                        {savingNew ? "Guardando..." : "Crear paseo"}
                      </Button>
                      <Button
                        className="ms-2"
                        variant="secondary"
                        onClick={() => navigate("/owner/walks")}
                      >
                        Volver
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  // =====================================================
  //  RENDER MODO DETALLE EXISTENTE (/owner/walks/:id)
  // =====================================================
  if (loading) {
    return (
      <>
        <Header />
        <Container className="mt-3">
          <p>Cargando...</p>
        </Container>
      </>
    );
  }

  if (!walk) {
    return (
      <>
        <Header />
        <Container className="mt-3">
          <p>No se encontró el paseo.</p>
          <Button variant="secondary" onClick={() => navigate("/owner/walks")}>
            Volver
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt-3">
        <Row>
          <Col md={8}>
            <Card>
              <Card.Body>
                <h2>Detalle del paseo #{walk.id}</h2>
                <p>
                  <strong>Fecha / hora:</strong>{" "}
                  {formatDate(walk.scheduledAt)}
                </p>
                <p>
                  <strong>Estado:</strong> {walk.status}
                </p>
                <p>
                  <strong>Mascota:</strong> {walk.pet?.name}
                </p>
                <p>
                  <strong>Paseador:</strong>{" "}
                  {walk.walker ? walk.walker.name : "Sin asignar"}
                </p>
                <p>
                  <strong>Notas:</strong> {walk.notes || "Sin notas"}
                </p>

                <h5 className="mt-3">Recorrido (puntos)</h5>
                {walk.locations && walk.locations.length > 0 ? (
                  <ListGroup style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {walk.locations.map((loc) => (
                      <ListGroup.Item key={loc.id}>
                        {loc.lat}, {loc.lng} - {formatDate(loc.timestamp)}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p>No hay puntos de ubicación registrados aún.</p>
                )}

                <Button
                  className="mt-3"
                  variant="secondary"
                  onClick={() => navigate("/owner/walks")}
                >
                  Volver
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mt-3 mt-md-0">
            <Card>
              <Card.Body>
                <h5>Fotos del paseo</h5>
                {photos.length === 0 && <p>No hay fotos.</p>}
                <div>
                  {photos.map((p) => (
                    <div key={p.id} className="mb-2">
                      {p.photoUrl && (
                        <Image
                          src={`${BASE_URL}/uploads/walks/${p.photoUrl}`}
                          thumbnail
                          style={{ maxWidth: "100%" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {canReview && (
              <Card className="mt-3">
                <Card.Body>
                  <h5>Dejar review</h5>
                  <Form onSubmit={onReviewSubmit}>
                    <FormGroup className="mb-2">
                      <Form.Label>Puntuación (1 a 5)</Form.Label>
                      <FormControl
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </FormControl>
                    </FormGroup>
                    <FormGroup>
                      <Form.Label>Comentario</Form.Label>
                      <FormControl
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </FormGroup>
                    <Button
                      className="mt-2"
                      type="submit"
                      variant="primary"
                      disabled={loadingReview}
                    >
                      {loadingReview ? "Guardando..." : "Enviar review"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OwnerWalkDetailPage;
