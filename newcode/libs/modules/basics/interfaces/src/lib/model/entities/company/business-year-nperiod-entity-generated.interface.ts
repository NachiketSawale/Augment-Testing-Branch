/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBusinessYearNPeriodEntity } from './business-year-nperiod-entity.interface';
import { ICompany2BasClerkEntity } from './company-2bas-clerk-entity.interface';
import { ICompany2ClerkEntity } from './company-2clerk-entity.interface';

export interface IBusinessYearNPeriodEntityGenerated extends IEntityBase {
	Id:number | 0;
	MainItemId: number | 0;
	CompanyFk?: number | null;
	DaysOfPerPeriods?: number | null;
	EndYear?: number | null;
	Frequency?: string | null;
	StartDate?: string | null;
	StartYear?: number | null;
	Year : IBusinessYearNPeriodEntity[] | null ;
	BasClerkToDelete: ICompany2BasClerkEntity[] | null ;
	BasClerkToSave: ICompany2BasClerkEntity[] | null;
	ClerkToDelete: ICompany2ClerkEntity[] | null;
	ClerkToSave: ICompany2ClerkEntity[] | null;
	YearToDelete?: IBusinessYearNPeriodEntity[] | null;
	YearToSave?: IBusinessYearNPeriodEntity[] | null;

}
