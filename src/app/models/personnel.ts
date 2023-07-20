export interface Personnel {

    id: number;

    nom: string;

    prenom: string;

    email: string;

    fonction: string;

    etat: string;

    num: string[];

    user: User;

}




export interface User {

    id: number;

    login: string;

    password: string;

    userRole: string;

    // Define the properties of the User entity here

}
