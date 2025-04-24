/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantEntityGenerated extends IEntityIdentification, IEntityBase {
	 EquipmentContextFk: number;
	 EquipmentDivisionFk: number;
	 PlantStatusFk: number;
	 IsLive: boolean;
	 PlantGroupFk: number;
	 Code: string | null;
	 AlternativeCode?: number | null;
	 DescriptionInfo?: IDescriptionInfo | null;
	 LongDescriptionInfo?: IDescriptionInfo | null;
	 Specification?: string | null;
	 Matchcode?: string | null;
	 NfcId?: string | null;
	 SerialNumber?: string | null;
	 PlantTypeFk: number;
	 ProcurementStructureFk: number;
	 UoMFk: number;
	 PlantKindFk: number;
	 RubricCategoryFk: number;
	 RegNumber?: string | null;
	 CompanyFk?: number | null;
	 ValidFrom?: Date | null;
	 ValidTo?: Date | null;
	 CommentText?: string | null;
	 UserDefined01?: string | null;
	 UserDefined02?: string | null;
	 UserDefined03?: string | null;
	 UserDefined04?: string | null;
	 UserDefined05?: string | null;
	 SearchPattern?: string | null;
	 DangerClassFk?: number | null;
	 PackageTypeFk?: number | null;
	 DangerCapacity?: number | null;
	 UomDcFk?: number | null;
	 ClerkOwnerFk?: number | null;
	 ClerkResponsibleFk?: number | null;
	 BasUomTranspsizeFk?: number | null;
	 BasUomTranspweightFk?: number | null;
	 Transportlength?: number | null;
	 Transportwidth?: number | null;
	 Transportheight?: number | null;
	 Transportweight?: number | null;
	 HasPoolJob: boolean;
	 LoadingCostFk: number;
	 CardNumber?: string | null;
}