/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePrcPackageTemplateItemEntity extends IEntityBase, IEntityIdentification {
	PackagetemplateFk: number;
	Sorting: number;
	StructureFk: number;
	ConfigurationFk: number;
	PackagetypeFk: number;
	IsLive: boolean;
	DescriptionInfo?: IDescriptionInfo;
}
