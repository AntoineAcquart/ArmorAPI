import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ArmorComponent } from "./armor/armor.component";
import { ItemComponent } from "./item/item.component";
import { HeaderComponent } from "./header/header.component";

import { MatCardModule } from "@angular/material/card";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, ArmorComponent, HeaderComponent, ItemComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
