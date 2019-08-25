import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm"

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  @Index()
  uuid!: string

  @Column()
  name!: string
}
