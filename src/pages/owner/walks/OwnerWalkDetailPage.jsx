// src/pages/owner/walks/OwnerWalkDetailPage.jsx
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  Image,
  ListGroup,
  Row,
  Alert
} from "react-bootstrap";
import {
  FaRoute,
  FaDog,
  FaUserTie,
  FaArrowLeft,
  FaStar,
  FaCalendarAlt,
  FaClock,
  FaCamera,
  FaMapMarkedAlt
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import {
  getWalkDetail,
  getWalkPhotos,
  createWalk,
  leaveReview
} from "../../../service/walkService";
import { getPets } from "../../../service/petService";

import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader
} from "@react-google-maps/api";

const BASE_URL = "http://localhost:3000";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const formatDate = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleString();
};

const formatTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};


const WalkRouteMap = ({ locations }) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Alert variant="warning" className="mt-2">
        Para ver el mapa del recorrido configura{" "}
        <code>VITE_GOOGLE_MAPS_API_KEY</code>.
      </Alert>
    );
  }

  if (!locations || locations.length === 0) {
    return null;
  }

  const path = locations.map((loc) => ({
    lat: Number(loc.lat),
    lng: Number(loc.lng)
  }));

  const center = path[path.length - 1];
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) {
    return (
      <Alert variant="info" className="mt-2">
        Cargando mapa...
      </Alert>
    );
  }

  return (
    <div
      className="mt-2 mb-3"
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #e5e7eb"
      }}
    >
      <GoogleMap
        center={center}
        zoom={16}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{ disableDefaultUI: true, gestureHandling: "greedy" }}
      >
        <Polyline
          path={path}
          options={{ strokeColor: "#2563eb", strokeOpacity: 0.9, strokeWeight: 4 }}
        />
        <Marker position={path[0]} label="Inicio" />
        <Marker position={path[path.length - 1]} label="Fin" />
      </GoogleMap>
    </div>
  );
};

