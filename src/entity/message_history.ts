import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm"
import { MessageStatus } from "./message"

@Entity()
export class MessageHistory {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  message_uuid: string

  @Column()
  @Index()
  body: string

  @Column()
  timestamp: Date
}
