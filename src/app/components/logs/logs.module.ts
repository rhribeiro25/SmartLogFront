import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material/material.module";
import { LogsRoutingModule } from "../../routes/logs-routing.module";
import { ListComponent } from "./list/list.component";
import { FormComponent } from "./form/form.component";
import { UploadComponent } from "./upload/upload.component";

@NgModule({
  imports: [CommonModule, LogsRoutingModule, ReactiveFormsModule, MaterialModule],
  declarations: [ListComponent, FormComponent, UploadComponent]
})
export class LogsModule {}
