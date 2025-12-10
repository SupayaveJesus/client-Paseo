// src/pages/walker/WalkerHomePage.jsx
import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";

const WalkerHomePage = () => {
    const { logout, user } = useAuthentication(true, "walker");

    return (
        <>
            <Header />
            <div className="container mt-3">
                <h1>Home Paseador</h1>
                <p>Bienvenido, {user?.name || "paseador"}.</p>
                <p>Aquí luego irán: Mis Paseos, Mis Reviews y Disponibilidad.</p>
                <button className="btn btn-outline-danger" onClick={logout}>
                    Cerrar sesión
                </button>
            </div>
        </>
    );
};

export default WalkerHomePage;
