/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyCostDataEntityGenerated } from './company-cost-data-entity-generated.interface';

export interface ICompanyCostDataEntity extends ICompanyCostDataEntityGenerated {
	/*
	 * RepeatCheckKey
	 */
	RepeatCheckKey?: string | null;

	/*
	 * CompanyFk
	 */
	CompanyFk?: number | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * ValueTypeFk
	 */
	ValueTypeFk?: number | null;

	/*
	 * CompanyYearFk
	 */
	CompanyYearFk?: number | null;

	/*
	 * CompanyPeriodFk
	 */
	CompanyPeriodFk?: number | null;
}
