import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServerListComponent } from './server-list/server-list.component';
import { TerminalComponent } from './terminal/terminal.component';

const routes: Routes = [
  { path: '', component: ServerListComponent },
  { path: 'servers/:name', component: TerminalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
