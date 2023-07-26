import {AnneeScolaire} from './anneeScolaire';

export interface Classe {
    id: number;
    cycle: string;
    niveau: string;
    numClasse: string;
    etat: string;
    anneeScolaire: AnneeScolaire
}
