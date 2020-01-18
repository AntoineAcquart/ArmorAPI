import { Component, OnInit } from "@angular/core";
import { ArmorService } from "./armor.service";
import { Armor } from "./armor.entity";
@Component({
  selector: "app-armor",
  templateUrl: "./armor.component.html",
  styleUrls: ["./armor.component.sass"]
})
export class ArmorComponent implements OnInit {
  Armors: Armor[] = [];

  constructor(private armorService: ArmorService) {}

  ngOnInit() {
    this.armorService.getArmors().subscribe({
      next: response => {
        this.Armors = response;
      },
      error: err => console.error("error : ", err)
    });
  }
}
