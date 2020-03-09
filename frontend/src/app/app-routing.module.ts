import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { ProjectComponent } from './project/project.component';

const routes: Routes = [
  { path: "", component: SimulatorComponent }, // Default route ie. Simulator
  { path: 'login', component: LoginComponent }, // Login Route 
  { path: 'open', component: ProjectComponent } // Open Project route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
