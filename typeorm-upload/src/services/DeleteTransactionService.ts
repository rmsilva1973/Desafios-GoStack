// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import { isUuid } from 'uuidv4';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    if (!isUuid(id)) {
      throw new AppError('Invalid id sent', 400);
    }

    transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
