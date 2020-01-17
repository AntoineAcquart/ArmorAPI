import { Entity, Unique, PrimaryColumn, OneToMany } from "typeorm";
import { Item } from "./Item";

@Entity()
@Unique(["name"])
export class Armor {
  @PrimaryColumn()
  name: string;

  @OneToMany(
    type => Item,
    item => item.armor
  )
  composition: Item[];
}
