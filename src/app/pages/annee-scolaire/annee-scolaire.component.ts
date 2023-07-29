import {Component, Inject, Input, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AnneeScolaire } from '../../models/AnneeScolaire';
import { AnneeScolaireService } from '../../services/annee-scolaire.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmDialogComponent} from '../confirmDialog/confirmDialog.component';
import {ClasseService} from '../../services/classe.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-annee-scolaire',
  templateUrl: './annee-scolaire.component.html',
  styleUrls: ['./annee-scolaire.component.css']
})
export class AnneeScolaireComponent implements OnInit {
  filteredData: AnneeScolaire[] = [];
  private dataSource: AnneeScolaire[] = [];
  searchText = '';

  constructor(private classeService: ClasseService,
              private anneeScolaireService: AnneeScolaireService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllAnneesScolaires();
  }

  refresh() {
    this.getAllAnneesScolaires();
  }

  private getAllAnneesScolaires() {
    this.anneeScolaireService.getAllAnneesScolairesEtatActif().subscribe(
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

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000, // Duration in milliseconds (e.g., 5000 = 5 seconds)
      panelClass: ['custom-snackbar', 'mat-toolbar', 'mat-warn'], // Apply custom CSS classes to the snackbar
      horizontalPosition: 'right', // Position the snackbar horizontally in the center
      verticalPosition: 'bottom', // Position the snackbar vertically in the center
    });
  }

  archiverAnneeScolaire(id: number) {
    this.classeService.getAllClasseEtatActiverByAnsId(id).subscribe(
        (classes: any[]) => {
          const hasActiveClasses = classes && classes.length > 0;
          if (hasActiveClasses) {
            this.showErrorMessage('Impossible de supprimer cette annee scolaire. Des classes actifs sont liés à cette annee scolaire.');
          } else {
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
        },
        (error) => {
          // Handle error if there's an issue fetching active buses
          console.error('Error fetching active buses:', error);
        }
    );
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
      private snackBar: MatSnackBar,
      private formBuilder: FormBuilder
  ) { }
  ngOnInit() {
    this.anneeScolaireForm = this.formBuilder.group({
      ans: ['', [Validators.required, this.academicYearFormatValidator.bind(this)]],
    });
  }
  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['mat-toolbar', 'mat-warn'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
  academicYearFormatValidator(control: FormControl): { [key: string]: any } | null {
    const academicYearPattern = /^[0-9]{4}-[0-9]{4}$/;
    const validFormat = academicYearPattern.test(control.value);

    return validFormat ? null : { invalidFormat: true };
  }
  academicYearExistsValidator(control: FormControl): Promise<{ [key: string]: any } | null> {
    return new Promise((resolve) => {
      const academicYearValue = control.value;
      this.anneeScolaireService.getAllAnneesScolairesEtatActif().subscribe(
          (academicYears: AnneeScolaire[]) => {
            const exists = academicYears.some((academicYear) => academicYear.ans === academicYearValue);

            if (exists) {
              resolve({ alreadyExists: true });
            } else {
              resolve(null);
            }
          },
          (error) => {
            console.error(error);
            resolve(null); // Handle error here or return a generic error message
          }
      );
    });
  }
  submit() {
    if (this.anneeScolaireForm.invalid) {
      return; // Empêche la soumission si le formulaire est invalide
    }

    const academicYearControl = this.anneeScolaireForm.get('ans');

    if (academicYearControl instanceof FormControl) {
      this.academicYearExistsValidator(academicYearControl)
          .then(isYearExists => {
            if (isYearExists) {
              this.showErrorMessage('Cette annee scolaire existe déjà.');
            } else {
              const anneeScolaire: { ans: string; etat: string } = {
                etat: 'activer',
                ans: this.anneeScolaireForm.value.ans
              };

              this.anneeScolaireService.addAnneeScolaire(anneeScolaire).subscribe((res: any) => {
                // Handle success or show notification
                this.dialogRef.close();
              });
            }
          })
          .catch(error => {
            console.error(error);
            this.showErrorMessage('"Une erreur s\'est produite lors de la vérification de l\'année scolaire.');
          });
    }
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




