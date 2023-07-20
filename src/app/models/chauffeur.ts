import {Agence} from './agence';

export class Chauffeur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    numTels: string[];
    etat: string;
    agence: Agence; // You need to define the Agence model if not already done
}
