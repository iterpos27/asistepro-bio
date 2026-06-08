export function obtenerUbicacion(options = {}) {
  const config = {
    enableHighAccuracy: true,
    timeout: 12000,
    maximumAge: 0,
    ...options,
  };

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tu navegador no soporta GPS'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          precision_metros: position.coords.accuracy,
        });
      },
      () => reject(new Error('No se pudo obtener la ubicacion GPS')),
      config,
    );
  });
}
