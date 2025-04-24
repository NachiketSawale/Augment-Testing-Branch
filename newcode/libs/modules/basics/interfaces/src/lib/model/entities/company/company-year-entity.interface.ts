/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { ICompanyPeriodEntity } from './company-period-entity.interface';
import { ICompanyEntity } from './company-entity.interface';
import { IBusinessYearNPeriodEntity } from './business-year-nperiod-entity.interface';
import { ICompany2BasClerkEntity } from './company-2bas-clerk-entity.interface';
import { ICompany2ClerkEntity } from './company-2clerk-entity.interface';

export interface ICompanyYearEntity extends IEntityBase {
	CompanyEntity?: ICompanyEntity | null;
	CompanyFk?: number | null;
	CompanyPeriodEntities?: ICompanyPeriodEntity[] | null;
	EndDate?: string | null;
	Id: number;
	PreliminaryActual?: boolean | null;
	StartDate?: string | null;
	TradingYear?: number | null;
	Year : IBusinessYearNPeriodEntity[] | null ;
	MainItemId:number | null;
	BasClerkToDelete: ICompany2BasClerkEntity[] | null;
	BasClerkToSave: ICompany2BasClerkEntity[] | null;
	ClerkToDelete: ICompany2ClerkEntity[] | null;
	ClerkToSave: ICompany2ClerkEntity[] | null;
}
