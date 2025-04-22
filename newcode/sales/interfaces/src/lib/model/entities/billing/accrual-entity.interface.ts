/*
 * Copyright(c) RIB Software GmbH
 */

import { IAccrualEntityGenerated } from './accrual-entity-generated.interface';
import { ICompanyTransactionEntity } from '@libs/basics/interfaces';

export interface IAccrualEntity extends IAccrualEntityGenerated {

    CompanyTransaction: ICompanyTransactionEntity;

}
