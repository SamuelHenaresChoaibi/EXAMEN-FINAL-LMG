//pelicules.js: Gestió de la lògica de pel·lícules.
import { generarId } from "./utils.js";

export function guardarPeliculas(peliculas) {
    localStorage.setItem('peliculas', JSON.stringify(peliculas));
}

export function guardarPeliculasJSON(peliculasJSON){
    localStorage.setItem('peliculasJSON', JSON.stringify(peliculasJSON));
}

export function cargarPeliculas() {
    const peliculas = localStorage.getItem('peliculas');
    try {
        console.log(peliculas);
        return peliculas ? JSON.parse(peliculas) : [];
    } catch (error) {
        console.error('Error al cargar películas:', error);
        return [];
    }
}

export function cargarPeliculasJSON() {
    const peliculasJSON = localStorage.getItem('peliculasJSON');
    try {
        console.log(peliculasJSON);
        return peliculasJSON ? JSON.parse(peliculasJSON) : [];
    } catch (error) {
        console.error('Error al cargar películas:', error);
        return [];
    }
}

export function generarIdPelicula(peliculas) {
    return generarId(peliculas, 'movie')
}

export function eliminarPelicula(idPelicula) {
    const peliculas = cargarPeliculas();
    const peliculasActualizadas = peliculas.filter(pelicula => pelicula.id !== idPelicula);
    guardarPeliculas(peliculasActualizadas);
}

export function eliminarPeliculaJSON(idPeliculaJSON) {
    const peliculasJSON = cargarPeliculasJSON();
    const peliculasActualizadasJSON = peliculasJSON.filter(pelicula => pelicula.id !== idPeliculaJSON);
    guardarPeliculasJSON(peliculasActualizadasJSON);
}
