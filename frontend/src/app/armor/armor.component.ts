import { Component, OnInit } from "@angular/core";
import { ArmorService } from "./armor.service";
import { ItemService } from "../item/item.service";
import { Armor } from "./armor.entity";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Item } from "../item/item.entity";
@Component({
  selector: "app-armor",
  templateUrl: "./armor.component.html",
  styleUrls: ["./armor.component.sass"]
})
export class ArmorComponent implements OnInit {
  Armors: Armor[] = [];
  PartsArmor: string[] = ["helmet", "arm", "torso", "leg", "cape"];
  Helmets: Item[] = [];
  Arms: Item[] = [];
  Torsos: Item[] = [];
  Legs: Item[] = [];
  Capes: Item[] = [];
  ItemsNames : string[] = [];
  
  CompositionArmor: Item[] = [];
  UpdateCompositionArmor: Item[] = [];
  
  partToAdd: Item;
  partToUpdate: Item;

  addArmorGroup = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.pattern(new RegExp("^([a-zA-Z_0-9]+.?)*[a-zA-Z_0-9]+$"))
    ]),
    helmet: new FormControl(null, [Validators.required]),
    arm: new FormControl(null, [Validators.required]),
    torso: new FormControl(null, [Validators.required]),
    leg: new FormControl(null, [Validators.required]),
    cape: new FormControl(null, [Validators.required])
  });
  addArmorForm = false;
  addArmorFormError: string;
 
  editArmorGroup : FormGroup[] = [];

  constructor(
    private armorService: ArmorService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.armorService.getArmors().subscribe({
      next: response => {
        this.Armors = response;
        this.Armors.forEach(armor => {
          this.editArmorGroup[armor.name] = new FormGroup({
            helmet: new FormControl(armor.composition[0].name, [Validators.required]),
            arm: new FormControl(armor.composition[1].name, [Validators.required]),
            torso: new FormControl(armor.composition[2].name, [Validators.required]),
            leg: new FormControl(armor.composition[3].name, [Validators.required]),
            cape: new FormControl(armor.composition[4].name, [Validators.required])
          });
        });
      },
      error: err => console.error("error : ", err)
    });

    this.PartsArmor.forEach(part => {
      this.itemService.getItems(part).subscribe({
        next: response => {
          switch (part) {
            case "helmet": {
              this.Helmets = response;
              break;
            }
            case "arm": {
              this.Arms = response;
              break;
            }
            case "torso": {
              this.Torsos = response;
              break;
            }
            case "leg": {
              this.Legs = response;
              break;
            }
            case "cape": {
              this.Capes = response;
              break;
            }
          }
        }
      });
    });
  }

  toggleAddArmorForm() {
    this.addArmorForm = !this.addArmorForm;
    delete this.addArmorFormError;
    this.addArmorGroup.get("name").reset();
    this.PartsArmor.forEach(part => {
      this.addArmorGroup.get(part).reset();
    });
  }

  addArmor() {
    delete this.addArmorFormError;
    if (this.addArmorGroup.invalid) {
      return;
    }
    this.PartsArmor.forEach(part => {
      switch(part){
        case 'helmet': { this.partToAdd = this.Helmets.find(item => item.name = this.addArmorGroup.get(part).value);break;}
        case 'arm': {this.partToAdd = this.Arms.find(item => item.name = this.addArmorGroup.get(part).value);break;}
        case 'torso':{ this.partToAdd = this.Torsos.find(item => item.name = this.addArmorGroup.get(part).value); break;}
        case 'leg': {this.partToAdd = this.Legs.find(item => item.name = this.addArmorGroup.get(part).value) ;break;}
        case 'cape': {this.partToAdd = this.Capes.find(item => item.name = this.addArmorGroup.get(part).value);break;}
      }
      this.CompositionArmor.push(this.partToAdd);
    }); 

    const armor: Armor = {
      name: this.addArmorGroup.get("name").value,
      composition: this.CompositionArmor
    };

    this.armorService.createArmor(armor).subscribe({
      next: newArmor => {
        this.Armors.push(newArmor);
        this.editArmorGroup[newArmor.name] = new FormGroup({
          helmet: new FormControl(newArmor.composition[0].name, [Validators.required]),
          arm: new FormControl(newArmor.composition[1].name, [Validators.required]),
          torso: new FormControl(newArmor.composition[2].name, [Validators.required]),
          leg: new FormControl(newArmor.composition[3].name, [Validators.required]),
          cape: new FormControl(newArmor.composition[4].name, [Validators.required])
        });
        this.toggleAddArmorForm();
      },
      error: err => {
        this.addArmorFormError = `Name is already in use.`;
        console.log("error:", err);
      }
    });
  }

  
  // editArmor(armor: Armor) {
  //   if (this.editArmorGroup[armor.name].invalid) {
  //     return;
  //   }

  //   this.PartsArmor.forEach(part => {
  //     switch(part){
  //       case 'helmet': { this.partToUpdate = this.Helmets.find(item => item.name = this.editArmorGroup[armor.name].get(part).value);break;}
  //       case 'arm': {this.partToUpdate = this.Arms.find(item => item.name = this.editArmorGroup[armor.name].get(part).value);break;}
  //       case 'torso':{ this.partToUpdate = this.Torsos.find(item => item.name = this.editArmorGroup[armor.name].get(part).value); break;}
  //       case 'leg': {this.partToUpdate = this.Legs.find(item => item.name = this.editArmorGroup[armor.name].get(part).value) ;break;}
  //       case 'cape': {this.partToUpdate = this.Capes.find(item => item.name = this.editArmorGroup[armor.name].get(part).value);break;}
  //     }
  //     this.UpdateCompositionArmor.push(this.partToUpdate);
  //   }); 
  //   const editedArmor = {
  //     ...armor,
  //     composition: this.UpdateCompositionArmor
  //   };
  //   this.armorService.updateArmor(editedArmor, armor.name).subscribe({
  //     next: () => {
  //       armor.composition = editedArmor.composition;
  //     },
  //     error: err => {
  //       console.log("error:", err);
  //     }
  //   });
  // }

  deleteArmor(armor:Armor) {
    this.armorService.deleteArmor(armor.name).subscribe({
      next: () => {
        this.Armors.splice(
          this.Armors.findIndex(_armor => _armor.name === armor.name),
          1
        );
        delete this.editArmorGroup[armor.name];
      },
      error: err => {
        console.log("error:", err);
      }
    });
  }

  isDisabled(itemName : string){
    this.Armors.forEach(armor => {
    armor.composition.forEach(item => {
    this.ItemsNames.push(item.name)
  });
});
  }
}
