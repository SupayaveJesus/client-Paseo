import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";
import useWalkerAutoLocation, {
  WALKER_AVAILABILITY_STORAGE_KEY
} from "../hooks/useWalkerAutoLocation";
import "./Header.css"; 

const Header = () => {
  const { role, user, logout } = useAuthentication(false);

  const isLogged = !!role;
  const homePath =
    role === "owner"
      ? "/owner/home"
      : role === "walker"
      ? "/walker/home"
      : "/login-owner";

  const walkerAvailable =
    role === "walker" &&
    localStorage.getItem(WALKER_AVAILABILITY_STORAGE_KEY) === "true";

  useWalkerAutoLocation(walkerAvailable);

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to={homePath} className="navbar-brand">
        Paseo de Mascotas
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {role === "owner" && (
              <>
                <Nav.Link as={Link} to="/owner/pets">
                  Mascotas
                </Nav.Link>
                <Nav.Link as={Link} to="/owner/walks">
                  Paseos
                </Nav.Link>
              </>
            )}

            {role === "walker" && (
              <>
                <Nav.Link as={Link} to="/walker/walks">
                  Mis paseos
                </Nav.Link>
                <Nav.Link as={Link} to="/walker/reviews">
                  Mis reviews
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav>
            {isLogged ? (
              <>
                <Navbar.Text className="me-3">
                  {role === "owner" ? "Dueño:" : "Paseador:"}{" "}
                  <strong>{user?.name}</strong>
                </Navbar.Text>
                <Nav.Link onClick={logout}>Cerrar sesión</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login-owner">
                  Login dueño
                </Nav.Link>
                <Nav.Link as={Link} to="/login-walker">
                  Login paseador
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
