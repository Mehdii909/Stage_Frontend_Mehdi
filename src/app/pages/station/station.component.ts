import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Station } from '../../models/Station';
import { StationService } from '../../services/station.service';

import * as L from 'leaflet';


@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})

export class StationComponent implements OnInit {
  filteredData: any[] = [];
  private dataSource: any;
  searchText = '';

  constructor(private stationService: StationService, public dialog: MatDialog) { }

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

  archiverStation(id: number) {
    this.stationService.archiverStation(id).subscribe((res: any) => {
      // Handle success or show notification
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
    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
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
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-station',
  templateUrl: 'dialog-station.html',
})

// tslint:disable-next-line:component-class-suffix
export class DialogStation implements OnInit {

  @ViewChild('mapContainer', { static: true }) mapContainer: ElementRef;
  map: any;

  constructor(
      public dialogRef: MatDialogRef<DialogStation>,
      @Inject(MAT_DIALOG_DATA) public data: Station,
      private stationService: StationService
  ) { }

  ngOnInit() {
  }

  submit() {
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
    // Close the dialog without any action
    this.dialogRef.close();
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'edit-dialog-station',
  templateUrl: 'edit-dialog-station.html',
})
// tslint:disable-next-line:component-class-suffix
export class EditDialogStation {
  constructor(
      public dialogRef: MatDialogRef<EditDialogStation>,
      @Inject(MAT_DIALOG_DATA) public data: Station,
      private stationService: StationService
  ) { }

  submitEdit() {
    const id = this.data.id;

    const st: { id: number; coordonneesGpsLongitude: string; region: string; nom: string; coordonneesGpsLatitude: string; etat: string } = {
      id: this.data.id,
      nom: this.data.nom,
      region: this.data.region,
      coordonneesGpsLatitude: this.data.coordonneesGpsLatitude,
      coordonneesGpsLongitude: this.data.coordonneesGpsLongitude,
      etat: this.data.etat
    };

    this.stationService.updateStation(id, st).subscribe((res: any) => {
      // Handle success or show notification
      this.dialogRef.close();
    });
  }

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }
}
