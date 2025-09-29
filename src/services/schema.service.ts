import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

type Column = { name: string; type: string };
type Relation = { column: string; references: { table: string; column: string } };
type TableSchema = { table: string; columns: Column[]; relations: Relation[] };

@Injectable()
export class SchemaService {
  constructor(private prisma: PrismaService) {}

  async getDatabaseSchema() {
    const tables = await this.prisma.$queryRaw<
      { table_name: string }[]
    >`SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'`;

    const schema: TableSchema[] = [];

    for (const { table_name } of tables) {
      const columns = await this.prisma.$queryRaw<
        { column_name: string; data_type: string }[]
      >`SELECT column_name, data_type
         FROM information_schema.columns
         WHERE table_name = ${table_name} AND table_schema='public'`;

      const relations = await this.prisma.$queryRaw<
        { column_name: string; foreign_table: string; foreign_column: string }[]
      >`
        SELECT 
          kcu.column_name,
          ccu.table_name AS foreign_table,
          ccu.column_name AS foreign_column
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = ${table_name};
      `;

      schema.push({
        table: table_name,
        columns: columns.map(c => ({ name: c.column_name, type: c.data_type })),
        relations: relations.map(r => ({
          column: r.column_name,
          references: { table: r.foreign_table, column: r.foreign_column },
        })),
      });
    }

    return schema;
  }
}
