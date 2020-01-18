import { Entity, Unique, PrimaryColumn, ManyToMany, JoinTable } from "typeorm";
import { Item } from "./Item";

@Entity()
@Unique(["name"])
export class Armor {
  @PrimaryColumn()
  name: string;

  @ManyToMany(
    type => Item,
    item => item.armor,
    { cascade: true, eager: true }
  )
  @JoinTable()
  composition: Item[];
}
