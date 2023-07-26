import {Component, Inject, Input, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AnneeScolaire } from '../../models/AnneeScolaire';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmDialogComponent} from '../confirmDialog/confirmDialog.component';

@Component({
  selector: 'app-annee-scolaire',
  templateUrl: './annee-scolaire.component.html',
  styleUrls: ['./annee-scolaire.component.css']
})
export class AnneeScolaireComponent implements OnInit {
  filteredData: AnneeScolaire[] = [];
  private dataSource: AnneeScolaire[] = [];
  searchText = '';

  constructor(private anneeScolaireService: AnneeScolaireService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllAnneesScolaires();
  }

  refresh() {
    this.getAllAnneesScolaires();
  }

  private getAllAnneesScolaires() {
    this.anneeScolaireService.getAllStationEtatActif().subscribe(
        (res: AnneeScolaire[]) => {
          console.log(res);
          this.dataSource = res;
          this.filteredData = res;
        },
        (err: any) => {
          console.log(err);
        }
    );
  }

  archiverAnneeScolaire(id: number) {
    // Ouvre le dialogue de confirmation avant de supprimer le produit
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la suppression',
        message: 'Êtes-vous sûr de vouloir supprimer cette annee ?',
        confirmText: 'Supprimer',
        confirmColor: 'warn'
      }
    });

    // S'abonne à l'événement après la fermeture du dialogue de confirmation
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // Si l'utilisateur confirme la suppression, appelle le service pour supprimer le produit
        this.anneeScolaireService.archiverAnneeScolaire(id).subscribe((res: any) => {
          // Handle success or show notification
          this.refresh();
        });
      }
    });

  }
  // tslint:disable-next-line:max-line-length
  openEditDialog(id: number, etat: string, ans: string): void {
    const dialogRef = this.dialog.open(EditDialogAnneeScolaire, {
      width: '500px',
      data: {
        id: id,
        etat: etat,
        ans: ans
      }
    });

    // S'abonne à l'événement après la fermeture du dialogue
    dialogRef.afterClosed().subscribe((result: AnneeScolaire) => {
      // Vérifie si un résultat a été retourné depuis le dialogue
      if (result) {
        // Appelle le service pour mettre à jour le produit
        this.anneeScolaireService.updateAnneeScolaire(result.id, result).subscribe((res: any) => {
          // Handle success or show notification
          dialogRef.close();
          this.refresh();
        });
      }
    });

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAnneeScolaire, {
      width: '500px',
      data: {
        etat: '',
        ans: ''
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }

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
      const fullSearch = `${item.etat} ${item.ans}`.toLowerCase();
      return fullSearch.includes(this.searchText.toLowerCase());
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-annee-scolaire',
  templateUrl: 'dialog-annee-scolaire.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogAnneeScolaire implements OnInit {

  anneeScolaireForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<DialogAnneeScolaire>,
      @Inject(MAT_DIALOG_DATA) public data: AnneeScolaire,
      private anneeScolaireService: AnneeScolaireService,
      private formBuilder: FormBuilder

  ) { }

  ngOnInit() {
    this.anneeScolaireForm = this.formBuilder.group({
      ans: ['', [Validators.required, this.academicYearFormatValidator.bind(this)]],
    });
  }

  academicYearFormatValidator(control: FormControl): { [key: string]: any } | null {
    const academicYearPattern = /^[0-9]{4}-[0-9]{4}$/;
    const validFormat = academicYearPattern.test(control.value);

    return validFormat ? null : { invalidFormat: true };
  }

  submit() {
    if (this.anneeScolaireForm.invalid) {
      return; // Empêche la soumission si le formulaire est invalide
    }

    const anneeScolaire: { ans: string; etat: string } = {
      etat: 'activer',
      ans: this.anneeScolaireForm.value.ans
    };

    this.anneeScolaireService.addAnneeScolaire(anneeScolaire).subscribe((res: any) => {
      // Handle success or show notification
      this.dialogRef.close();
    });
  }

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dialog-annee-scolaire',
  templateUrl: 'edit-dialog-annee-scolaire.html',
})
// tslint:disable-next-line:component-class-suffix
export class EditDialogAnneeScolaire implements OnInit {
  anneeScolaireForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<DialogAnneeScolaire>,
      @Inject(MAT_DIALOG_DATA) public data: AnneeScolaire,
      private dialog: MatDialog,
      private formBuilder: FormBuilder,
      private anneeScolaireService: AnneeScolaireService
  ) { }
  ngOnInit() {
    // Créer le formulaire avec une validation personnalisée pour l'année scolaire
    this.anneeScolaireForm = this.formBuilder.group({
      ans: [this.data.ans, [Validators.required, this.academicYearFormatValidator.bind(this)]],
    });
  }

  academicYearFormatValidator(control: FormControl): { [key: string]: any } | null {
    const academicYearPattern = /^[0-9]{4}-[0-9]{4}$/;
    const validFormat = academicYearPattern.test(control.value);

    return validFormat ? null : { invalidFormat: true };
  }
  submitEdit() {
    // Ouvrir un dialogue de confirmation avant de soumettre les modifications
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la modification',
        message: 'Êtes-vous sûr de vouloir modifier cette année scolaire ?',
        confirmText: 'Confirmer',
        confirmColor: 'primary'
      }
    });

    // S'abonner à l'événement après la fermeture du dialogue de confirmation
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // Si l'utilisateur confirme la modification, soumettre les modifications
        const id = this.data.id;
        const anneeScolaire: AnneeScolaire = {
          id: this.data.id,
          etat: this.data.etat,
          ans: this.anneeScolaireForm.value.ans // Récupérer la valeur depuis le formulaire
        };
        this.dialogRef.close(anneeScolaire);
      }
    });
  }

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }
}




