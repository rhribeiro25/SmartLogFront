import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ModalModule } from "ngx-bootstrap/modal";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./routes/app-routing.module";
import { PopupModule } from "./shared/pop-up/pop-up.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule, ModalModule.forRoot(), PopupModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
