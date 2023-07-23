// @ts-ignore
// @ts-ignore
import {Component, Inject, OnInit} from '@angular/core';
import {EleveService} from '../../services/eleve.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Eleve, User} from '../../models/eleve';

@Component({
  selector: 'app-eleve',
  templateUrl: './eleve.component.html',
  styleUrls: ['./eleve.component.css']
})
export class EleveComponent implements OnInit {

  dataSource = []

  filteredData: any[] = [];

  searchText = '';

  constructor(private eleveService: EleveService,
              public dialog: MatDialog) { }

  onSearchChange() {
    // Reset the filteredData array
    this.filteredData = [];

    // Check if the search text is empty
    if (!this.searchText) {
      this.filteredData = this.dataSource;
      return;
    }

    // Perform the search based on the searchText
    this.filteredData = this.dataSource.filter(item => {
      // Customize the search criteria as per your requirements
      const fullName = `${item.nom} ${item.prenom}`.toLowerCase();
      const fullNameInv = `${item.prenom} ${item.nom}`.toLowerCase();

      return (
          fullName.includes(this.searchText.toLowerCase()) ||
          fullNameInv.includes(this.searchText.toLowerCase())
      );
    });
  }

  ngOnInit(): void {
    this.getAllElevesActive();
  }

  refresh() {
    this.getAllElevesActive();
  }

  private getAllElevesActive() {
    this.eleveService.getAllEleveEtatActif().subscribe(
        (res: any) => {
          console.log(res);
          this.dataSource = res;
          this.filteredData = res;

        },
        (err: any) => {
          console.log(err);
        }
    );
  }

  archiverEleve(id) {
    this.eleveService.archiverEleve(id).subscribe((res: any) => {
      // this.showNotification('top', 'right', 'L'eleve a été supprimer', 'danger');
      this.refresh();
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogEleve, {
      width: '500px',
      data: {
        nom: '',
        prenom: '',
        nomPere: '',
        prenomPere: '',
        nomMere: '',
        prenomMere: '',
        nationalite: '',
        email: '',
        etat: '',
        numTels: [],
        user: null}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }

  // tslint:disable-next-line:max-line-length
  openEditDialog(id: number, nom: string, prenom: string, nomPere: string, prenomPere: string, nomMere: string, prenomMere: string, nationalite: string, email: string, etat: string, numTels: string[], user: User): void {
    const dialogRef = this.dialog.open(EditDialogEleve, {
      width: '500px',
      data: {
        id: id,
        nom: nom,
        prenom: prenom,
        nomPere: nomPere,
        prenomPere: prenomPere,
        nomMere: nomMere,
        prenomMere: prenomMere,
        nationalite: nationalite,
        email: email,
        etat: etat,
        numTels: numTels,
        user: user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-eleve',
  templateUrl: 'dialog-eleve.html',
})

// tslint:disable-next-line:component-class-suffix
export class DialogEleve {

  newNumTel: any;

  constructor(
      public dialogRef: MatDialogRef<DialogEleve>,
      @Inject(MAT_DIALOG_DATA) public data: Eleve,
      private eleveService: EleveService) { }
  submit() {
    // Generate a random password
    const randomPassword = Math.random().toString(36).slice(-8);
    // Assign values to user properties
    // @ts-ignore
    this.data.user = {
      login: `${this.data.prenom}.${this.data.nom}`,
      password: randomPassword,
      userRole: 'ROLE_ELEVE'
    };

    this.data.etat = 'activer';

    const el = {
      nom: this.data.nom,
      prenom: this.data.prenom,
      nomPere: this.data.nomPere,
      prenomPere: this.data.prenomPere,
      nomMere: this.data.nomMere,
      prenomMere: this.data.prenomMere,
      nationalite: this.data.nationalite,
      email: this.data.email,
      etat: this.data.etat,
      numTels: this.data.numTels,
      user: this.data.user,
    };

    this.eleveService.addEleve(el).subscribe((res: any) => {
      // this.showNotification('top', 'right', 'L'eleve' a été ajouter', 'success');
      this.dialogRef.close();
    });
  }

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }
  removeNumTel(index: number) {
    this.data.numTels.splice(index, 1);
  }
  addNumTel() {
    if (this.newNumTel) {
      this.data.numTels.push(this.newNumTel);
      this.newNumTel = ''; // Réinitialise le champ de saisie
    }
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dialog-eleve',
  templateUrl: 'edit-dialog-eleve.html',
})

// tslint:disable-next-line:component-class-suffix
export class EditDialogEleve {

  newNumTel: any;

  constructor(
      public dialogRef: MatDialogRef<EditDialogEleve>,
      @Inject(MAT_DIALOG_DATA) public data: Eleve,
      private eleveService: EleveService) {
  }

  submitEdit() {
    const id = this.data.id;
    const el = {
      id: this.data.id,
      nom: this.data.nom,
      prenom: this.data.prenom,
      nomPere: this.data.nomPere,
      prenomPere: this.data.prenomPere,
      nomMere: this.data.nomMere,
      prenomMere: this.data.prenomMere,
      nationalite: this.data.nationalite,
      email: this.data.email,
      etat: this.data.etat,
      numTels: this.data.numTels,
      user: this.data.user
    };
    this.eleveService.updateEleve(id, el).subscribe((res: any) => {
      // this.showNotification('top', 'right', 'Le camion a été modifier', 'success');
      this.dialogRef.close();
    });
  }

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }

  removeNumTel(index: number) {
    this.data.numTels.splice(index, 1);
  }
  addNumTel() {
    if (this.newNumTel) {
      this.data.numTels.push(this.newNumTel);
      this.newNumTel = ''; // Réinitialise le champ de saisie
    }
  }
}

