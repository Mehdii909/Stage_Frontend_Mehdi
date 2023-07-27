import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Classe} from '../../models/classe';
import {ClasseService} from '../../services/classe.service';
import {EditDialogEleve} from '../eleve/eleve.component';
import {Agence} from '../../models/agence';
import {AnneeScolaire} from '../../models/anneeScolaire';
import {AnneeScolaireService} from '../../services/annee-scolaire.service';
import {ConfirmDialogComponent} from '../confirmDialog/confirmDialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.css']
})
export class ClasseComponent implements OnInit {
  filteredData: any[] = [];
  private dataSource: any;
  searchText = '';


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
      const fullSearch = `${item.cycle} ${item.niveau} ${item.numClasse}`.toLowerCase();
      return fullSearch.includes(this.searchText.toLowerCase());
    });
  }

  constructor(private classeService: ClasseService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllClassesActive();
  }

  refresh() {
    this.getAllClassesActive();
  }

  private getAllClassesActive() {
    this.classeService.getAllClasseEtatActif().subscribe(
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

  archiverClasse(id) {
    // Ouvre le dialogue de confirmation avant de supprimer le produit
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la suppression',
        message: 'Êtes-vous sûr de vouloir supprimer cette classe ?',
        confirmText: 'Supprimer',
        confirmColor: 'warn'
      }
    });

    // S'abonne à l'événement après la fermeture du dialogue de confirmation
    dialogRef.afterClosed().subscribe((result: boolean) => {
      console.log(result)
      if (result) {
        // Si l'utilisateur confirme la suppression, appelle le service pour supprimer le produit
        this.classeService.archiverClasse(id).subscribe((res: any) => {
          // this.showNotification('top', 'right', 'La classe a été supprimer', 'danger');
          this.refresh();
        });
      }
    });

  }

  openEditDialog(id: number, cycle: string, niveau: string, numClasse: string, etat: string, anneeScolaire: AnneeScolaire): void {
    // @ts-ignore
    const dialogRef = this.dialog.open(EditDialogClasse, {
      width: '500px',
      data: {
        id: id,
        cycle: cycle,
        niveau: niveau,
        numClasse: numClasse,
        etat: etat,
        anneeScolaire: anneeScolaire
      }
    });

    // S'abonne à l'événement après la fermeture du dialogue
    dialogRef.afterClosed().subscribe((result: Classe) => {
      // Vérifie si un résultat a été retourné depuis le dialogue
      console.log(result)
      if (result) {
        // Appelle le service pour mettre à jour le produit
        this.classeService.updateClasse(result.id, result).subscribe((res: any) => {
          // Handle success or show notification
          dialogRef.close();
          this.refresh();
        });
      }
    });

  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogClasse, {
      width: '500px',
      data: {
        cycle: '',
        niveau: '',
        numClasse: '',
        etat: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }


}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-classe',
  templateUrl: 'dialog-classe.html',
})

// tslint:disable-next-line:component-class-suffix
export class DialogClasse implements OnInit {

  anneeScolaires: AnneeScolaire[] = [];
  classeForm: FormGroup;


  constructor(
      public dialogRef: MatDialogRef<DialogClasse>,
      @Inject(MAT_DIALOG_DATA) public data: Classe,
      private classeService: ClasseService,
      private formBuilder: FormBuilder,
      private anneeScolaireService: AnneeScolaireService) { }

  ngOnInit(): void {
    this.anneeScolaireService.getAllStationEtatActif().subscribe(
        (an) => {
          // @ts-ignore
          this.anneeScolaires = an;
        },
        (error) => {
          console.error(error);
          // Handle error here
        }
    );

    // Create the form group with custom validation for required fields
    this.classeForm = this.formBuilder.group({
      cycle: [this.data.cycle, Validators.required],
      niveau: [this.data.niveau, Validators.required],
      numClasse: [this.data.numClasse, Validators.required]
    });

  }

  submit() {
    if (this.classeForm.invalid) {
      // If the form is invalid (some required fields are empty), do not submit
      return;
    }

    this.data.etat = 'activer';

    const cl = {
      cycle: this.data.cycle,
      niveau: this.data.niveau,
      numClasse: this.data.numClasse,
      etat: this.data.etat,
      anneeScolaire: this.data.anneeScolaire
    };

    this.classeService.addClasse(cl).subscribe((res: any) => {
      // Handle the response or any additional logic
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
  selector: 'edit-dialog-classe',
  templateUrl: 'edit-dialog-classe.html',
})

// tslint:disable-next-line:component-class-suffix
export class EditDialogClasse implements OnInit {

  anneeScolaires: AnneeScolaire[] = [];
  classeForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<EditDialogClasse>,
      @Inject(MAT_DIALOG_DATA) public data: Classe,
      private classeService: ClasseService,
      private dialog: MatDialog,
      private formBuilder: FormBuilder,
      private anneeScolaireService: AnneeScolaireService) { }

  ngOnInit(): void {
    this.anneeScolaireService.getAllStationEtatActif().subscribe(
        (an) => {
          // @ts-ignore
          this.anneeScolaires = an.filter(annee => annee.id !== this.data.anneeScolaire.id);
        },
        (error) => {
          console.error(error);
          // Handle error here
        }
    );

    // Create the form group with custom validation for required fields
    this.classeForm = this.formBuilder.group({
      cycle: [this.data.cycle, Validators.required],
      niveau: [this.data.niveau, Validators.required],
      numClasse: [this.data.numClasse, Validators.required]
    });
  }
  submitEdit() {
    // Ouvrir un dialogue de confirmation avant de soumettre les modifications
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la modification',
        message: 'Êtes-vous sûr de vouloir modifier cette classe ?',
        confirmText: 'Confirmer',
        confirmColor: 'primary'
      }
    });

    // S'abonner à l'événement après la fermeture du dialogue de confirmation
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        // Si l'utilisateur confirme la modification, soumettre les modifications

        const id = this.data.id;
        const classe: Classe = {
          id: this.data.id,
          cycle: this.data.cycle,
          niveau: this.data.niveau,
          numClasse: this.data.numClasse,
          etat: this.data.etat,
          anneeScolaire: this.data.anneeScolaire
        };
        this.dialogRef.close(classe);
      }
    });
  }
  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }

}

