/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantTypeEntity extends IEntityBase, IEntityIdentification {
	PlantTypeFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsBulk: boolean;
	IsCluster: boolean;
	IsClustered: boolean;
	Sorting: number;
	IsDefault: boolean;
	HasSerial: boolean;
	IsTimekeeping: boolean;
	IsIgnoreWotByLocation: boolean;
	IsLogisticDataRequired: boolean;
	IsEstimatePlant: boolean;
}
