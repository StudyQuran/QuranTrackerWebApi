import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm'
import { Enrolment } from './enrolment.model'
import { Profile } from './profile.model'
import { School } from './school.model'

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  noOfStudents: number

  @OneToOne(() => Profile)
  @JoinColumn()
  teacherProfile: Profile

  @OneToMany(() => Enrolment, (enrolment) => enrolment.class)
  enrolment: Enrolment[]

  @ManyToOne(() => School, (school) => school.classes)
  school: School

  @Column({ type: 'datetime', default: () => 'NOW()' })
  createdOn: string

  @Column('datetime')
  updatedOn: string

  async updateUpdatedOn() {
    if (this.updatedOn) {
      this.updatedOn = new Date().toISOString()
    }
  }
}