const OwnerWalkDetailPage = () => {
  useAuthentication(true, "owner");

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isNew = id === "new" || !id;

  const [loading, setLoading] = useState(!isNew);
  const [walk, setWalk] = useState(null);
  const [photos, setPhotos] = useState([]);

  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("");

  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState("");
  const [savingNew, setSavingNew] = useState(false);

  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);

  const preselectedWalker = location.state?.walkerName;
  const preselectedWalkerId = location.state?.walkerId;

  useEffect(() => {
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
          setMessageVariant("danger");
          setMessage("Error al cargar mascotas");
        });

      return;
    }

    setLoading(true);
    Promise.all([getWalkDetail(id), getWalkPhotos(id)])
      .then(([walkData, photosData]) => {
        setWalk(walkData);
        setPhotos(photosData);
      })
      .catch((error) => {
        console.error(error);
        setMessageVariant("danger");
        setMessage("Error al cargar detalles del paseo");
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  // ---------- Auto-refresh cada 60s ----------
  useEffect(() => {
    if (isNew) return;
    if (!walk) return;

    if (walk.status !== "ACCEPTED" && walk.status !== "IN_PROGRESS") return;

    const intervalId = setInterval(() => {
      getWalkDetail(id)
        .then((walkData) => {
          setWalk(walkData);
        })
        .catch((err) => {
          console.error("Auto-refresh walk detail error:", err);
        });
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [id, isNew, walk?.status]);

  // ---------- Crear nuevo paseo ----------
  const onNewWalkSubmit = (event) => {
    event.preventDefault();

    if (!petId || !date || !time) {
      setMessageVariant("danger");
      setMessage("Mascota, fecha y hora son obligatorios");
      return;
    }

    const scheduledAt = new Date(`${date}T${time}:00`);

    const payload = {
      petId: Number(petId),
      scheduledAt: scheduledAt.toISOString(),
      durationMinutes: Number(durationMinutes),
      notes
    };

    if (preselectedWalkerId) {
      payload.walkerId = preselectedWalkerId;
    }

    setSavingNew(true);
    createWalk(payload)
      .then((created) => {
        setMessageVariant("success");
        setMessage("Paseo creado correctamente");
        navigate(`/owner/walks/${created.id}`);
      })
      .catch((error) => {
        console.error(error);
        setMessageVariant("danger");
        setMessage("Error al crear el paseo");
      })
      .finally(() => setSavingNew(false));
  };

  // ---------- Review ----------
  const canReview =
    !isNew && walk && walk.status === "FINISHED" && !walk.review;

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

  // ---------- Render: nuevo paseo ----------
  if (isNew) {
    return (
      <>
        <Header />
        <Container className="app-page">
          {message && (
            <Alert
              variant={messageVariant || "info"}
              onClose={() => setMessage("")}
              dismissible
            >
              {message}
            </Alert>
          )}

          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="app-card-elevated">
                <Card.Body>
                  <div className="d-flex align-items-center mb-2">
                    <FaRoute className="me-2 text-primary" />
                    <h2 className="app-section-title mb-0">Nuevo paseo</h2>
                  </div>
                  <p className="text-muted">
                    Completa el formulario para solicitar un nuevo paseo
                    para tu mascota.
                  </p>

                  {preselectedWalker && (
                    <p>
                      <FaUserTie className="me-1" />
                      <strong>Paseador seleccionado:</strong> {preselectedWalker}{" "}
                      (ID {preselectedWalkerId})
                    </p>
                  )}

                  <Form onSubmit={onNewWalkSubmit}>
                    <Form.Group className="mb-2">
                      <Form.Label>
                        <FaDog className="me-1" />
                        Mascota
                      </Form.Label>
                      <FormControl
                        as="select"
                        value={petId}
                        onChange={(e) => setPetId(e.target.value)}
                        required
                      >
                        {pets.length === 0 && (
                          <option value="">
                            No tienes mascotas registradas
                          </option>
                        )}
                        {pets.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.type})
                          </option>
                        ))}
                      </FormControl>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label>
                            <FaCalendarAlt className="me-1" />
                            Fecha
                          </Form.Label>
                          <FormControl
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-2">
                          <Form.Label>
                            <FaClock className="me-1" />
                            Hora
                          </Form.Label>
                          <FormControl
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-2">
                      <Form.Label>Duración (minutos)</Form.Label>
                      <FormControl
                        type="number"
                        min={10}
                        step={5}
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Notas para el paseador</Form.Label>
                      <FormControl
                        as="textarea"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Alérgico, agresivo, miedoso, etc."
                      />
                    </Form.Group>

                    <div className="mt-3">
                      <Button
                        type="submit"
                        className="btn-pill-primary"
                        disabled={savingNew || pets.length === 0}
                      >
                        {savingNew ? "Guardando..." : "Crear paseo"}
                      </Button>
                      <Button
                        className="ms-2 rounded-pill"
                        variant="outline-secondary"
                        onClick={() => navigate("/owner/walks")}
                      >
                        <FaArrowLeft className="me-1" />
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

  // ---------- Render: detalle ----------
  if (loading) {
    return (
      <>
        <Header />
        <Container className="app-page">
          <p>Cargando...</p>
        </Container>
      </>
    );
  }

  if (!walk) {
    return (
      <>
        <Header />
        <Container className="app-page">
          <p>No se encontró el paseo.</p>
          <Button
            variant="outline-secondary"
            className="rounded-pill mt-2"
            onClick={() => navigate("/owner/walks")}
          >
            <FaArrowLeft className="me-1" />
            Volver
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="app-page">
        {message && (
          <Alert
            variant={messageVariant || "info"}
            onClose={() => setMessage("")}
            dismissible
          >
            {message}
          </Alert>
        )}

        <Row>
          <Col md={8}>
            <Card className="app-card-elevated">
              <Card.Body>
                <div className="d-flex align-items-center mb-2">
                  <FaRoute className="me-2 text-primary" />
                  <h2 className="app-section-title mb-0">
                    Detalle del paseo #{walk.id}
                  </h2>
                </div>

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

                <h5 className="mt-3">
                  <FaMapMarkedAlt className="me-1" />
                  Recorrido
                </h5>

                <WalkRouteMap locations={walk.locations} />

                {walk.locations && walk.locations.length > 0 ? (
                  <ListGroup style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {walk.locations.map((loc, index) => (
                      <ListGroup.Item
                        key={loc.id}
                        className="d-flex justify-content-between align-items-center"
                        title={`${loc.lat}, ${loc.lng}`} // tooltip con coords
                      >
                        <div>
                          <strong>Punto {index + 1}</strong>
                          <div className="text-muted small">
                            Actualización del recorrido
                          </div>
                        </div>
                        <span className="text-muted small">
                          {formatDate(loc.timestamp)} ({formatTime(loc.timestamp)})
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted">
                    No hay puntos de ubicación registrados aún.
                  </p>
                )}

                <Button
                  className="mt-3 rounded-pill"
                  variant="outline-secondary"
                  onClick={() => navigate("/owner/walks")}
                >
                  <FaArrowLeft className="me-1" />
                  Volver
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mt-3 mt-md-0">
            <Card className="app-card-elevated mb-3">
              <Card.Body>
                <h5>
                  <FaCamera className="me-1" />
                  Fotos del paseo
                </h5>
                {photos.length === 0 && (
                  <p className="text-muted">No hay fotos.</p>
                )}
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
              <Card className="app-card-elevated">
                <Card.Body>
                  <h5>
                    <FaStar className="me-1 text-warning" />
                    Dejar review
                  </h5>
                  <Form onSubmit={onReviewSubmit}>
                    <Form.Group className="mb-2">
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
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Comentario</Form.Label>
                      <FormControl
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      className="mt-2 btn-pill-primary"
                      type="submit"
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
