/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantAllocVEntityGenerated extends IEntityIdentification, IEntityBase {
	 JobFk: number;
	 JobCode: string | null;
	 ProjectFk: number;
	 ProjectName?: string | null;
	 ProjectNo: string | null;
	 CompanyInFk?: number | null;
	 CompanyInCode?: string | null;
	 CompanyInName?: string | null;
	 CompanyOutFk?: number | null;
	 CompanyOutCode?: string | null;
	 CompanyOutName?: string | null;
	 PlantFk: number;
	 PlantTypeFk: number;
	 IsBulk: boolean;
	 PlantKindFk: number;
	 ProjectChangeFk?: number | null;
	 ProjectChangeStatusFk?: number | null;
	 AllocatedFrom?: Date | null;
	 AllocatedTo?: Date | null;
	 Quantity: number;
	 UomFk?: number | null;
	 WorkOperationTypeFk?: number | null;
	 ControllingUnitFk?: number | null;
	 ReservationFk?: number | null;
	 DispatchHeaderInFk?: number | null;
	 DispatchHeaderOutFk?: number | null;
}