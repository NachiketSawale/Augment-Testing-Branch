/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentMaintenanceEntityGenerated extends IEntityIdentification, IEntityBase {
	 Code: string | null;
	 Description?: string | null;
	 PlantComponentFk: number;
	 MaintenanceStatusFk: number;
	 StartDate?: Date | null;
	 EndDate?: Date | null;
	 IsFixedDays: boolean;
	 DaysAfter?: number | null;
	 IsPerformanceBased: boolean;
	 UoMFk?: number | null;
	 Quantity: number;
	 Duration: number;
	 Remark?: string | null;
	 Comment?: string | null;
	 JobCardFk?: number | null;
	 MaintSchemaRecFk?: number | null;
	 PlantCompMaintSchemaFk?: number | null;
	 PlantFk: number;
	 IsRecalcDates: boolean;
	 IsRecalcPerformance: boolean;
	 MaintenanceSchemaFk?: number | null;
}