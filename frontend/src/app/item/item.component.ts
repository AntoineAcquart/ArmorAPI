import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Item } from "./item.entity";
import { ItemService } from "./item.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.sass"]
})
export class ItemComponent implements OnInit {
  type: string;
  items: Item[] = [];

  addItemGroup = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.pattern(new RegExp("^([a-zA-Z_0-9]+.?)*[a-zA-Z_0-9]+$"))
    ]),
    value: new FormControl(null, [Validators.required])
  });
  addItemForm = false;
  addItemFormError: string;

  editItemControl: FormControl[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly itemService: ItemService,
    private readonly fb: FormBuilder
  ) {
    this.type = route.snapshot.data.type;
  }

  ngOnInit() {
    this.itemService.getItems(this.type).subscribe({
      next: items => {
        this.items = items;
        items.forEach(item => {
          this.editItemControl[item.name] = new FormControl(item.value, [
            Validators.required
          ]);
        });
      }
    });
  }

  toggleAddItemForm() {
    this.addItemForm = !this.addItemForm;
    delete this.addItemFormError;
    this.addItemGroup.get("name").reset();
    this.addItemGroup.get("value").reset();
  }

  addItem() {
    delete this.addItemFormError;
    if (this.addItemGroup.invalid) {
      return;
    }
    const item: Item = {
      type: this.type,
      name: this.addItemGroup.get("name").value,
      value: this.addItemGroup.get("value").value
    };

    this.itemService.createItem(this.type, item).subscribe({
      next: response => {
        this.items.push(response);
        this.editItemControl[response.name] = new FormControl(response.value, [
          Validators.required
        ]);
        this.toggleAddItemForm();
      },
      error: err => {
        this.addItemFormError = `Name is already in use.`;
        console.log("error:", err);
      }
    });
  }

  editItem(item: Item) {
    if (this.editItemControl[item.name].invalid) {
      return;
    }

    const editedItem = {
      ...item,
      value: this.editItemControl[item.name].value
    };

    this.itemService.updateItem(this.type, editedItem, item.name).subscribe({
      next: () => {
        item.value = editedItem.value;
      },
      error: err => {
        console.log("error:", err);
      }
    });
  }

  deleteItem(item: Item) {
    this.itemService.deleteItem(this.type, item.name).subscribe({
      next: () => {
        this.items.splice(
          this.items.findIndex(_item => _item.name === item.name),
          1
        );
        delete this.editItemControl[item.name];
      },
      error: err => {
        console.log("error:", err);
      }
    });
  }
}
