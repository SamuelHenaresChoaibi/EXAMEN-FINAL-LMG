//afegir.js: Validació i tractament del formulari.

import { cargarPeliculas, guardarPeliculas, generarIdPelicula } from "./pelicules.js";
import { cargarGeneros } from "./utils.js";
import { Pelicula } from "./classes.js";

document.addEventListener('DOMContentLoaded', () => {
    const tituloInput = document.getElementById('title-film');
    const generosSelect = document.getElementById('generos');
    const prioridadSelect = document.getElementById('priority');
    const paraVerSelect = document.getElementById('paraVer');
    const vistaSelect = document.getElementById('peliVista');
    const favoritaSelect = document.getElementById('favorita');
    const fechaSelect = document.getElementById('fechaVisualizacion');
    const opinionInput = document.getElementById('opinionPeli');
    const botonNuevaPeli = document.getElementById('add-film');
    const generos = cargarGeneros();

    function cargarGenerosSelect() {
        generosSelect.innerHTML = '';
        generos.forEach(genero => {
            const option = document.createElement('option');
            option.value = genero.nom;
            option.textContent = genero.nom;
            generosSelect.appendChild(option);
        });
    }

    function crearFechaHTML() {
        const div = document.createElement('div');
        div.className = "flex flex-col md:flex-row gap-4";
        div.innerHTML = `<h2 class="text-lg md:text-xl font-bold py-1">Fecha</h2>
                        <input id="dateFilm" type="date" class="flex-1 p-2 border rounded text-sm md:text-base w-full">`;
        fechaSelect.appendChild(div);
    }

    function quitarFechaHTML() {
        fechaSelect.innerHTML = '';
    }

    function crearOpinionHTML() {
        const div = document.createElement('div');
        div.className = "flex flex-col md:flex-row gap-4";
        div.innerHTML = `<h2 class="text-lg md:text-xl font-bold py-1">Opinión</h2>
                        <textarea id="opinion" class="flex-1 p-2 border rounded text-sm md:text-base w-full min-h-[100px] md:min-h-[120px]" placeholder="Descripción de la tarea" rows="4"></textarea>`;
        opinionInput.appendChild(div);
    }

    function quitarOpinionHTML() {
        opinionInput.innerHTML = '';
    }

    vistaSelect.addEventListener('change', () => {
        if (vistaSelect.value === 'true') {
            crearFechaHTML();
            crearOpinionHTML();
        } else {
            quitarFechaHTML();
            quitarOpinionHTML();
        }
    });

    botonNuevaPeli.addEventListener('click', () => {
        const tituloValue = tituloInput.value.trim();
        const generoValue = generosSelect.value;
        const prioridadValue = prioridadSelect.value;
        const paraVerValue = paraVerSelect.value;
        const vistaValue = vistaSelect.value;
        const favoritaValue = favoritaSelect.value;
        let fechaValue = '';
        let opinionValue = '';

        if (vistaValue === 'true') {
            fechaValue = document.getElementById('dateFilm').value;
            opinionValue = document.getElementById('opinion').value;
        }

        if (!tituloValue || !generoValue || !prioridadValue || !paraVerValue || !vistaValue || !favoritaValue || (vistaValue === 'true' && (!fechaValue || !opinionValue))) {
            alert("Hay que rellenar todos los campos para crear una tarea");
            return;
        }

        const peliculas = cargarPeliculas();
        const nuevaPeli = new Pelicula(
            generarIdPelicula(peliculas),
            tituloValue,
            generoValue,
            prioridadValue,
            paraVerValue,
            vistaValue,
            favoritaValue,
            fechaValue,
            opinionValue
        );

        peliculas.push(nuevaPeli);
        guardarPeliculas(peliculas);
        tituloInput.value = '';
        prioridadSelect.value = 'Alta';
        paraVerSelect.value = 'false';
        vistaSelect.value = 'false';
        favoritaSelect.value = 'false';
    });

    cargarGenerosSelect();
});