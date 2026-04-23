import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './loan.entity';
import { CreateLoanDto } from './loans.dto';
import { SseService } from '../sse/sse.service';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan) private repo: Repository<Loan>,
    private sse: SseService,
  ) {}

  async create(ownerId: string, dto: CreateLoanDto) {
    const loan = await this.repo.save(
      this.repo.create({ ...dto, owner_id: ownerId, currency: dto.currency || 'BYN' }),
    );
    this.sse.emit(ownerId, 'loan.transaction.created', { loan_id: loan.id, timestamp: Date.now() / 1000 });
    this.sse.emit(dto.counterparty_id, 'loan.transaction.created', { loan_id: loan.id, timestamp: Date.now() / 1000 });
    return loan;
  }

  findAll(ownerId: string) {
    return this.repo.find({ where: { owner_id: ownerId } });
  }

  async summary(ownerId: string) {
    const loans = await this.repo.find({ where: { owner_id: ownerId, is_settled: false } });
    const total_credit = loans.filter(l => l.direction === 'lent').reduce((s, l) => s + +l.amount, 0);
    const total_debt = loans.filter(l => l.direction === 'borrowed').reduce((s, l) => s + +l.amount, 0);
    return { total_credit, total_debt, balance: total_credit - total_debt };
  }

  async debtors(ownerId: string) {
    const loans = await this.repo.find({ where: { owner_id: ownerId, is_settled: false } });
    const map: Record<string, number> = {};
    for (const l of loans) {
      const sign = l.direction === 'lent' ? 1 : -1;
      map[l.counterparty_id] = (map[l.counterparty_id] || 0) + sign * +l.amount;
    }
    return Object.entries(map).map(([counterparty_id, balance]) => ({ counterparty_id, balance }));
  }

  async settle(ownerId: string, counterpartyId: string) {
    await this.repo.update(
      { owner_id: ownerId, counterparty_id: counterpartyId, is_settled: false },
      { is_settled: true },
    );
    return { settled: true };
  }
}
