import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn, AfterUpdate } from 'typeorm'
import { hash, genSalt, compare } from 'bcryptjs'
import { Profile } from './profile.model'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  userName: string

  @Column()
  email: string

  @Column()
  password: string

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile

  @Column({ default: false })
  isActive: boolean

  @Column({ type: 'datetime', default: () => 'NOW()' })
  createdOn: string

  @Column('datetime')
  updatedOn: string

  async changePassword() {
    if (this.updatedOn) {
      this.updatedOn = new Date().toISOString()
    }
    if (this.password) {
      const salt = await genSalt(10)
      const hashedPassword = await hash(this.password, salt)
      this.password = hashedPassword
    }
  }
  async updateUpdatedOn() {
    if (this.updatedOn) {
      this.updatedOn = new Date().toISOString()
    }
  }
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await genSalt(10)
      const hashedPassword = await hash(this.password, salt)
      this.password = hashedPassword
    }
  }
  async isValidPassword(password: string) {
    try {
      return await compare(password, this.password)
    } catch (error) {
      throw error
    }
  }
}
