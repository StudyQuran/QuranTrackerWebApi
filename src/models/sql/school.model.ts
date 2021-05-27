import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, BeforeUpdate } from 'typeorm'
import { Class } from './class.model'
import { Profile } from './profile.model'

@Entity()
export class School {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    location: string

    @Column()
    schoolType: string

    @OneToOne(() => Profile, (profile) => profile.school)
    profile: Profile

    @OneToMany(() => Class, (clas) => clas.school)
    classes: Class[]

    @Column({ type: 'datetime', default: () => 'NOW()' })
    joinedOn: string

    @Column('datetime')
    updatedOn: string

    async updateUpdatedOn() {
        if (this.updatedOn) {
            this.updatedOn = new Date().toISOString()
        }
    }
}
