import { Entity, Column, Unique, PrimaryColumn } from "typeorm";

@Entity()
@Unique(["name"])
export class Item {
  @PrimaryColumn()
  name: string;

  @Column()
  type: string;

  @Column()
  value: string;
}
