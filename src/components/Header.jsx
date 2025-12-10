// src/components/Header.jsx
import { Container, Navbar } from "react-bootstrap";

const Header = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand>App Paseo de Mascotas</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default Header;
