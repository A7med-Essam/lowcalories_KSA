import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
// import { PlansComponent } from './components/plans/plans.component';
// import { NotificationsComponent } from './components/notifications/notifications.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AskUsComponent } from './components/ask-us/ask-us.component';
import { MyAddressesComponent } from './components/my-addresses/my-addresses.component';
// import { BranchesComponent } from './components/branches/branches.component';
// import { BranchDetailsComponent } from './components/branch-details/branch-details.component';
import { ChatWithUsComponent } from './components/chat-with-us/chat-with-us.component';
// import { TermsComponent } from './components/terms/terms.component';
// import { MenuComponent } from './components/menu/menu.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { PasswordModule } from "primeng/password";
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';



@NgModule({
  declarations: [
    ProfileComponent,
    PersonalInformationComponent,
    // PlansComponent,
    SettingsComponent,
    // NotificationsComponent,
    // TermsComponent,
    ChangePasswordComponent,
    AskUsComponent,
    // MenuComponent,
    MyAddressesComponent,
    // BranchesComponent,
    // BranchDetailsComponent,
    ChatWithUsComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    DropdownModule,
    FormsModule,
    PasswordModule,
    DialogModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    SkeletonModule,
    CalendarModule,
    InputTextModule
  ]
})
export class ProfileModule { }
