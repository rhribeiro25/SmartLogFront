import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LogsListaComponent } from "./logs-lista/logs-lista.component";

const routes: Routes = [
  {
    path: "",
    component: LogsListaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReactiveSearchRoutingModule {}
