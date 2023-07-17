import { Component, Inject, OnInit } from '@angular/core';
import { PersonnelService } from 'app/services/personnel.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PersonnelModel, User} from 'app/models/personnelModel';

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
              public dialog: MatDialog) { }

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
    this.getAllPersonnels();
    console.log(this.dataSource);
  }

  refresh() {
    this.getAllPersonnels();
  }

  private getAllPersonnels() {
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

  archiverPersonnel(id) {
    this.personnelService.archiverPersonnel(id).subscribe((res: any) => {
      this.refresh();
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

  openEditDialog(id: number, nom: string, prenom: string, email: string, fonction: string, etat: string, num: string[], user: User): void {
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
        user: user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refresh();
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-personnel',
  templateUrl: 'dialog-personnel.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogPersonnel {

  newNum: any;

  constructor(
      public dialogRef: MatDialogRef<DialogPersonnel>,
      @Inject(MAT_DIALOG_DATA) public data: PersonnelModel,
      private personnelService: PersonnelService) { }

  submit() {
    const randomPassword = Math.random().toString(36).slice(-8);
    const randomId = Math.floor(Math.random() * 1000); // Generate a random id

    this.data.user = {
      id: randomId,
      login: `${this.data.prenom}.${this.data.nom}`,
      password: randomPassword,
      userRole: 'ROLE_PERSONNEL'
    };

    this.data.etat = 'activer';

    const personnel = {
      nom: this.data.nom,
      prenom: this.data.prenom,
      email: this.data.email,
      fonction: this.data.fonction,
      etat: this.data.etat,
      num: this.data.num,
      user: this.data.user,
    };

    this.personnelService.addPersonnel(personnel).subscribe((res: any) => {
      this.dialogRef.close();
    });
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
export class EditDialogPersonnel {

  newNum: any;

  constructor(
      public dialogRef: MatDialogRef<EditDialogPersonnel>,
      @Inject(MAT_DIALOG_DATA) public data: PersonnelModel,
      private personnelService: PersonnelService) { }

  submitEdit() {
    const personnel = {
      id: this.data.id,
      nom: this.data.nom,
      prenom: this.data.prenom,
      email: this.data.email,
      fonction: this.data.fonction,
      etat: this.data.etat,
      num: this.data.num,
      user: this.data.user
    };

    this.personnelService.updatePersonnel(this.data.id, personnel).subscribe((res: any) => {
      this.dialogRef.close();
    });
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
