import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Class } from './class.model'
import { Profile } from './profile.model'

@Entity()
export class Enrolment {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Profile, (profile) => profile.enrolment)
  profile: Profile

  @ManyToOne(() => Class, (clas) => clas.enrolment)
  class: Class

  @Column({ type: 'datetime', default: () => 'NOW()' })
  enrolledOn: string
}
