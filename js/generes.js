//generes.js: Gestió de gèneres.

import { cargarGeneros, guardarGeneros, eliminarGenero } from "./utils.js";
import { Genere } from "./classes.js";

document.addEventListener('DOMContentLoaded', () => {
    //Elementos HTML
    const nomInput = document.getElementById('name-genero');
    const crearBoton = document.getElementById('crear-genero');
    const generosContainer = document.getElementById('generos-container');

    function crearGeneroHTML(genero) {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center p-2 border-b';
        div.innerHTML = `
                <p class="">
                    <span style="color: #333; font-weight: bolder; padding: 4px 8px; border-radius: 6px;">
                        ${genero.nom}
                    </span>
                </p>
                <button class="delete-genero bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded" data-nom="${genero.nom}">
                    Eliminar
                </button>
            `;
        return div;
    }

    function cargarListaGeneros() {
        const generos = cargarGeneros();
        generosContainer.innerHTML = '';
        generos.forEach(genero => {
            const div = crearGeneroHTML(genero);
            generosContainer.appendChild(div);
        });

        document.querySelectorAll('.delete-genero').forEach(boton => {
            boton.addEventListener('click', () => {
                eliminarGenero(boton.dataset.nom);
                cargarListaGeneros();
            });
        });
    }

    //Evento para cuando pulsamos el botón de 'Crear genero'
    crearBoton.addEventListener('click', () => {
        const nom = nomInput.value.trim();
        if (nom === '') {
            alert('El nombre del género es obligatorio');
            return;
        }
        const generos = cargarGeneros();
        function comprobarRepetido() {
            let existe = false;
            generos.forEach(genero => {
                if (genero.nom === nom) {
                    alert('Este género de película ya existe. Bórrelo o póngale otro nombre')
                    existe = true;
                }
            });
            if (!existe) {
                const nuevoGenero = new Genere(nom);
                generos.push(nuevoGenero);
                guardarGeneros(generos);
                cargarListaGeneros();
            }

        }
        cargarListaGeneros();
        comprobarRepetido();

        nomInput.value = '';
    });

    //Llamar a la función para que muestre la lista en la página
    cargarListaGeneros();
});