/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEquipmentCharacterValueOperatorEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	CommentText: string;
	Icon: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
