import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm"

export enum MessageStatus {
  Created,
  Edited,
  Deleted
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  uuid: string

  @Column()
  @Index()
  channel_uuid: string

  @Column()
  @Index()
  user_uuid: string

  @Column()
  body: string

  @Column()
  timestamp: Date

  @Column({
    nullable: true
  })
  edited: Date

  @Column({
    type: "enum",
    enum: MessageStatus,
    default: MessageStatus.Created
  })
  status: MessageStatus
}
