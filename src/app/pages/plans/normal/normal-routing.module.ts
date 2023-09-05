import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetPlanComponent } from './components/set-plan/setPlan.component';
import { ShowMealsComponent } from './components/show-meals/showMeals.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

const routes: Routes = [
  { path: '', redirectTo: 'set-plan', pathMatch: 'full' },
  {
    path: 'set-plan',
    component: SetPlanComponent,
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
  exports: [RouterModule],
})
export class NormalRoutingModule {}
