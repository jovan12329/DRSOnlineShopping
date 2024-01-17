import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminGeneralComponent } from './admin-general/admin-general.component';
import { UserSecondWelcomeComponent } from './user-second-welcome/user-second-welcome.component';
import { AdminProductInfoComponent } from './admin-product-info/admin-product-info.component';
import { AdminProductAddComponent } from './admin-product-add/admin-product-add.component';
import { AdminVerificationComponent } from './admin-verification/admin-verification.component';
import { AdminTrackingComponent } from './admin-tracking/admin-tracking.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserStoreComponent } from './user-store/user-store.component';
import { UserVerificationComponent } from './user-verification/user-verification.component';
import { UserPaymentsComponent } from './user-payments/user-payments.component';
import { UserConversionComponent } from './user-conversion/user-conversion.component';
import { UserHistoryComponent } from './user-history/user-history.component';
import { ProductService } from './services/product.service';
import { LogoutComponent } from './logout/logout.component';
import { RouterModule } from '@angular/router';
import { UserAmountComponent } from './user-amount/user-amount.component';

@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    RegistrationComponent,
    WelcomeComponent,
    AdminGeneralComponent,
    UserSecondWelcomeComponent,
    AdminProductInfoComponent,
    AdminProductAddComponent,
    AdminVerificationComponent,
    AdminTrackingComponent,
    UserProfileComponent,
    UserStoreComponent,
    UserVerificationComponent,
    UserPaymentsComponent,
    UserConversionComponent,
    UserHistoryComponent,
    LogoutComponent,
    UserAmountComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule

  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
