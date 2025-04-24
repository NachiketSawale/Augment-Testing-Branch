/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IAccountingJournalsEntity } from './entities/accounting-journals-entity.interface';
import { ICompanyTransactionEntity } from '@libs/basics/interfaces';

export class AccountingJournalsComplete implements CompleteIdentification<IAccountingJournalsEntity>{

 /*
  * AccountingJournals
  */
  public AccountingJournals?: IAccountingJournalsEntity | null ;

 /*
  * EntitiesCount
  */
  public EntitiesCount?: number | null = 10;

 /*
  * MainItemId
  */
  public MainItemId?: number | null = 10;

 /*
  * TransactionToDelete
  */
  public TransactionToDelete?: ICompanyTransactionEntity[] | null = [];

 /*
  * TransactionToSave
  */
  public TransactionToSave?: ICompanyTransactionEntity[] | null = [];
}
