import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {EleveComponent} from '../../pages/eleve/eleve.component';
import {ClasseComponent} from '../../pages/classe/classe.component';
import {StationComponent} from '../../pages/station/station.component';
import {PersonnelComponent} from '../../pages/personnel/personnel.component';
import {AgenceComponent} from '../../pages/agence/agence.component';
import {Bus} from '../../models/bus';
import {BusComponent} from '../../pages/bus/bus.component';
import {ChauffeurComponent} from '../../pages/chauffeur/chauffeur.component';
import {AnneeScolaireComponent} from '../../pages/annee-scolaire/annee-scolaire.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }

    { path: 'dashboard',      component: DashboardComponent },
    // { path: 'user-profile',   component: UserProfileComponent },
    { path: 'eleves',        component: EleveComponent },
    { path: 'personnels',  component: PersonnelComponent },
    { path: 'classes',        component: ClasseComponent },
    { path: 'stations',        component: StationComponent },
    { path: 'agences',        component: AgenceComponent },
    { path: 'bus',        component: BusComponent },
    { path: 'chauffeurs',        component: ChauffeurComponent },
    { path: 'annee-scolaire',        component: AnneeScolaireComponent },



    // { path: 'table-list',     component: TableListComponent },
    // { path: 'typography',     component: TypographyComponent },
    // { path: 'icons',          component: IconsComponent },
    // { path: 'maps',           component: MapsComponent },
    // { path: 'notifications',  component: NotificationsComponent },
    // { path: 'upgrade',        component: UpgradeComponent },
];
