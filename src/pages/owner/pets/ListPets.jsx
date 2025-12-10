// src/pages/owner/pets/ListaMascotas.jsx
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
import Header from "../../../components/Header";
import useAuthentication from "../../../hooks/useAuthentication";
import { getPets, deletePet } from "../../../service/petService";

const ListPets = () => {
  useAuthentication(true, "owner");
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);

  const loadPets = () => {
    getPets()
      .then((data) => setPets(data))
      .catch((error) => {
        console.error(error);
        alert("Error al cargar mascotas");
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
        alert("Error al eliminar mascota");
      });
  };

  const renderPhoto = (pet) => {
    if (!pet.photoUrl) return "Sin foto";
    const base = "http://localhost:3000"; // o tu BASE_URL
    return (
      <Image
        src={`${base}/uploads/pets/${pet.photoUrl}`}
        roundedCircle
        width={48}
        height={48}
      />
    );
  };

  return (
    <>
      <Header />
      <Container className="mt-3">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <h2>Mis Mascotas</h2>
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate("/owner/pets/create", { state: { pet: null } })
                    }
                  >
                    Agregar mascota
                  </Button>
                </div>

                <Table striped bordered hover className="mt-3">
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
                        <td>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() =>
                              navigate(`/owner/pets/${pet.id}/edit`, {
                                state: { pet }
                              })
                            }
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="info"
                            className="ms-2"
                            onClick={() =>
                              navigate(`/owner/pets/${pet.id}/photo`, {
                                state: { pet }
                              })
                            }
                          >
                            Foto
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            className="ms-2"
                            onClick={() => onDeleteClick(pet.id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {pets.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No tienes mascotas registradas
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
