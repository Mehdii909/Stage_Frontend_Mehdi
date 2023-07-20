import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Chauffeur } from '../../models/chauffeur';
import { ChauffeurService } from '../../services/chauffeur.service';
import {Agence} from '../../models/agence';

@Component({
  selector: 'app-chauffeur',
  templateUrl: './chauffeur.component.html',
  styleUrls: ['./chauffeur.component.css']
})
export class ChauffeurComponent implements OnInit {
  filteredData: Chauffeur[] = [];
  private dataSource: Chauffeur[];
  searchText = '';

  constructor(
      private chauffeurService: ChauffeurService,
      public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllChauffeurs();
  }

  refresh() {
    this.getAllChauffeurs();
  }

  getAllChauffeurs(): void {
    this.chauffeurService.getAllChauffeurEtatActif().subscribe(
        (res: Chauffeur[]) => {
          console.log(res);
          this.dataSource = res;
          this.filteredData = res;
        },
        (err: any) => {
          console.log(err);
        }
    );
  }

  onSearchChange(): void {
    // Reset the filteredData array
    this.filteredData = [];

    // Check if the search text is empty
    if (!this.searchText) {
      this.filteredData = this.dataSource;
      return;
    }

    // Perform the search based on the searchText
    this.filteredData = this.dataSource.filter(chauffeur => {
      // Customize the search criteria as per your requirements
      const fullSearch = `${chauffeur.nom} ${chauffeur.prenom} ${chauffeur.email}`.toLowerCase();
      return fullSearch.includes(this.searchText.toLowerCase());
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogChauffeur, {
      width: '500px',
      data: {
        nom: '',
        prenom: '',
        email: '',
        numTels: [],
        etat: '',
        agence: null // You can pass an agence object here if needed
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getAllChauffeurs();
    });
  }

  openEditDialog(
      id: number,
      nom: string,
      prenom: string,
      email: string,
      numTels: string[],
      etat: string,
      agence: Agence
  ): void {
    const dialogRef = this.dialog.open(EditDialogChauffeur, {
      width: '500px',
      data: {
        id: id,
        nom: nom,
        prenom: prenom,
        email: email,
        numTels: numTels,
        etat: etat,
        agence: agence // You can pass an agence object here if needed
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  // Add any other methods needed for managing chauffeurs

  archiverChauffeur(id: number) {
    this.chauffeurService.archiverChauffeur(id).subscribe((res: any) => {
      // this.showNotification('top', 'right', 'L'eleve a été supprimer', 'danger');
      this.refresh();
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-chauffeur',
  templateUrl: 'dialog-chauffeur.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogChauffeur {
  // Add the necessary properties for chauffeur creation dialog
  newNumTel: any;

  constructor(
      public dialogRef: MatDialogRef<DialogChauffeur>,
      @Inject(MAT_DIALOG_DATA) public data: Chauffeur,
      private chauffeurService: ChauffeurService
  ) {}

  submit() {
    // Customize the submission logic for adding a chauffeur
    const chauffeur: { agence: Agence; numTels: string[]; nom: string; prenom: string; etat: string; email: string } = {
      nom: this.data.nom,
      prenom: this.data.prenom,
      email: this.data.email,
      numTels: this.data.numTels,
      etat: 'activer', // Assuming the default state is active when adding a new chauffeur
      agence: this.data.agence // Add agence object here if needed
    };

    this.chauffeurService.addChauffeur(chauffeur).subscribe((res: any) => {
      this.dialogRef.close();
    });
  }

  removeNumTel(index: number) {
    this.data.numTels.splice(index, 1);
  }

  addNumTel() {
    if (this.newNumTel) {
      this.data.numTels.push(this.newNumTel);
      this.newNumTel = ''; // Reset the input field
    }
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dialog-chauffeur',
  templateUrl: 'edit-dialog-chauffeur.html',
})
// tslint:disable-next-line:component-class-suffix
export class EditDialogChauffeur {
  // Add the necessary properties for chauffeur edit dialog
  newNumTel: any;

  constructor(
      public dialogRef: MatDialogRef<EditDialogChauffeur>,
      @Inject(MAT_DIALOG_DATA) public data: Chauffeur,
      private chauffeurService: ChauffeurService
  ) {}

  submitEdit() {
    // Customize the submission logic for editing a chauffeur
    const id = this.data.id;
    const chauffeur: Chauffeur = {
      id: this.data.id,
      nom: this.data.nom,
      prenom: this.data.prenom,
      email: this.data.email,
      numTels: this.data.numTels,
      etat: this.data.etat,
      agence: this.data.agence // Add agence object here if needed
    };

    this.chauffeurService.updateChauffeur(id, chauffeur).subscribe((res: any) => {
      this.dialogRef.close();
    });
  }

  removeNumTel(index: number) {
    this.data.numTels.splice(index, 1);
  }

  addNumTel() {
    if (this.newNumTel) {
      this.data.numTels.push(this.newNumTel);
      this.newNumTel = ''; // Reset the input field
    }
  }

}
