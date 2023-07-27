import { Component, Inject, OnInit } from '@angular/core';
import { PersonnelService } from 'app/services/personnel.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Personnel, User } from 'app/models/personnel';
import { ConfirmDialogComponent } from 'app/pages/confirmDialog/confirmDialog.component';



@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent implements OnInit {

  dataSource = [];

  filteredData: any[] = [];
  searchText = '';

  constructor(private personnelService: PersonnelService,
              public dialog: MatDialog,
              private fb: FormBuilder) { }


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
    this.getAllPersonnelsActive();
    console.log(this.dataSource);
  }

  refresh() {
    this.getAllPersonnelsActive();
  }

  private getAllPersonnelsActive() {
    this.personnelService.getAllPersonnelEtatActif().subscribe(
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

  // Method to delete personnel
  archiverPersonnel(id: number): void {
    // Open the confirmation dialog before deleting personnel
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la suppression',
        message: 'Êtes-vous sûr de vouloir supprimer ce personnel ?',
        confirmText: 'Supprimer',
        confirmColor: 'warn'
      }

    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // Si l'utilisateur confirme la suppression, appelle le service pour supprimer le produit
        this.personnelService.archiverPersonnel(id).subscribe((res: any) => {
          // Handle success or show notification
          this.refresh();
        });
      }
    });

  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogPersonnel, {
      width: '500px',
      data: {
        nom: '',
        prenom: '',
        email: '',
        fonction: '',
        etat: '',
        num: [],
        user: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }

  openEditDialog(
      id: number,
      nom: string,
      prenom: string,
      email: string,
      fonction: string,
      etat: string,
      num: string[],
      user: User
  ): void {
    const dialogRef = this.dialog.open(EditDialogPersonnel, {
      width: '500px',
      data: {
        id: id,
        nom: nom,
        prenom: prenom,
        email: email,
        fonction: fonction,
        etat: etat,
        num: num,
        user: user,
      },
    });

    // S'abonne à l'événement après la fermeture du dialogue
    dialogRef.afterClosed().subscribe((result: Personnel) => {
      // Vérifie si un résultat a été retourné depuis le dialogue
      if (result) {
        // Appelle le service pour mettre à jour le personnel
        this.personnelService.updatePersonnel(result.id, result).subscribe(
            (res: any) => {
              // Handle success or show notification
              dialogRef.close();
              this.refresh();
            });
      }
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-personnel',
  templateUrl: 'dialog-personnel.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogPersonnel implements OnInit {

  newNum: any;
  personnelForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<DialogPersonnel>,
      @Inject(MAT_DIALOG_DATA) public data: Personnel,
      private formBuilder: FormBuilder,
      private personnelService: PersonnelService) { }

  ngOnInit(): void {

    // Create the form group with custom validation for required fields
    this.personnelForm = this.formBuilder.group({
      nom: [this.data.nom, Validators.required],
      prenom: [this.data.prenom, Validators.required],
      email: [this.data.email],
      fonction: [this.data.fonction]
    });
  }

  submit() {
    if (this.personnelForm.invalid) {
      // If the form is invalid (some required fields are empty), do not submit
      return;
    }
    const randomPassword = Math.random().toString(36).slice(-8);

    // @ts-ignore
    this.data.user = {
      login: `${this.data.prenom}.${this.data.nom}`,
      password: randomPassword,
      userRole: 'ROLE_PERSONNEL'
    };

    this.data.etat = 'activer';

    const perso = {
      nom: this.data.nom,
      prenom: this.data.prenom,
      email: this.data.email,
      fonction: this.data.fonction,
      etat: this.data.etat,
      num: this.data.num,
      user: this.data.user,
    };

    this.personnelService.addPersonnel(perso).subscribe((res: any) => {
      this.dialogRef.close();
    });
  }

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }

  removeNum(index: number) {
    this.data.num.splice(index, 1);
  }

  addNumTel() {
    if (this.newNum) {
      this.data.num.push(this.newNum);
      this.newNum = '';
    }
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dialog-personnel',
  templateUrl: 'edit-dialog-personnel.html',
})
// tslint:disable-next-line:component-class-suffix
export class EditDialogPersonnel implements OnInit {

  newNum: any;
  personnelForm: FormGroup;


  constructor(
      public dialogRef: MatDialogRef<EditDialogPersonnel>,
      public dialog: MatDialog,
      private formBuilder: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: Personnel,
      private personnelService: PersonnelService) { }

  ngOnInit(): void {

    // Create the form group with custom validation for required fields
    this.personnelForm = this.formBuilder.group({
      nom: [this.data.nom, Validators.required],
      prenom: [this.data.prenom, Validators.required],
      email: [this.data.email],
      fonction: [this.data.fonction]
    });
  }


  submitEdit() {

    // Ouvrir un dialogue de confirmation avant de soumettre les modifications
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la modification',
        message: 'Êtes-vous sûr de vouloir modifier cet personnel ?',
        confirmText: 'Confirmer',
        confirmColor: 'primary',
      },
    });


    // S'abonner à l'événement après la fermeture du dialogue de confirmation
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // Si l'utilisateur confirme la modification, soumettre les modifications
        const id = this.data.id;
        const personnel: Personnel = {
          id: this.data.id,
          nom: this.data.nom,
          prenom: this.data.prenom,
          email: this.data.email,
          fonction: this.data.fonction,
          etat: this.data.etat,
          num: this.data.num,
          user: this.data.user,
        };
        this.dialogRef.close(personnel);
      }
    });
  }

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }


  removeNum(index: number) {
    this.data.num.splice(index, 1);
  }

  addNumTel() {
    if (this.newNum) {
      this.data.num.push(this.newNum);
      this.newNum = '';
    }
  }

}
