/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';


/**
 * @interface IBasicsEfbsheetsEntityGenerted
 * @extends IEntityBase
 * @brief Represents a generated basics EFBSheets entity.
 */
export interface IBasicsEfbsheetsEntityGenerted extends IEntityBase {
	/*
	 * Id
	 */
	Id: number | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * AverageStandardWage
	 */
	AverageStandardWage?: number | null;

	/*
	 * CrewAverage
	 */
	CrewAverage?: number | null;

	/*
	 * CrewMixAf
	 */
	CrewMixAf?: number | null;

	/*
	 * CrewMixAfsn
	 */
	CrewMixAfsn?: number | null;

	/*
	 * CrewSize
	 */
	CrewSize?: number | null;

	/*
	 * ExtraPay
	 */
	ExtraPay?: number | null;

	/*
	 * CurrencyFk
	 */
	CurrencyFk?: number | null;

	/*
	 * ProjectFk
	 */
	ProjectFk?: number | null;

	/*
	 * TotalExtraCost
	 */
	TotalExtraCost?: number | null;

	/*
	 * TotalHours
	 */
	TotalHours?: number | null;

	/*
	 * TotalSurcharge
	 */
	TotalSurcharge?: number | null;

	/*
	 * WageIncrease1
	 */
	WageIncrease1?: number | null;

	/*
	 * WageIncrease2
	 */
	WageIncrease2?: number | null;

	/*
	 * WorkingDaysMonths
	 */
	WorkingDaysMonths?: number | null;
}
