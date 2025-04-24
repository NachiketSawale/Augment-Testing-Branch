/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMaintenanceSchemaRecordEntityGenerated extends IEntityIdentification, IEntityBase {
	 MaintenanceSchemaFk?: number | null;
	 Code: string | null;
	 DescriptionInfo?: IDescriptionInfo | null;
	 IsFixedDays: boolean;
	 DaysAfter?: number | null;
	 IsPerformanceBased: boolean;
	 UomFk?: number | null;
	 Quantity: number;
	 Duration: number;
	 JobCardTemplateFk?: number | null;
	 Remark?: string | null;
	 Comment?: string | null;
	 IsRecalcDates?: boolean | null;
}