import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ServerListComponent } from './server-list/server-list.component';
import { ServerConsoleComponent } from './server-console/server-console.component';

@NgModule({
  declarations: [
    AppComponent,
    ServerListComponent,
    ServerConsoleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
