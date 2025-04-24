/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMeetingStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsReadOnly: boolean;
	IsPublished: boolean;
	IsDefault: boolean;
	IsCanceled: boolean;
	Code: string;
	IsLive: boolean;
	Icon: number;
}
