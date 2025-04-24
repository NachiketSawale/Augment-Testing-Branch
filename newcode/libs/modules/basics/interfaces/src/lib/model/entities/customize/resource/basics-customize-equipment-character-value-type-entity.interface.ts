/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEquipmentCharacterValueTypeEntity extends IEntityBase, IEntityIdentification {
	CharactervalueopFk: number;
	DescriptionInfo?: IDescriptionInfo;
	CommentText: string;
	Formattemplate: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
