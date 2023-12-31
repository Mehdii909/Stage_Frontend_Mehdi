import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {EleveComponent, DialogEleve, EditDialogEleve} from '../../pages/eleve/eleve.component';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxMaskDirective} from 'ngx-mask';
import {ClasseComponent, DialogClasse, EditDialogClasse} from '../../pages/classe/classe.component';
import {DialogStation, EditDialogStation, StationComponent} from '../../pages/station/station.component';
import {DialogPersonnel, EditDialogPersonnel, PersonnelComponent} from '../../pages/personnel/personnel.component';
import {AgenceComponent, DialogAgence, EditDialogAgence} from '../../pages/agence/agence.component';
import {BusComponent, DialogBus, EditDialogBus} from '../../pages/bus/bus.component';
import {ChauffeurComponent, DialogChauffeur, EditDialogChauffeur} from '../../pages/chauffeur/chauffeur.component';
import {
    AnneeScolaireComponent,
    DialogAnneeScolaire,
    EditDialogAnneeScolaire
} from '../../pages/annee-scolaire/annee-scolaire.component';
import {ConfirmDialogComponent} from '../../pages/confirmDialog/confirmDialog.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatDialogModule,
        NgxMaskDirective,
    ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    EleveComponent, DialogEleve, EditDialogEleve,
    ClasseComponent, DialogClasse, EditDialogClasse,
    StationComponent, DialogStation, EditDialogStation,
    PersonnelComponent, DialogPersonnel, EditDialogPersonnel,
    AgenceComponent, DialogAgence, EditDialogAgence,
    BusComponent, DialogBus, EditDialogBus,
    ChauffeurComponent, DialogChauffeur, EditDialogChauffeur,
    AnneeScolaireComponent, DialogAnneeScolaire, EditDialogAnneeScolaire,
      ConfirmDialogComponent

  ]
})

export class AdminLayoutModule {}
