import { Controller, Get, Post, Body } from '@nestjs/common';
import { TableStateService } from './table-state.service';
import { TableState } from './table-state.entity';

interface SaveStateDto {
  data: string;
  colWidths: string;
  rowHeights: string;
}

@Controller('table-state')
export class TableStateController {
  constructor(private readonly tableStateService: TableStateService) {}

  @Get()
  async getState(): Promise<TableState | null> {
    return this.tableStateService.getState();
  }

  @Post()
  async saveState(@Body() saveStateDto: SaveStateDto): Promise<TableState> {
    const { data, colWidths, rowHeights } = saveStateDto;
    return this.tableStateService.saveState(data, colWidths, rowHeights);
  }
} 