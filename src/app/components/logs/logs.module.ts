import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MaterialModule } from "../material/material.module";
import { LogsFormComponent } from "./logs-form/logs-form.component";
import { LogsListaComponent } from "./logs-lista/logs-lista.component";
import { LogsRoutingModule } from "./routes/logs-routing.module";

@NgModule({
  imports: [CommonModule, LogsRoutingModule, ReactiveFormsModule, MatFormFieldModule, MaterialModule],
  declarations: [LogsListaComponent, LogsFormComponent]
})
export class LogsModule {}
