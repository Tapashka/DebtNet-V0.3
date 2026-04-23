import { IsString, IsNumber, IsPositive, IsOptional, IsIn } from 'class-validator';

export class CreateLoanDto {
  @IsString()
  counterparty_id: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsIn(['lent', 'borrowed'])
  direction: 'lent' | 'borrowed';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
