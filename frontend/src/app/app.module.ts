import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonItemComponent } from './person-item/person-item.component';
import { PersonListComponent } from './person-list/person-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonItemComponent,
    PersonListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
