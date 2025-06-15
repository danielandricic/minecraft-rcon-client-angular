import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServerListComponent } from './server-list/server-list.component';
import { ServerConsoleComponent } from './server-console/server-console.component';

const routes: Routes = [
  { path: '', redirectTo: 'servers', pathMatch: 'full' },
  { path: 'servers', component: ServerListComponent },
  { path: 'servers/:id', component: ServerConsoleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
