/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantMaintenanceVEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantFk: number;
	 PlantCode: string | null;
	 EquipmentContextFk: number;
	 MaintenanceFk: number;
	 PlantDescription?: IDescriptionInfo | null;
	 PlantGroupFk: number;
	 MaintenanceDescription?: string | null;
	 StartDate?: Date | null;
	 EndDate?: Date | null;
	 MaintSchemaFk?: number | null;
	 UoMFk?: number | null;
	 MaintenanceCode: string | null;
	 MaintStatusIsplanned: boolean;
	 MaintStatusIsDue: boolean;
	 JobCardFk?: number | null;
}