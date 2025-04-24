/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IStockTransactionEntity } from './stock-transaction-entity.interface';

export class StockTotalComplete implements CompleteIdentification<IStockTransactionEntity> {
	/*
	 * mainItemId
	 */
	public MainItemId?: number;

	/*
	 * TransactionToDelete
	 */
	public TransactionToDelete?: IStockTransactionEntity[] | null;

	/*
	 * TransactionToSave
	 */
	public TransactionToSave?: IStockTransactionEntity[] | null;
}
