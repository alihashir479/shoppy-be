import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ProductStatus } from '../enums/index.enums';

@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 100 })
    name: string

    @Column({ type: 'text' })
    description: string

    @Column({ type: 'numeric', precision: 6, scale: 2 })
    price: number

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User

    @Column({ name: 'user_id' })
    userId: number

    @Column({ nullable: true })
    imageUrl: string

    @Column({ enum: Object.keys(ProductStatus), default: ProductStatus.AVAILABLE })
    status: ProductStatus
}