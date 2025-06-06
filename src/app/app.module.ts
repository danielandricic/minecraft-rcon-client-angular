import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServerListComponent } from './components/server-list/server-list.component';
import { ServerDetailComponent } from './components/server-detail/server-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    ServerListComponent,
    ServerDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
