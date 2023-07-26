import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Classe} from '../../models/classe';
import {ClasseService} from '../../services/classe.service';
import {EditDialogEleve} from '../eleve/eleve.component';
import {Agence} from '../../models/agence';
import {AnneeScolaire} from '../../models/anneeScolaire';
import {AnneeScolaireService} from '../../services/annee-scolaire.service';

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
    this.classeService.archiverClasse(id).subscribe((res: any) => {
      // this.showNotification('top', 'right', 'La classe a été supprimer', 'danger');
      this.refresh();
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
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
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

  constructor(
      public dialogRef: MatDialogRef<DialogClasse>,
      @Inject(MAT_DIALOG_DATA) public data: Classe,
      private classeService: ClasseService,
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
  }

  submit() {

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

  constructor(
      public dialogRef: MatDialogRef<EditDialogClasse>,
      @Inject(MAT_DIALOG_DATA) public data: Classe,
      private classeService: ClasseService,
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
  }
  submitEdit() {
    const id = this.data.id;
    const classe: Classe = {
      id: this.data.id,
      cycle: this.data.cycle,
      niveau: this.data.niveau,
      numClasse: this.data.numClasse,
      etat: this.data.etat,
      anneeScolaire: this.data.anneeScolaire
    };
    this.classeService.updateClasse(id, classe).subscribe((res: any) => {
      // Handle success or show notification
      this.dialogRef.close();
    });
  }

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }

}


