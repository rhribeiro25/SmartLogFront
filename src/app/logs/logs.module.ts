import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { LogsRoutingModule } from "./logs-routing.module";
import { LogsListaComponent } from "./logs-lista/logs-lista.component";
import { LogsFormComponent } from "./logs-form/logs-form.component";

@NgModule({
  imports: [CommonModule, LogsRoutingModule, ReactiveFormsModule],
  declarations: [LogsListaComponent, LogsFormComponent]
})
export class LogsModule {}
