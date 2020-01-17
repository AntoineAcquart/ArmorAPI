import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Item } from "./item.entity";
import { ItemService } from "./item.service";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.sass"]
})
export class ItemComponent implements OnInit {
  type: string;
  items: Item[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly itemService: ItemService
  ) {
    this.type = route.snapshot.data.type;
  }

  ngOnInit() {
    this.itemService.getItems(this.type).subscribe({
      next: items => {
        this.items = items;
      }
    });
  }
}
