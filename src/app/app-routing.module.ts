import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServerListComponent } from './components/server-list/server-list.component';
import { ServerDetailComponent } from './components/server-detail/server-detail.component';

const routes: Routes = [
  { path: '', component: ServerListComponent },
  { path: 'server/:id', component: ServerDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
