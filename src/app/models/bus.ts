import {Agence} from './agence';

export class Bus {
    id: number;
    immatriculation: string;
    marqueModele: string;
    nombrePlaces: number;
    etat: string;
    agence: Agence; // You need to define the Agence model if not already done
}
