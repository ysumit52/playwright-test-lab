import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ProductStatus = 'draft' | 'active' | 'archived';

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Apparel',
  'Home',
  'Outdoors',
  'Toys',
] as const;

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  sku!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({ type: 'varchar' })
  category!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  price!: string;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ type: 'varchar', default: 'draft' })
  status!: ProductStatus;

  @Column({ default: false })
  featured!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
