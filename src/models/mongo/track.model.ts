import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm'

export class Lesson {
    @Column()
    about: string

    @Column()
    education: string

    @Column()
    career: string
}

@Entity()
export class Track {
    @ObjectIdColumn()
    id: ObjectID

    @Column()
    name: string

    @Column((type) => Lesson)
    lesson: Lesson

    @Column({ type: 'timestamp with time zone', default: () => 'NOW()' })
    createdOn: string

    @Column('datetime')
    updatedOn: string
}
