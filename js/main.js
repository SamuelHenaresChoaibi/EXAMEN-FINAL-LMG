//main.js: Gestió principal de la pàgina d’inici.

import { Genere, Pelicula } from './classes.js';
import { cargarPeliculas, cargarPeliculasJSON, eliminarPelicula, eliminarPeliculaJSON, guardarPeliculasJSON, guardarPeliculas} from './pelicules.js';
import { cargarGeneros, guardarGeneros,  } from './utils.js';


document.addEventListener('DOMContentLoaded', () => {
    const archivoInput = document.getElementById('film-input');
    const pelisPendientes = document.getElementById('pending-films');
    const pelisCompletadas = document.getElementById('completed-films');
    const botonSubirArchivo = document.getElementById('upload-films');
    const filtroPendientes = document.getElementById('filtro-pendientes');
    const filtroCompletas = document.getElementById('filtro-completas');

    function crearPeliculaHTML(pelicula) {
        const prioridadColor = pelicula.prioritat === 'Alta' ? 'bg-red-200' :
                              pelicula.prioritat === 'Mitjana' ? 'bg-yellow-200' : 'bg-green-200';

        const paraVer = pelicula.perVeure ? 'Sí' : 'No';
        const vista = pelicula.vista ? 'Sí' : 'No';
        const favorita = pelicula.favorita ? 'Sí' : 'No';

        const li = document.createElement('li');
        li.className = `flex justify-between items-center p-2 border-b ${prioridadColor} rounded-lg`;
        li.innerHTML = `
            <div class="flex-column">
                <span><b>Título: </b>${pelicula.titol}</span>
                <p><b>Género: </b>${pelicula.genere}</p>
                <p><b>Prioridad: </b>${pelicula.prioritat}</p>
                <p><b>Para ver: </b>${paraVer}</p>
                <p><b>Vista: </b>${vista}</p>
                <p><b>Favorita: </b>${favorita}</p>
                ${!pelicula.perVeure ? `
                    <p><b>Fecha de visualización: </b>${pelicula.dataVisualitzacio || 'Sin fecha de visualización'}</p>
                    <p><b>Opinión: </b>${pelicula.opinio || 'Sin reseña'}</p>
                ` : ''}
            </div>
            <div class="flex space-x-2">
                <button class="mark-film transition-all duration-300 hover:bg-blue-400 hover:text-white px-2 py-1 rounded" data-id="${pelicula.id}" data-title="${pelicula.titol}">
                    ${pelicula.vista ? '✓' : '▢'}
                </button>
                <button class="delete-film transition-all duration-300 hover:bg-red-600 text-white px-2 py-1 rounded" data-id="${pelicula.id}" data-title="${pelicula.titol}">
                    🗑️
                </button>
            </div>
        `;
        return li;
    }

    function cargarFiltros() {
        const generos = cargarGeneros();
        filtroPendientes.innerHTML = '<option value="Todas">Todas</option>';
        filtroCompletas.innerHTML = '<option value="Todas">Todas</option>';
        generos.forEach(genero => {
            const optionPendiente = document.createElement('option');
            const optionCompleta = document.createElement('option');
            optionPendiente.value = genero.nom;
            optionPendiente.textContent = genero.nom;
            optionCompleta.value = genero.nom;
            optionCompleta.textContent = genero.nom;
            filtroPendientes.appendChild(optionPendiente);
            filtroCompletas.appendChild(optionCompleta);
        });
    }

    function cargarListaPeliculas(filtroPendientes = 'Todas', filtroCompletas = 'Todas') {
        const peliculas = cargarPeliculas();
        const peliculasJSON = cargarPeliculasJSON();

        if (!archivoInput || !pelisPendientes || !pelisCompletadas || !botonSubirArchivo) {
            console.error('Campos incompletos');
            return;
        }

        pelisPendientes.innerHTML = '';
        pelisCompletadas.innerHTML = '';

        const todasPeliculas = peliculas.concat(peliculasJSON);;

        todasPeliculas.forEach(pelicula => {
            const li = crearPeliculaHTML(pelicula);
            if (pelicula.vista) {
                if (filtroCompletas === 'Todas' || pelicula.genere === filtroCompletas) {
                    pelisPendientes.appendChild(li);
                }
            } else {
                if (filtroPendientes === 'Todas' || pelicula.genere === filtroPendientes) {
                    pelisCompletadas.appendChild(li);
                }
            }
        });

        document.querySelectorAll('.mark-film').forEach(boton => {
            boton.addEventListener('click', () => {
                const id = boton.dataset.id;
                const title = boton.dataset.title;
                const peliculas = cargarPeliculas();
                const peliculasJSON = cargarPeliculasJSON();

                peliculas.forEach(p => {
                    if (p.id === id && p.titol === title) {
                        p.vista = !p.vista;
                    }
                });

                peliculasJSON.forEach(p => {
                    if (p.id === id && p.titol === title) {
                        p.vista = !p.vista;
                    }
                });

                guardarPeliculas(peliculas);
                guardarPeliculasJSON(peliculasJSON);
                cargarListaPeliculas(filtroPendientes, filtroCompletas);
            });
        });

        document.querySelectorAll('.delete-film').forEach(boton => {
            boton.addEventListener('click', () => {
                const id = boton.dataset.id;
                const title = boton.dataset.title;
                const peliculas = cargarPeliculas();
                const peliculasJSON = cargarPeliculasJSON();

                let existePelicula = peliculas.some(pelicula => pelicula.id === id && pelicula.titol === title);
                let existePeliculaJSON = peliculasJSON.some(pelicula => pelicula.id === id && pelicula.titol === title);

                if (existePelicula) eliminarPelicula(id);
                if (existePeliculaJSON) eliminarPeliculaJSON(id);

                cargarListaPeliculas(filtroPendientes, filtroCompletas);
            });
        });
    }

    filtroPendientes.addEventListener('change', () => {
        cargarListaPeliculas(filtroPendientes.value, filtroCompletas.value);
    });

    filtroCompletas.addEventListener('change', () => {
        cargarListaPeliculas(filtroPendientes.value, filtroCompletas.value);
    });

    botonSubirArchivo.addEventListener('click', () => {
        const nombreArchivo = archivoInput.value.trim();
        if (!nombreArchivo) {
            alert('Introduce el nombre del fichero JSON.');
            return;
        }

        fetch(`json/${nombreArchivo}.json`)
            .then(response => {
                if (!response.ok) throw new Error('Archivo no encontrado');
                return response.json();
            })
            .then(data => {
                const peliculasJSON = cargarPeliculasJSON();
                const generos = cargarGeneros();

                data.forEach(nuevaPeli => {
                    if (!peliculasJSON.some(p => p.id === nuevaPeli.id)) {
                        peliculasJSON.push(new Pelicula(
                            nuevaPeli.id,
                            nuevaPeli.titol,
                            nuevaPeli.genere,
                            nuevaPeli.prioritat,
                            nuevaPeli.perVeure,
                            nuevaPeli.vista,
                            nuevaPeli.favorita,
                            nuevaPeli.dataVisualitzacio,
                            nuevaPeli.opinio
                        ));

                        const nuevoGenero = nuevaPeli.genere;
                        if (nuevoGenero && !generos.some(g => g.nom === nuevoGenero)) {
                            generos.push(new Genere(nuevoGenero));
                        }
                    }
                });

                guardarPeliculasJSON(peliculasJSON);
                guardarGeneros(generos);
                cargarFiltros();
                cargarListaPeliculas(filtroPendientes.value, filtroCompletas.value);
                archivoInput.value = '';
            })
            .catch(error => {
                alert('Error al cargar el archivo: ' + error.message);
                console.error(error);
            });
    });

    cargarFiltros();
    cargarListaPeliculas();
});