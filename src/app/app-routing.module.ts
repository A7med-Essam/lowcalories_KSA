import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ProgramComponent } from './pages/program/program.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TermsComponent } from './pages/terms/terms.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'plans', component: ProgramComponent },
  { path: 'terms', component: TermsComponent },
  // {
  //   path: 'clinic',
  //   loadChildren: () =>
  //     import('./pages/clinic/clinic.module').then((m) => m.ClinicModule),
  // },
  {
    path: 'normal/:id',
    loadChildren: () =>
      import('./pages/plans/normal/normal.module').then((m) => m.NormalModule),
  },
  // {
  //   path: 'custom/:id',
  //   loadChildren: () =>
  //     import('./pages/plans/custom/custom.module').then((m) => m.CustomModule),
  // },
  { path: 'contacts', component: ContactsComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset', component: ResetPasswordComponent },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
