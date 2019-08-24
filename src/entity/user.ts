import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  uuid: string

  @Column()
  name: string

  @Column()
  handle: string

  @Column()
  avatar: string
}
