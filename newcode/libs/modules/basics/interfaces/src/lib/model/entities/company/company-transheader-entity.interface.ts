/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { ICompanyEntity } from './company-entity.interface';
import { ICompanyPeriodEntity } from './company-period-entity.interface';
import { ICompanyTransHeaderStatusEntity } from './company-trans-header-status-entity.interface';
import { ICompanyTransactionEntity } from './company-transaction-entity.interface';

export interface ICompanyTransheaderEntity extends IEntityBase {
	BasCompanyTransheader?: string | null;
	CommentText?: string | null;
	CompanyEntity?: ICompanyEntity | null;
	CompanyFk?: number | null;
	CompanyPeriodEntity?: ICompanyPeriodEntity | null;
	CompanyPeriodFk?: number | null;
	CompanyTransHeaderStatusEntity?: ICompanyTransHeaderStatusEntity | null;
	CompanyTransactionEntities?: ICompanyTransactionEntity[] | null;
	CompanyTransheaderFk?: number | null;
	CompanyTransheaderStatusFk?: number | null;
	Description?: string | null;
	Id?: number | null;
	IsSuccess?: boolean | null;
	PostingDate?: string | null;
	ReturnValue?: string | null;
	TransactionTypeFk?: number | null;
}
