import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Item } from "./item.entity";
import { ItemService } from "./item.service";
import { ArmorService } from "../armor/armor.service";
import {
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

  armorItems: Item[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly itemService: ItemService,
    private readonly armorService: ArmorService,
  ) {
    this.type = route.snapshot.data.type;
  }

  ngOnInit() {
    this.itemService.getItems(this.type).subscribe({//get all items depending on the type of item (helmet, arms, torso...)
      next: items => {
        this.items = items;//init array of items
        items.forEach(item => {
          this.editItemControl[item.name] = new FormControl(item.value, [//creation of formControl to each item to handle modification
            Validators.required
          ]);
        });
      }
    });
    this.armorService.getArmors().subscribe({//get all the armors to check afterwards if an item belongs to an armor 
      next: armors => {

        armors.forEach(armor => {
          armor.composition.forEach(item => {
            this.armorItems[item.name] = item;
          });
        });
      }
    });
  }

  toggleAddItemForm() {//display or not the form create item
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
      name: this.addItemGroup.get("name").value,//get value from input in creation form
      value: this.addItemGroup.get("value").value
    };

    this.itemService.createItem(this.type, item).subscribe({//send to back the new item
      next: response => {
        this.items.push(response);//add new item to the item array
        this.editItemControl[response.name] = new FormControl(response.value, [//and create a new formcontrol for edition
          Validators.required
        ]);
        this.toggleAddItemForm();//remove creation form
      },
      error: err => {//error handling
        this.addItemFormError = `Name is already in use.`;
        console.log("error:", err);
      }
    });
  }

  editItem(item: Item) {
    if (this.editItemControl[item.name].invalid) {
      return;
    }

    const editedItem = {//init modified item
      ...item,
      value: this.editItemControl[item.name].value//get value from input in edit form
    };

    this.itemService.updateItem(this.type, editedItem, item.name).subscribe({//send updated item to back
      next: () => {
        item.value = editedItem.value;
      },
      error: err => {//error handling
        console.log("error:", err);
      }
    });
  }

  deleteItem(item: Item) {
    this.itemService.deleteItem(this.type, item.name).subscribe({//send deleted item to back
      next: () => {
        this.items.splice(//remove item from the item array
          this.items.findIndex(_item => _item.name === item.name),
          1
        );
        delete this.editItemControl[item.name];
      },
      error: err => {//error handling
        console.log("error:", err);
      }
    });
  }
}
