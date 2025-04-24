/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IAccountingJournalsTransactionEntity } from '../entities/accounting-journals-transaction-entity.interface';

/**
 * Transaction complete entity
 */
export class AccountingJournalsTransactionComplete extends CompleteIdentification<IAccountingJournalsTransactionEntity> {
    public Transaction?: IAccountingJournalsTransactionEntity;

    public constructor(e: IAccountingJournalsTransactionEntity | null) {
        super();
        if(e){
            this.Transaction = e;
        }
    }
}