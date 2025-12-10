import Header from "../../components/Header";
import useAuthentication from "../../hooks/useAuthentication";

const OwnerHomePage = () => {
    const { logout, user } = useAuthentication(true, "owner");

    return (
        <>
            <Header />
            <div className="container mt-3">
                <h1>Home Dueño</h1>
                <p>Bienvenido, {user?.name || "dueño"}.</p>
                <p>Aquí luego irán: Mis Mascotas y Paseos.</p>
                <button className="btn btn-outline-danger" onClick={logout}>
                    Cerrar sesión
                </button>
            </div>
        </>
    );
};

export default OwnerHomePage;
