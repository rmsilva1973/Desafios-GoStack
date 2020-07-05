import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeTotal = this.transactions
      .filter(o => o.type === 'income')
      .reduce(
        (previousValue, currentValue) => previousValue + currentValue.value,
        0,
      );

    const outcomeTotal = this.transactions
      .filter(o => o.type === 'outcome')
      .reduce(
        (previousValue, currentValue) => previousValue + currentValue.value,
        0,
      );

    const total = incomeTotal - outcomeTotal;
    return { income: incomeTotal, outcome: outcomeTotal, total };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    if (type === 'outcome') {
      if (this.getBalance().total < value) {
        throw Error('Insufficient Balance');
      }
    }
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
