export interface Eleve {
    id: number;
    nom: string;
    prenom: string;
    nomPere: string;
    prenomPere: string;
    nomMere: string;
    prenomMere: string;
    nationalite: string;
    email: string;
    etat: string;
    numTels: string[];
    user: User;
}

export interface User {
    id: number;
    login: string;
    password: string;
    userRole: string;
    // Define the properties of the User entity here
}
