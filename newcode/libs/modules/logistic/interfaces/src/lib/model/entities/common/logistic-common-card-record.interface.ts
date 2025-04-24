/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IDescriptionInfo } from '@libs/platform/common';

export interface ILogisticCommonCardRecordEntity {
	CardRecordDescription: string | null
	JobCardActivityTemplateFk: number;
	Code: string|null;
	DescriptionInfo?: IDescriptionInfo|null;
	Quantity: number;
	UomFk: number;
	JobCardRecordTypeFk: number;
	WorkOperationTypeFk?: number|null;
	MaterialFk?: number|null;
	PlantFk?: number|null;
	SundryServiceFk?: number|null;
	Comment?: string|null;
	Remark?: string|null;
}
