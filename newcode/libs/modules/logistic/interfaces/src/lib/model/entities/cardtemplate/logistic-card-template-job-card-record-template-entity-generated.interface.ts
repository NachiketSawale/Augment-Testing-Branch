/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticCardTemplateJobCardRecordTemplateEntityGenerated extends IEntityIdentification, IEntityBase {
	 JobCardActivityTemplateFk: number;
	 Code: string | null;
	 DescriptionInfo?: IDescriptionInfo | null;
	 Quantity: number;
	 UomFk: number;
	 JobCardRecordTypeFk: number;
	 WorkOperationTypeFk?: number | null;
	 MaterialFk?: number | null;
	 PlantFk?: number | null;
	 SundryServiceFk?: number | null;
	 Comment?: string | null;
	 Remark?: string | null;
}