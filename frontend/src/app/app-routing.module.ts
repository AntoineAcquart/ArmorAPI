import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArmorComponent } from "./armor/armor.component";
import { ItemComponent } from "./item/item.component";

const routes: Routes = [
  { path: "armor", component: ArmorComponent },

  { path: "helmet", data: { type: "helmet" }, component: ItemComponent },
  { path: "arm", data: { type: "arm" }, component: ItemComponent },
  { path: "torso", data: { type: "torso" }, component: ItemComponent },
  { path: "leg", data: { type: "leg" }, component: ItemComponent },
  { path: "cape", data: { type: "cape" }, component: ItemComponent },

  { path: "**", redirectTo: "armor", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
