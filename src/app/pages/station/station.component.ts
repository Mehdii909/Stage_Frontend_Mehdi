import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Station } from 'app/models/station';
import { StationService } from 'app/services/station.service';
import { ConfirmDialogComponent } from 'app/pages/confirmDialog/confirmDialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {
  dataSource = []

  filteredData: any[] = [];

  searchText = '';

  constructor(private stationService: StationService, public dialog: MatDialog) { }

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
      const fullSearch = `${item.nom} ${item.region}`.toLowerCase();
      return fullSearch.includes(this.searchText.toLowerCase());
    });
  }

  ngOnInit(): void {
    this.getAllStationsActive();
  }

  refresh() {
    this.getAllStationsActive();
  }

  private getAllStationsActive() {
    this.stationService.getAllStationEtatActif().subscribe(
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

  archiverStation(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la suppression',
        message: 'Êtes-vous sûr de vouloir supprimer cette station ?',
        confirmText: 'Supprimer',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.stationService.archiverStation(id).subscribe((res: any) => {
          this.refresh();
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogStation, {
      width: '500px',
      data: {
        nom: '',
        region: '',
        coordonneesGpsLatitude: '',
        coordonneesGpsLongitude: '',
        etat: ''
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.refresh();
    });
  }

  // tslint:disable-next-line:max-line-length
  openEditDialog(id: number, nom: string, region: string, coordonneesGpsLatitude: string, coordonneesGpsLongitude: string, etat: string): void {
    const dialogRef = this.dialog.open(EditDialogStation, {
      width: '500px',
      data: {
        id: id,
        nom: nom,
        region: region,
        coordonneesGpsLatitude: coordonneesGpsLatitude,
        coordonneesGpsLongitude: coordonneesGpsLongitude,
        etat: etat
      }
    });
    dialogRef.afterClosed().subscribe((result: Station) => {
      if (result) {
        this.stationService.updateStation(result.id, result).subscribe((res: any) => {
          dialogRef.close();
          this.refresh();
        });
      }
    });
  }
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-station',
  templateUrl: 'dialog-station.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogStation implements OnInit {
  stationForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<DialogStation>,
      @Inject(MAT_DIALOG_DATA) public data: Station,
      private formBuilder: FormBuilder,
      private stationService: StationService
  ) { }

  ngOnInit(): void {
    this.stationForm = this.formBuilder.group({
      nom: [this.data.nom, Validators.required],
      region: [this.data.region, Validators.required],
      coordonneesGpsLatitude: [this.data.coordonneesGpsLatitude],
      coordonneesGpsLongitude: [this.data.coordonneesGpsLongitude],
      // Add more form controls for other properties if needed
    });
  }

  submit() {
    if (this.stationForm.invalid) {
      return;
    }

    const st: { coordonneesGpsLongitude: string; region: string; nom: string; coordonneesGpsLatitude: string; etat: string } = {
      nom: this.data.nom,
      region: this.data.region,
      coordonneesGpsLatitude: this.data.coordonneesGpsLatitude,
      coordonneesGpsLongitude: this.data.coordonneesGpsLongitude,
      etat: 'activer'
    };

    this.stationService.addStation(st).subscribe((res: any) => {
      // Handle success or show notification
      this.dialogRef.close();
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }

}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dialog-station',
  templateUrl: 'edit-dialog-station.html',
})
// tslint:disable-next-line:component-class-suffix
export class EditDialogStation implements OnInit {
  stationForm: FormGroup;

  constructor(
      public dialogRef: MatDialogRef<EditDialogStation>,
      @Inject(MAT_DIALOG_DATA) public data: Station,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private stationService: StationService
  ) { }

  ngOnInit(): void {
    this.stationForm = this.formBuilder.group({
      nom: [this.data.nom, Validators.required],
      region: [this.data.region, Validators.required],
      coordonneesGpsLatitude: [this.data.coordonneesGpsLatitude],
      coordonneesGpsLongitude: [this.data.coordonneesGpsLongitude],
      // Add more form controls for other properties if needed
    });
  }

  submitEdit() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Confirmer la modification',
        message: 'Êtes-vous sûr de vouloir modifier cette station ?',
        confirmText: 'Confirmer',
        confirmColor: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const id = this.data.id;
        const st: Station = {
          id: this.data.id,
          nom: this.data.nom,
          region: this.data.region,
          coordonneesGpsLatitude: this.data.coordonneesGpsLatitude,
          coordonneesGpsLongitude: this.data.coordonneesGpsLongitude,
          etat: this.data.etat
        };

        this.dialogRef.close(st);
      }
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
}
