import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { FooterComponent } from './pages/footer/footer.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ProgramComponent } from './pages/program/program.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { FaqComponent } from './pages/faq/faq.component';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { APP_STORE, APP_EFFECTS } from './store/appStore';
import { AuthInterceptor } from './core/interceptor/http.interceptor';
import { ErrorHandlerInterceptor } from './core/interceptor/error-handler.interceptor';
import { LottieModule } from 'ngx-lottie';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function playerFactory() {
  return import('lottie-web');
}

const APP_PRIMENG_MODULE = [
  DropdownModule,
  SkeletonModule,
  ImageModule,
  CalendarModule,
  DialogModule
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    MenuComponent,
    ContactsComponent,
    TermsComponent,
    ProgramComponent,
    RegisterComponent,
    LoginComponent,
    NotfoundComponent,
    ForgetPasswordComponent,
    FaqComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(APP_STORE),
    EffectsModule.forRoot(APP_EFFECTS),
    CarouselModule,
    APP_PRIMENG_MODULE,
    LottieModule.forRoot({ player: playerFactory }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: CreateTranslateLoader,
        deps: [HttpClient]
      }
    }),
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
export function CreateTranslateLoader(http:HttpClient) {
  return  new TranslateHttpLoader(http, './assets/i18n/', '.json');
}