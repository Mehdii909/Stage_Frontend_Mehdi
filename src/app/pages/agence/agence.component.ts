import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Agence } from '../../models/agence';
import { AgenceService } from '../../services/agence.service';
import { ConfirmDialogComponent } from 'app/pages/confirmDialog/confirmDialog.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agence',
  templateUrl: './agence.component.html',
  styleUrls: ['./agence.component.css']
})
export class AgenceComponent implements OnInit {
  dataSource = []

  filteredData: any[] = [];

  searchText = '';

  constructor(
      private agenceService: AgenceService,
      public dialog: MatDialog
  ) { }

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

  archiverAgence(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la suppression',
        message: 'Êtes-vous sûr de vouloir supprimer cette agence ?',
        confirmText: 'Supprimer',
        confirmColor: 'warn'
      }
    });
    // S'abonne à l'événement après la fermeture du dialogue de confirmation
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // Si l'utilisateur confirme la suppression, appelle le service pour supprimer le produit
        this.agenceService.archiverAgence(id).subscribe((res: any) => {
          // this.showNotification('top', 'right', 'L'eleve a été supprimer', 'danger');
          this.refresh();
        });
      }
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

    dialogRef.afterClosed().subscribe((result: Agence) => {
      if (result) {
        this.agenceService.updateAgence(result.id, result).subscribe((res: any) => {
          dialogRef.close();
          this.refresh();
        });
      }
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-agence',
  templateUrl: 'dialog-agence.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogAgence implements OnInit {
  newNumTel: any;
  agenceForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<DialogAgence>,
      @Inject(MAT_DIALOG_DATA) public data: Agence,
      private formBuilder: FormBuilder,
      private agenceService: AgenceService
  ) {}

  ngOnInit(): void {

    // Create the form group with custom validation for required fields
    this.agenceForm = this.formBuilder.group({
      nom: [this.data.nom, Validators.required],
      adresseSiege: [this.data.adresseSiege, Validators.required],
      responsable: [this.data.responsable, Validators.required],
      email: [this.data.email],
      infoSupp: [this.data.infoSupp]
    });
  }

  submit() {
    if (this.agenceForm.invalid) {
      return;
    }

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
      this.newNumTel = ''; // Reset the input field
    }
  }



}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dialog-agence',
  templateUrl: 'edit-dialog-agence.html',
})
// tslint:disable-next-line:component-class-suffix
export class EditDialogAgence implements OnInit {
  newNumTel: any;
  agenceForm: FormGroup;


  constructor(
      public dialogRef: MatDialogRef<EditDialogAgence>,
      @Inject(MAT_DIALOG_DATA) public data: Agence,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private agenceService: AgenceService
  ) {}

  ngOnInit(): void {
    this.agenceForm = this.formBuilder.group({
      nom: [this.data.nom, Validators.required],
      adresseSiege: [this.data.adresseSiege, Validators.required],
      responsable: [this.data.responsable, Validators.required],
      email: [this.data.email],
      infoSupp: [this.data.infoSupp]
      // Add more form controls for other properties if needed
    });
  }


  submitEdit() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la modification',
        message: 'Êtes-vous sûr de vouloir modifier cette agence ?',
        confirmText: 'Confirmer',
        confirmColor: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const id = this.data.id;
        const ag: Agence = {
          id: this.data.id,
          nom: this.data.nom,
          adresseSiege: this.data.adresseSiege,
          responsable: this.data.responsable,
          email: this.data.email,
          numTels: this.data.numTels,
          etat: this.data.etat,
          infoSupp: this.data.infoSupp
        };

        this.dialogRef.close(ag);
      }
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
      this.newNumTel = ''; // Reset the input field
    }
  }


}
