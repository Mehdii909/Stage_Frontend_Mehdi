import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Agence } from '../../models/agence';
import { AgenceService } from '../../services/agence.service';

@Component({
  selector: 'app-agence',
  templateUrl: './agence.component.html',
  styleUrls: ['./agence.component.css']
})
export class AgenceComponent implements OnInit {
  filteredData: Agence[] = [];
  private dataSource: Agence[];
  searchText = '';

  constructor(
      private agenceService: AgenceService,
      public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllAgences();
  }

  refresh() {
    this.getAllAgences();
  }

  getAllAgences(): void {
    this.agenceService.getAllAgenceEtatActif().subscribe(
        (res: Agence[]) => {
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
    this.filteredData = this.dataSource.filter(agence => {
      // Customize the search criteria as per your requirements
      const fullSearch = `${agence.nom} ${agence.adresseSiege} ${agence.responsable}`.toLowerCase();
      return fullSearch.includes(this.searchText.toLowerCase());
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAgence, {
      width: '500px',
      data: {
        nom: '',
        adresseSiege: '',
        responsable: '',
        email: '',
        numTels: [],
        etat: '',
        infoSupp: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getAllAgences();
    });
  }

  openEditDialog(
      id: number,
      nom: string,
      adresseSiege: string,
      responsable: string,
      email: string,
      numTels: string[],
      etat: string,
      infoSupp: string
  ): void {
    const dialogRef = this.dialog.open(EditDialogAgence, {
      width: '500px',
      data: {
        id: id,
        nom: nom,
        adresseSiege: adresseSiege,
        responsable: responsable,
        email: email,
        numTels: numTels,
        etat: etat,
        infoSupp: infoSupp
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  archiverAgence(id) {
    this.agenceService.archiverAgence(id).subscribe((res: any) => {
      // this.showNotification('top', 'right', 'L'eleve a été supprimer', 'danger');
      this.refresh();
    });
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-agence',
  templateUrl: 'dialog-agence.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogAgence {
  newNumTel: any;

  constructor(
      public dialogRef: MatDialogRef<DialogAgence>,
      @Inject(MAT_DIALOG_DATA) public data: Agence,
      private agenceService: AgenceService
  ) {}

  submit() {
    this.data.etat = 'activer';
    // @ts-ignore
    const agence: Agence = {
      nom: this.data.nom,
      adresseSiege: this.data.adresseSiege,
      responsable: this.data.responsable,
      email: this.data.email,
      numTels: this.data.numTels,
      etat: this.data.etat,
      infoSupp: this.data.infoSupp
    };

    this.agenceService.addAgence(agence).subscribe((res: any) => {
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

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dialog-agence',
  templateUrl: 'edit-dialog-agence.html',
})
// tslint:disable-next-line:component-class-suffix
export class EditDialogAgence {
  newNumTel: any;

  constructor(
      public dialogRef: MatDialogRef<EditDialogAgence>,
      @Inject(MAT_DIALOG_DATA) public data: Agence,
      private agenceService: AgenceService
  ) {}

  submitEdit() {
    const id = this.data.id;
    const agence: Agence = {
      id: this.data.id,
      nom: this.data.nom,
      adresseSiege: this.data.adresseSiege,
      responsable: this.data.responsable,
      email: this.data.email,
      numTels: this.data.numTels,
      etat: this.data.etat,
      infoSupp: this.data.infoSupp
    };

    this.agenceService.updateAgence(id, agence).subscribe((res: any) => {
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

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }

}
