/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
export interface IBasicsEfbsheetsAverageWageEntityGenerated extends IEntityBase {
	Id?: number | null;
	Code?: string | null;
	DescriptionInfo?: IDescriptionInfo | null;
	Count?: number | null;
	Supervisory?: boolean | null;
	EstCrewMixFk?: number | null;
	MdcWageGroupFk?: number | null;
	MarkupRate?: number | null;
}
