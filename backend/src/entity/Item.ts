import { Entity, Column, Unique, PrimaryColumn, ManyToOne } from "typeorm";
import { Armor } from "./Armor";

@Entity()
@Unique(["name"])
export class Item {
  @PrimaryColumn()
  name: string;

  @Column()
  type: string;

  @Column()
  value: string;

  @ManyToOne(
    type => Armor,
    armor => armor.composition
  )
  armor: Armor;
}
