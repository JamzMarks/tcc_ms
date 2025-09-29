import { AuthGuard } from '@guards/auth.guard';
import { Controller, Get, UseGuards, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SchemaService } from '@services/schema.service';

@Controller('schema')
@UseGuards(AuthGuard)
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @ApiOperation({ summary: 'Get database schema' })
  @ApiResponse({ status: 200, description: 'OK.' })
  @Version('1')
  @Get()
  async getSchema() {
    return this.schemaService.getDatabaseSchema();
  }
}
