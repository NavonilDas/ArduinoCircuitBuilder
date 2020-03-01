import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  { path: "", component: SimulatorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'open', component: ProjectComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
