import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { Enrolment } from './enrolment.model'
import { School } from './school.model'
import { User } from './user.model'

enum accType {
  'superAdmin',
  'admin',
  'teacher',
  'parent',
  'student'
}

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ nullable: true })
  familyId: number

  @OneToOne(() => School, (school) => school.profile)
  @JoinColumn()
  school: School

  @OneToMany(() => Enrolment, (enrolment) => enrolment.profile)
  enrolment: Enrolment[]

  @Column({ type: 'enum', enum: accType })
  accType: accType

  @OneToOne(() => User, (user) => user.profile)
  user: User
}
