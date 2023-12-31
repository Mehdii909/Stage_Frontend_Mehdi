import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { TemplateComponent } from './template/template.component';
import { BrowserModule } from '@angular/platform-browser';
import { TokenInterceptor } from './tokeninterceptor';

import { StationComponent } from './pages/station/station.component';
import { PersonnelComponent } from './pages/personnel/personnel.component';
import { AgenceComponent } from './pages/agence/agence.component';
import { BusComponent } from './pages/bus/bus.component';
import { ChauffeurComponent } from './pages/chauffeur/chauffeur.component';
import { AnneeScolaireComponent } from './pages/annee-scolaire/annee-scolaire.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  imports: [
    MatButtonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    RouterModule.forRoot([
      {path: 'register', component: UserComponent},
      {path: 'login', component: LoginComponent},
      ]),
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    UserComponent,
    LoginComponent,
    HomeComponent,
    TemplateComponent,

  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
