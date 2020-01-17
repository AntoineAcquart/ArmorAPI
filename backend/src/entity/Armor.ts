import {
  Entity,
  Column,
  Unique,
  ManyToMany,
  JoinTable,
  PrimaryColumn
} from "typeorm";
import { Item } from "./Item";

@Entity()
@Unique(["name"])
export class Armor {
  @PrimaryColumn()
  name: string;

  @ManyToMany(type => Item)
  @JoinTable()
  composition: Item[];
}
