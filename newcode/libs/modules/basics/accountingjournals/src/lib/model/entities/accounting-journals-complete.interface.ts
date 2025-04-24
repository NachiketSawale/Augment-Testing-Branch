/*
 * Copyright(c) RIB Software GmbH
 */
import { IAccountingJournalsEntity } from './accounting-journals-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';
import { IAccountingJournalsTransactionEntity } from './accounting-journals-transaction-entity.interface';

export class IAccountingJournalsComplete extends CompleteIdentification<IAccountingJournalsEntity> {

	public AccountingJournals?: IAccountingJournalsEntity;

	public TransactionToSave?: IAccountingJournalsTransactionEntity[] | null;

	public TransactionToDelete?: IAccountingJournalsTransactionEntity[] | null;

	public EntitiesCount: number = 0;

	public MainItemId : number = 0;
}
