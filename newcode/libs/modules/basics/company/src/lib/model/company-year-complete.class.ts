/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IBusinessYearNPeriodEntity, ICompany2BasClerkEntity, ICompany2ClerkEntity, ICompanyEntity, ICompanyPeriodEntity, ICompanyYearEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class CompanyYearComplete implements CompleteIdentification<ICompanyYearEntity>{

	public Id:number = 0;
	public MainItemId: number=0;
	public Companies: ICompanyEntity[] | null = [];
	/*public MainItemId: number = 0;*/
	public PeriodsToDelete?: ICompanyPeriodEntity[] | null = [];
	public PeriodsToSave?: ICompanyPeriodEntity[] | null = [];
	public Year: IBusinessYearNPeriodEntity[] | null = [] ;
	public BasClerkToDelete: ICompany2BasClerkEntity[] | null = [];
	public BasClerkToSave: ICompany2BasClerkEntity[] | null = [];
	public ClerkToDelete: ICompany2ClerkEntity[] | null = [];
	public ClerkToSave: ICompany2ClerkEntity[] | null = [];
	public YearToDelete?: IBusinessYearNPeriodEntity[] | null = [];
	public YearToSave?: IBusinessYearNPeriodEntity[] | null = [];

}
