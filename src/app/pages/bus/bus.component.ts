import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Bus } from '../../models/bus';
import { BusService } from '../../services/bus.service';
import {Agence} from '../../models/agence';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.css']
})
export class BusComponent implements OnInit {
  filteredData: Bus[] = [];
  private dataSource: Bus[];
  searchText = '';

  constructor(
      private busService: BusService,
      public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllBuses();
  }

  refresh() {
    this.getAllBuses();
  }

  getAllBuses(): void {
    this.busService.getAllBusEtatActif().subscribe(
        (res: Bus[]) => {
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
    this.filteredData = this.dataSource.filter(bus => {
      // Customize the search criteria as per your requirements
      const fullSearch = `${bus.immatriculation} ${bus.marqueModele} ${bus.etat}`.toLowerCase();
      return fullSearch.includes(this.searchText.toLowerCase());
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogBus, {
      width: '500px',
      data: {
        immatriculation: '',
        marqueModele: '',
        nombrePlaces: 0,
        etat: '',
        agence: null // You can pass an agence object here if needed
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getAllBuses();
    });
  }

  openEditDialog(
      id: number,
      immatriculation: string,
      marqueModele: string,
      nombrePlaces: number,
      etat: string,
      agence: Agence
  ): void {
    const dialogRef = this.dialog.open(EditDialogBus, {
      width: '500px',
      data: {
        id: id,
        immatriculation: immatriculation,
        marqueModele: marqueModele,
        nombrePlaces: nombrePlaces,
        etat: etat,
        agence: agence // You can pass an agence object here if needed
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }

  // Add any other methods needed for managing buses

  archiverBus(id: number) {
    this.busService.archiverBus(id).subscribe((res: any) => {
      // this.showNotification('top', 'right', 'L'eleve a été supprimer', 'danger');
      this.refresh();
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-bus',
  templateUrl: 'dialog-bus.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogBus {
  // Add the necessary properties for bus creation dialog
  newNumTel: any;

  constructor(
      public dialogRef: MatDialogRef<DialogBus>,
      @Inject(MAT_DIALOG_DATA) public data: Bus,
      private busService: BusService
  ) {}

  submit() {
    // Customize the submission logic for adding a bus
    const bus: { agence: Agence; nombrePlaces: number; marqueModele: string; immatriculation: string; etat: string } = {
      immatriculation: this.data.immatriculation,
      marqueModele: this.data.marqueModele,
      nombrePlaces: this.data.nombrePlaces,
      etat: 'activer', // Assuming the default state is active when adding a new bus
      agence: this.data.agence // Add agence object here if needed
    };

    this.busService.addBus(bus).subscribe((res: any) => {
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
  selector: 'edit-dialog-bus',
  templateUrl: 'edit-dialog-bus.html',
})
// tslint:disable-next-line:component-class-suffix
export class EditDialogBus {
  // Add the necessary properties for bus edit dialog
  newNumTel: any;

  constructor(
      public dialogRef: MatDialogRef<EditDialogBus>,
      @Inject(MAT_DIALOG_DATA) public data: Bus,
      private busService: BusService
  ) {}

  submitEdit() {
    // Customize the submission logic for editing a bus
    const id = this.data.id;
    const bus: Bus = {
      id: this.data.id,
      immatriculation: this.data.immatriculation,
      marqueModele: this.data.marqueModele,
      nombrePlaces: this.data.nombrePlaces,
      etat: this.data.etat,
      agence: this.data.agence // Add agence object here if needed
    };

    this.busService.updateBus(id, bus).subscribe((res: any) => {
      this.dialogRef.close();
    });
  }

  onCancel(): void {
    // Close the dialog without any action
    this.dialogRef.close();
  }

}
