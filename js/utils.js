//utils.js: Funcions auxiliars reutilitzables.

export function generarId(item, prefijo) {
    if (!item.length) return `${prefijo}-001`;
    const ultimoId = parseInt(item[item.length - 1].id.split('-')[1]);
    console.log(`${prefijo}-${String(ultimoId + 1).padStart(3, '0')}`);
    return `${prefijo}-${String(ultimoId + 1).padStart(3, '0')}`;
}

export function guardarGeneros(generos) {
    localStorage.setItem('generos', JSON.stringify(generos));
}

export function cargarGeneros() {
    const generos = localStorage.getItem('generos');
    try {
        console.log(generos);
        return generos ? JSON.parse(generos) : [];
    } catch (error) {
        console.error('Error al cargar géneros de película:', error);
        return [];
    }
}

export function eliminarGenero(nomGenero) {
    const generos = cargarGeneros();
    const generosActualizados = [];
    generos.forEach(genero => {
        if (genero.nom !== nomGenero) {
            generosActualizados.push(genero);
        }
    });
    console.log(generosActualizados);
    guardarGeneros(generosActualizados);
}