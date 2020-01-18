import {
  Entity,
  Column,
  Unique,
  PrimaryColumn,
  ManyToOne,
  JoinTable,
  ManyToMany
} from "typeorm";
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

  @ManyToMany(
    type => Armor,
    armor => armor.composition
  )
  armor: Armor;
}
