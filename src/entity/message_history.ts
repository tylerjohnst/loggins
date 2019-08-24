import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm"

@Entity()
export class MessageHistory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "message_uuid" })
  @Index()
  messageUUID: string

  @Column()
  @Index()
  body: string

  @Column()
  timestamp: Date
}
