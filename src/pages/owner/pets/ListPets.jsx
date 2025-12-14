import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Table,
  Image
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPaw, FaEdit, FaTrashAlt, FaImage } from "react-icons/fa"; 
import Header from "../../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import { getPets, deletePet } from "../../../service/petService";

const ListPets = () => {
  useAuthentication(true, "owner");
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);

  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("");

  const loadPets = () => {
    getPets()
      .then((data) => setPets(data))
      .catch((error) => {
        console.error(error);
        setMessageVariant("danger");
        setMessage("Error al cargar mascotas");
      });
  };

  useEffect(() => {
    loadPets();
  }, []);

  const onDeleteClick = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta mascota?")) return;
    deletePet(id)
      .then(() => {
        loadPets();
      })
      .catch((error) => {
        console.error(error);
        setMessageVariant("danger");
        setMessage("Error al eliminar mascota");
      });
  };

  const renderPhoto = (pet) => {
    const base = "http://localhost:3000";

    if (!pet.photoUrl) {
      return (
        <div className="pet-avatar-placeholder">
          <FaPaw />
        </div>
      );
    }

    return (
      <Image
        src={`${base}/uploads/pets/${pet.photoUrl}`}
        roundedCircle
        width={48}
        height={48}
        alt={pet.name}
      />
    );
  };

  return (
    <>
      <Header />
      <Container className="app-page">
        <Row>
          <Col>
            <Card className="app-card-elevated">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h2 className="app-section-title">Mis mascotas</h2>
                  <Button
                    className="btn-pill-primary"
                    onClick={() =>
                      navigate("/owner/pets/create", { state: { pet: null } })
                    }
                  >
                    <FaPaw className="me-2" />
                    Agregar mascota
                  </Button>
                </div>

                <Table responsive hover className="app-table">
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Notas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pets.map((pet) => (
                      <tr key={pet.id}>
                        <td>{renderPhoto(pet)}</td>
                        <td>{pet.name}</td>
                        <td>{pet.type}</td>
                        <td>{pet.notes}</td>
                        <td className="app-actions-cell">
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() =>
                              navigate(`/owner/pets/${pet.id}/edit`, {
                                state: { pet }
                              })
                            }
                          >
                            <FaEdit className="me-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() =>
                              navigate(`/owner/pets/${pet.id}/photo`, {
                                state: { pet }
                              })
                            }
                          >
                            <FaImage className="me-1" />
                            Foto
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => onDeleteClick(pet.id)}
                          >
                            <FaTrashAlt className="me-1" />
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {pets.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          No tienes mascotas registradas.
                        </td>
                      </tr>
                    )}
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

export default ListPets;
