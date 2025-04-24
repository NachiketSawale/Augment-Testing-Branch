/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePackageStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsDefault: boolean;
	IsReadOnly: boolean;
	IsUpdateImport: boolean;
	IsEstimate: boolean;
	IsLive: boolean;
	IsContracted: boolean;
	AccessrightDescriptorFk: number;
	IsRequested: boolean;
	Code: string;
	IsBaselineUpdatedAward: boolean;
}
