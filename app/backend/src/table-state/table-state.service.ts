import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TableState } from './table-state.entity';

@Injectable()
export class TableStateService {
  constructor(
    @InjectRepository(TableState)
    private tableStateRepository: Repository<TableState>,
  ) {}

  async getState(): Promise<TableState | null> {
    // 항상 첫 번째 상태를 가져오거나 없으면 null 반환
    const states = await this.tableStateRepository.find();
    return states.length > 0 ? states[0] : null;
  }

  async saveState(data: string, colWidths: string, rowHeights: string): Promise<TableState> {
    let state = await this.getState();
    if (!state) {
      state = this.tableStateRepository.create({ data, colWidths, rowHeights });
    } else {
      state.data = data;
      state.colWidths = colWidths;
      state.rowHeights = rowHeights;
    }
    return this.tableStateRepository.save(state);
  }
} 