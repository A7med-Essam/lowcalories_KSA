import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SelectMealsComponent } from './components/select-meals/select-meals.component';
import { SetPlanComponent } from './components/set-plan/set-plan.component';
import { ShowMealsComponent } from './components/show-meals/show-meals.component';

const routes: Routes = [
  { path: '', redirectTo: 'set-plan', pathMatch: 'full' },
  {
    path: 'set-plan',
    component: SetPlanComponent,
  },
  {
    path: 'select-meals',
    component: SelectMealsComponent,
  },
  {
    path: 'show-meals',
    component: ShowMealsComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomRoutingModule { }
