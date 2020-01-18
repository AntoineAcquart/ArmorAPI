import { Component, OnInit } from "@angular/core";
import { ArmorService } from "./armor.service";
import { ItemService } from "../item/item.service";
import { Armor } from "./armor.entity";
import {  FormBuilder,  FormGroup,  Validators,  FormControl} from "@angular/forms";
import { Item } from '../item/item.entity';
@Component({
  selector: "app-armor",
  templateUrl: "./armor.component.html",
  styleUrls: ["./armor.component.sass"]
})
export class ArmorComponent implements OnInit {
  Armors: Armor[] = [];
  PartsArmor : string[] = ["helmet","arm","torso","leg","cape"];
  Helmets : Item[] = [];
  Arms : Item[] = [];
  Torsos : Item[] = [];
  Legs : Item[] = [];
  Capes : Item[] = [];

  CompositionArmor : Item[]=[];
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

  editArmorControl: FormControl[] = [];

  constructor(private armorService: ArmorService, private itemService : ItemService) {}

  ngOnInit() {
    this.armorService.getArmors().subscribe({
      next: response => {
        this.Armors = response;
        this.Armors.forEach(armor => {
          
        });
      },

      error: err => console.error("error : ", err)
    });


    this.PartsArmor.forEach(part => {
      this.itemService.getItems(part).subscribe({
        next: response => {
          switch(part){
            case 'helmet': {this.Helmets = response;break;}
            case 'arm': {this.Arms = response;break;}
            case 'torso':{ this.Torsos = response; break;}
            case 'leg': {this.Legs = response;break;}
            case 'cape': {this.Capes = response;break;}
          }
        }
      })

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

  
  partToAdd : Item ;
  addArmor() {
    delete this.addArmorFormError;
    if (this.addArmorGroup.invalid) {
      return;
    }
    this.PartsArmor.forEach(part => {//pas eu le temps de terminer
      // switch(part){
      //   case 'helmet': { this.partToAdd = this.Helmets.find<Item>(item => this.addArmorGroup.get(part).value);break;}
      //   case 'arm': {this.Arms = ;break;}
      //   case 'torso':{ this.Torsos = ; break;}
      //   case 'leg': {this.Legs = ;break;}
      //   case 'cape': {this.Capes = ;break;}
      // }
      this.CompositionArmor.push();
    });
    
    const armor: Armor = {
      name: this.addArmorGroup.get("name").value,
      composition: this.CompositionArmor
    };

    this.armorService.createArmor(armor).subscribe({
      next: response => {
        this.Armors.push(response);
        // this.editItemControl[response.name] = new FormControl(response.value, [
        //   Validators.required
        // ]);
        this.toggleAddArmorForm();
      },
      error: err => {
        this.addArmorFormError = `Name is already in use.`;
        console.log("error:", err);
      }
    });
  }
}
