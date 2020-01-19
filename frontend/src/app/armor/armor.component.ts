import { Component, OnInit } from "@angular/core";
import { ArmorService } from "./armor.service";
import { ItemService } from "../item/item.service";
import { Armor } from "./armor.entity";
import {
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Item } from "../item/item.entity";
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
@Component({
  selector: "app-armor",
  templateUrl: "./armor.component.html",
  styleUrls: ["./armor.component.sass"]
})
export class ArmorComponent implements OnInit {
  armors: Armor[] = [];
  itemTypes: string[] = ["helmet", "arm", "torso", "leg", "cape"];
  helmets: Item[] = [];
  arms: Item[] = [];
  torsos: Item[] = [];
  legs: Item[] = [];
  capes: Item[] = [];
  
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

  isLoading;
  
  constructor(
    private armorService: ArmorService,
    private itemService: ItemService
    ) {}
    
    ngOnInit() {
      this.armorService.getArmors().subscribe({//get all armors from back
        next: response => {
          this.armors = response;//init array of armors
          response.forEach(armor => {
            this.editArmorGroup[armor.name] = new FormGroup({});//creation of FormGroup to each armor to handle modification of an armor
            armor.composition.forEach(item => {
              this.editArmorGroup[armor.name].addControl(item.type, new FormControl(item.name, [Validators.required]));
            });
          });
        },
        error: err => console.error("error : ", err)
      });
    
      this.itemTypes.forEach(type => {//init arrays of each item
        this.itemService.getItems(type).subscribe({
        next: response => {
          switch (type) {
            case "helmet": {
              this.helmets = response;
              break;
            }
            case "arm": {
              this.arms = response;
              break;
            }
            case "torso": {
              this.torsos = response;
              break;
            }
            case "leg": {
              this.legs = response;
              break;
            }
            case "cape": {
              this.capes = response;
              break;
            }
          }
        }
      });
    });
  }
  
  toggleAddArmorForm() {//display or not the form create armor
    this.addArmorForm = !this.addArmorForm;
    delete this.addArmorFormError;
    this.addArmorGroup.get("name").reset();
    this.itemTypes.forEach(type => {
      this.addArmorGroup.get(type).reset();
    });
  }
  
  addArmor() {
    delete this.addArmorFormError;
    if (this.addArmorGroup.invalid) {
      return;
    }
    this.isLoading = true;
    const armor: Armor = {
      name: this.addArmorGroup.get("name").value,
      composition: []
    };
    this.itemTypes.forEach(type => {//set composition of the new armor. Get values from selects form
      switch(type){
        case 'helmet': { armor.composition.push(this.helmets.find(item => item.name === this.addArmorGroup.get(type).value));break;}
        case 'arm': {armor.composition.push(this.arms.find(item => item.name === this.addArmorGroup.get(type).value));break;}
        case 'torso':{ armor.composition.push(this.torsos.find(item => item.name === this.addArmorGroup.get(type).value)); break;}
        case 'leg': {armor.composition.push(this.legs.find(item => item.name === this.addArmorGroup.get(type).value));break;}
        case 'cape': {armor.composition.push(this.capes.find(item => item.name === this.addArmorGroup.get(type).value));break;}
      }
    });     
    
    this.armorService.createArmor(armor).subscribe({//send new armor to back
      next: newArmor => {
        this.armors.push(newArmor);
        this.editArmorGroup[armor.name] = new FormGroup({});//and create a new formgroup for edition
        newArmor.composition.forEach(item => {
          this.editArmorGroup[newArmor.name].addControl(item.type, new FormControl(item.name, [Validators.required]));
        });
        this.toggleAddArmorForm();//remove creation form
        this.isLoading = false;
      },
      error: err => {//error handling
        this.addArmorFormError = `Name is already in use.`;
        console.log("error:", err);
      }
    });
  }
  
  
  editArmor(armorName: string) {
    
    if (this.editArmorGroup[armorName].invalid) {
      return;
    }
    
    this.isLoading = true;

    const armor: Armor = {
      name: armorName,
      composition: []
    }

    this.itemTypes.forEach(type => {//set composition of the edited armor. Get values from selects form
      switch(type){
        case 'helmet': { armor.composition.push(this.helmets.find(item => item.name === this.editArmorGroup[armor.name].get(type).value));break;}
        case 'arm': {armor.composition.push(this.arms.find(item => item.name === this.editArmorGroup[armor.name].get(type).value));break;}
        case 'torso':{ armor.composition.push(this.torsos.find(item => item.name === this.editArmorGroup[armor.name].get(type).value)); break;}
        case 'leg': {armor.composition.push(this.legs.find(item => item.name === this.editArmorGroup[armor.name].get(type).value)) ;break;}
        case 'cape': {armor.composition.push(this.capes.find(item => item.name === this.editArmorGroup[armor.name].get(type).value));break;}
      }
    });

    this.armorService.updateArmor(armor, armor.name).subscribe({//send to back the updated armor
      next: () => {
        this.armors.find(armorToFind => armorToFind.name === armor.name).composition = armor.composition;//update armor modified in armors array
        this.isLoading = false;
      },
      error: err => {//error handling
        console.log("error:", err);
      }
    });
  }

  isEdited(armor: Armor) {//function that check if an armor has been modified. If there is no modification the button update is disabled
    let isEdited = false;
    this.itemTypes.forEach(type => {    
      if(armor.composition.find(item => item.type === type).name !== this.editArmorGroup[armor.name].get(type).value) {
        isEdited = true;
      };
    }); 
    return isEdited;
  }

  deleteArmor(armor:Armor) {
    this.isLoading = true;
    this.armorService.deleteArmor(armor.name).subscribe({//send armor to delete to back
      next: () => {
        this.armors.splice(//remove the armor from armors array
          this.armors.findIndex(_armor => _armor.name === armor.name),
          1
        );
        delete this.editArmorGroup[armor.name];//delete her FormGroup
        this.isLoading = false;
      },
      error: err => {//error handling
        console.log("error:", err);
      }
    });
  }

}
