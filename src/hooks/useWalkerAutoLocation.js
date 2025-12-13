import { useEffect, useState } from "react";
import { sendLocation } from "../service/walkerService";

export const WALKER_AVAILABILITY_STORAGE_KEY = "walker_available";

/**
 * Envia la ubicación del paseador cada 3 minutos
 * mientras `available === true`.
 *
 * Si pasas setMessage / setMessageVariant, mostrará mensajes
 * en la pantalla; si no, funciona en silencio.
 */
export default function useWalkerAutoLocation(
    available,
    { setMessage, setMessageVariant } = {}
) {
    const [sendingLocation, setSendingLocation] = useState(false);

    useEffect(() => {
        if (!available) {
            setSendingLocation(false);
            return;
        }

        if (!("geolocation" in navigator)) {
            if (setMessage && setMessageVariant) {
                setMessageVariant("danger");
                setMessage("Ubicación: tu navegador no soporta geolocalización.");
            }
            return;
        }

        let cancelled = false;

        const sendCurrentLocation = () => {
            setSendingLocation(true);

            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    if (cancelled) return;

                    const { latitude, longitude } = pos.coords;

                    try {
                        await sendLocation(latitude, longitude);

                        if (!cancelled && setMessage && setMessageVariant) {
                            setMessageVariant("success");
                            setMessage("Ubicación enviada correctamente al servidor.");
                        }
                    } catch (err) {
                        console.error("sendLocation error:", err);
                        if (!cancelled && setMessage && setMessageVariant) {
                            setMessageVariant("danger");
                            setMessage("Error al enviar la ubicación al servidor.");
                        }
                    } finally {
                        if (!cancelled) {
                            setSendingLocation(false);
                        }
                    }
                },
                (err) => {
                    if (cancelled) return;
                    console.error(err);
                    if (setMessage && setMessageVariant) {
                        setMessageVariant("danger");
                        setMessage(
                            "No se pudo obtener tu ubicación (revisa permisos de GPS)."
                        );
                    }
                    setSendingLocation(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000
                }
            );
        };


        sendCurrentLocation();
        const intervalId = setInterval(sendCurrentLocation, 3 * 60 * 1000);
        //const intervalId = setInterval(sendCurrentLocation, 10 * 1000);

        return () => {
            cancelled = true;
            clearInterval(intervalId);
        };
    }, [available, setMessage, setMessageVariant]);

    return { sendingLocation };
}
