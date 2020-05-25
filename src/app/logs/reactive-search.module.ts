import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReactiveSearchRoutingModule } from "./reactive-search-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { LogsListaComponent } from "./logs-lista/logs-lista.component";

@NgModule({
  declarations: [LogsListaComponent],
  imports: [CommonModule, ReactiveSearchRoutingModule, ReactiveFormsModule]
})
export class ReactiveSearchModule {}
