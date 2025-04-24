/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMaterialTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsForEstimate: boolean;
	IsForProcurement: boolean;
	IsForRessourceManagement: boolean;
	IsForLogistic: boolean;
	IsForModel: boolean;
	IsForSales: boolean;
}
