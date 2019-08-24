import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm"

export enum MessageStatus {
  Created,
  Edited,
  Deleted,
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  uuid: string

  @Column({ name: "channel_uuid" })
  @Index()
  channelUUID: string

  @Column({ name: "user_uuid" })
  @Index()
  userUUID: string

  @Column()
  body: string

  @Column()
  timestamp: Date

  @Column({ nullable: true })
  edited: Date

  @Column({ type: "enum", enum: MessageStatus, default: MessageStatus.Created })
  status: MessageStatus
}
