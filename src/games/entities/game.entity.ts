import { User } from 'src/users/user.entity';
import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
@Unique(['title'])
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @Column({ nullable: true, type: 'varchar' })
  image: string;

  @Column({ nullable: true, type: 'varchar' })
  genre: string;

  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @Column({ nullable: false, type: 'varchar' })
  releaseDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
