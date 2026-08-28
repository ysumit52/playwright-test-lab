import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { User } from '../auth/user.entity';
import { FormSubmission } from '../forms/form-submission.entity';
import { Product } from '../products/product.entity';

export const SEED_PASSWORD = 'Password123!';

const SEED_USERS = [
  { email: 'admin@lab.test', fullName: 'Ada Admin', role: 'admin' as const },
  { email: 'editor@lab.test', fullName: 'Eli Editor', role: 'editor' as const },
  { email: 'viewer@lab.test', fullName: 'Vera Viewer', role: 'viewer' as const },
  {
    email: 'disabled@lab.test',
    fullName: 'Dana Disabled',
    role: 'viewer' as const,
    isActive: false,
  },
];

const CATEGORIES = ['Electronics', 'Apparel', 'Home', 'Outdoors', 'Toys'];
const STATUSES = ['draft', 'active', 'archived'] as const;

const PRODUCT_NAMES = [
  'Aurora Headphones',
  'Trailhead Backpack',
  'Loom Knit Sweater',
  'Harbor Desk Lamp',
  'Meadow Yoga Mat',
  'Pixel Drone',
  'Cobalt Water Bottle',
  'Fern Ceramic Mug',
  'Summit Trekking Poles',
  'Nimbus Rain Jacket',
  'Quartz Wall Clock',
  'Ember Cast Iron Pan',
  'Willow Throw Blanket',
  'Orbit Puzzle Cube',
  'Lantern Reading Light',
  'Basalt Chef Knife',
  'Cirrus Bluetooth Speaker',
  'Terra Hiking Boots',
  'Halo Ring Light',
  'Drift Skateboard',
  'Vertex Mechanical Keyboard',
  'Solstice Sunglasses',
  'Anchor Leather Wallet',
  'Prairie Picnic Basket',
  'Zenith Smart Scale',
];

@Injectable()
export class TestSupportService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    @InjectRepository(FormSubmission)
    private readonly submissions: Repository<FormSubmission>,
  ) {}

  // Truncate-and-reseed so every test run starts from an identical dataset.
  async reset(): Promise<{
    users: number;
    products: number;
    seedPassword: string;
    resetAt: string;
  }> {
    await this.submissions.clear();
    await this.products.clear();
    await this.users.clear();

    const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

    await this.users.save(
      SEED_USERS.map((seed) =>
        this.users.create({
          email: seed.email,
          fullName: seed.fullName,
          role: seed.role,
          isActive: seed.isActive ?? true,
          passwordHash,
        }),
      ),
    );

    await this.products.save(
      PRODUCT_NAMES.map((name, index) =>
        this.products.create({
          name,
          sku: `SKU-${String(index + 1).padStart(4, '0')}`,
          description: `Deterministic seed product #${index + 1} for automated tests.`,
          category: CATEGORIES[index % CATEGORIES.length],
          price: (19.99 + index * 7.5).toFixed(2),
          stock: (index * 3) % 47,
          status: STATUSES[index % STATUSES.length],
          featured: index % 4 === 0,
        }),
      ),
    );

    return {
      users: SEED_USERS.length,
      products: PRODUCT_NAMES.length,
      seedPassword: SEED_PASSWORD,
      resetAt: new Date().toISOString(),
    };
  }

  async state(): Promise<{ users: number; products: number; submissions: number }> {
    const [users, products, submissions] = await Promise.all([
      this.users.count(),
      this.products.count(),
      this.submissions.count(),
    ]);

    return { users, products, submissions };
  }
}
