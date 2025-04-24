/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyTransactionEntity } from '@libs/basics/interfaces';
import { ICompanyTransheaderEntity } from '@libs/basics/interfaces';


export interface ICompanyTransheaderCompleteEntityGenerated {

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * TransactionToDelete
 */
  TransactionToDelete?: ICompanyTransactionEntity[] | null;

/*
 * TransactionToSave
 */
  TransactionToSave?: ICompanyTransactionEntity[] | null;

/*
 * Transheader
 */
  Transheader?: ICompanyTransheaderEntity | null;
}
