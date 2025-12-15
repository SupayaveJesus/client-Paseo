import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";
import "./OwnerHomePage.css"; 

import { FaDog, FaCat, FaRoute, FaPaw, FaStar } from "react-icons/fa";

const OwnerHomePage = () => {
  useAuthentication(true, "owner");
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="owner-home-wrapper">
        <Container className="owner-home-container">
          <div className="owner-home-card">
            <div className="owner-home-left">
              <div className="owner-home-chip">Panel del dueño</div>

              <h1 className="owner-home-title">
                Cuida a tus <span>mascotas</span> sin complicarte.
              </h1>

              <p className="owner-home-subtitle">
                Administra tus mascotas y programa paseos en pocos pasos.
              </p>

              <div className="owner-home-actions">
                <button
                  type="button"
                  className="btn-pill btn-primary-pill"
                  onClick={() => navigate("/owner/pets")}
                >
                  <FaDog className="me-2" />
                  Mis mascotas
                </button>

                <button
                  type="button"
                  className="btn-pill btn-secondary-pill"
                  onClick={() => navigate("/owner/walks")}
                >
                  <FaRoute className="me-2" />
                  Ver paseos
                </button>
              </div>

              <div className="owner-home-tags">
                <span className="owner-home-tag">
                  <FaPaw className="me-2" />
                  Perros y gatos
                </span>
                <span className="owner-home-tag">
                  <FaRoute className="me-2" />
                  Seguimiento en mapa
                </span>
                <span className="owner-home-tag">
                  <FaStar className="me-2" />
                  Reviews de paseadores
                </span>
              </div>
            </div>

            <div className="owner-home-right">
              <div className="owner-hero-circle owner-hero-main">
                <FaDog />
              </div>
              <div className="owner-hero-circle owner-hero-small owner-hero-top">
                <FaCat />
              </div>
              <div className="owner-hero-circle owner-hero-small owner-hero-bottom">
                <FaPaw />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default OwnerHomePage;
