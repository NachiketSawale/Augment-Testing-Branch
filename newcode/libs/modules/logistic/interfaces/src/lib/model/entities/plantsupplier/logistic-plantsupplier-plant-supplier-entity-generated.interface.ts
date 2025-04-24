/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticPlantsupplierPlantSupplierEntityGenerated extends IEntityIdentification, IEntityBase {
	 CompanyFk: number;
	 EquipmentDivisionFk: number;
	 Code: string | null;
	 Description?: string | null;
	 RubricCategoryFk: number;
	 JobFk: number;
	 ControllingUnitFk?: number | null;
	 ProjectStockFk?: number | null;
	 IsActive: boolean;
	 SearchPattern?: number | null;
}