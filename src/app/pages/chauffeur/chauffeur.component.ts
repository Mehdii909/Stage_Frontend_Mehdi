import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Chauffeur } from 'app/models/chauffeur';
import { ChauffeurService } from 'app/services/chauffeur.service';
import { ConfirmDialogComponent } from 'app/pages/confirmDialog/confirmDialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chauffeur',
  templateUrl: './chauffeur.component.html',
  styleUrls: ['./chauffeur.component.css']
})
export class ChauffeurComponent implements OnInit {
  dataSource = []

  filteredData: any[] = [];

  searchText = '';

  constructor(
      private chauffeurService: ChauffeurService,
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
    this.filteredData = this.dataSource.filter(chauffeur => {
      // Customize the search criteria as per your requirements
      const fullSearch = `${chauffeur.nom} ${chauffeur.prenom} ${chauffeur.email}`.toLowerCase();
      return fullSearch.includes(this.searchText.toLowerCase());
    });
  }

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



  archiverChauffeur(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la suppression',
        message: 'Êtes-vous sûr de vouloir supprimer ce chauffeur ?',
        confirmText: 'Supprimer',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.chauffeurService.archiverChauffeur(id).subscribe((res: any) => {
          this.refresh();
        });
      }
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
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }

  openEditDialog(id: number, nom: string, prenom: string, email: string, numTels: string[], etat: string): void {
    const dialogRef = this.dialog.open(EditDialogChauffeur, {
      width: '500px',
      data: {
        id: id,
        nom: nom,
        prenom: prenom,
        email: email,
        numTels: numTels,
        etat: etat,
      }
    });

    dialogRef.afterClosed().subscribe((result: Chauffeur) => {
      if (result) {
        this.chauffeurService.updateChauffeur(result.id, result).subscribe((res: any) => {
          dialogRef.close();
          this.refresh();
        });
      }
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-chauffeur',
  templateUrl: 'dialog-chauffeur.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogChauffeur implements OnInit {
  newNumTel: any;
  chauffeurForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<DialogChauffeur>,
      @Inject(MAT_DIALOG_DATA) public data: Chauffeur,
      private formBuilder: FormBuilder,
      private chauffeurService: ChauffeurService
  ) { }

  ngOnInit(): void {
    this.chauffeurForm = this.formBuilder.group({
      nom: [this.data.nom, Validators.required],
      prenom: [this.data.prenom, Validators.required],
      email: [this.data.email],
      // Add more form controls for other properties if needed
    });
  }

  submit() {
    if (this.chauffeurForm.invalid) {
      return;
    }



    const chauff = {
      nom: this.data.nom,
      prenom: this.data.prenom,
      email: this.data.email,
      numTels: this.data.numTels,
      etat: 'activer'
    };

    this.chauffeurService.addChauffeur(chauff).subscribe((res: any) => {
      this.dialogRef.close();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  removeNumTel(index: number) {
    this.data.numTels.splice(index, 1);
  }

  addNumTel() {
    if (this.newNumTel) {
      this.data.numTels.push(this.newNumTel);
      this.newNumTel = '';
    }
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dialog-chauffeur',
  templateUrl: 'edit-dialog-chauffeur.html',
})
// tslint:disable-next-line:component-class-suffix
export class EditDialogChauffeur implements OnInit {
  newNumTel: any;
  chauffeurForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<EditDialogChauffeur>,
      @Inject(MAT_DIALOG_DATA) public data: Chauffeur,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private chauffeurService: ChauffeurService
  ) { }

  ngOnInit(): void {
    this.chauffeurForm = this.formBuilder.group({
      nom: [this.data.nom, Validators.required],
      prenom: [this.data.prenom, Validators.required],
      email: [this.data.email],
      // Add more form controls for other properties if needed
    });
  }

  submitEdit() {
    // Open a confirmation dialog before submitting the modifications
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la modification',
        message: 'Êtes-vous sûr de vouloir modifier ce chauffeur ?',
        confirmText: 'Confirmer',
        confirmColor: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // If the user confirms the modification, submit the changes
        const id = this.data.id;
        const chauff: Chauffeur = {
          id: this.data.id,
          nom: this.data.nom,
          prenom: this.data.prenom,
          email: this.data.email,
          numTels: this.data.numTels,
          etat: this.data.etat,
        };

        this.dialogRef.close(chauff);
      }
    });
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  removeNumTel(index: number) {
    this.data.numTels.splice(index, 1);
  }

  addNumTel() {
    if (this.newNumTel) {
      this.data.numTels.push(this.newNumTel);
      this.newNumTel = '';
    }
  }
}
