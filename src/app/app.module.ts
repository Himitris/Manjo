import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomeComponent } from './page/home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { PayerComponent } from './page/payer/payer.component';
import { EventComponent } from './page/event/event.component';
import { AvisComponent } from './page/avis/avis.component';
import { FournisseurComponent } from './page/fournisseur/fournisseur.component';
import { RestaurantComponent } from './page/restaurant/restaurant.component';
import { ActiviteComponent } from './page/activite/activite.component';
import { MatIconModule } from '@angular/material/icon';
import { ManjocarnComponent } from './page/manjocarn/manjocarn.component';
import { CarteComponent } from './page/carte/carte.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PayerComponent,
    EventComponent,
    AvisComponent,
    FournisseurComponent,
    RestaurantComponent,
    ActiviteComponent,
    ManjocarnComponent,
    CarteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    HttpClientModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
