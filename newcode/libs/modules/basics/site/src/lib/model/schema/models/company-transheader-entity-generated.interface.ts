/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyEntity } from './company-entity.interface';
import { ICompanyPeriodEntity } from './company-period-entity.interface';
import { ICompanyTransHeaderStatusEntity } from './company-trans-header-status-entity.interface';
import { ICompanyTransactionEntity } from './company-transaction-entity.interface';

export interface ICompanyTransheaderEntityGenerated {
  BasCompanyTransheader?: string;
  CommentText?: string;
  CompanyEntity?: ICompanyEntity;
  CompanyFk?: number;
  CompanyPeriodEntity?: ICompanyPeriodEntity;
  CompanyPeriodFk?: number;
  CompanyTransHeaderStatusEntity?: ICompanyTransHeaderStatusEntity;
  CompanyTransactionEntities?: Array<ICompanyTransactionEntity>;
  CompanyTransheaderFk?: number;
  CompanyTransheaderStatusFk?: number;
  Description?: string;
  Id?: number;
  IsSuccess?: boolean;
  PostingDate?: string;
  ReturnValue?: string;
  TransactionTypeFk?: number;
}
