//classes.js: Definició de les classes Pel·lícula i Gènere.

export class Pelicula {
    #id;
    constructor(id, titol, genere, prioritat, perVeure, vista, favorita, dataVisualitzacio, opinio){
        this.#id = id;
        this.titol = titol;
        this.genere = genere;
        this.prioritat = prioritat;
        this.perVeure = perVeure;
        this.vista = vista;
        this.favorita = favorita;
        this.dataVisualitzacio = dataVisualitzacio;
        this.opinio = opinio;
    }

    get id() {
        return this.#id;
    }
}

export class Genere {
    constructor(nom){
        this.nom = nom;
    }
}