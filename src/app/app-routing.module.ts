import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'reports', component: ReportsComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' } // redirige al login si la ruta no existe
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
