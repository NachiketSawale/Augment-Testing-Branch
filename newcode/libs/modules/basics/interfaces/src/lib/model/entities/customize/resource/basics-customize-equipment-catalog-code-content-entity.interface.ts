/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEquipmentCatalogCodeContentEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	CommentText: string;
	QuantityFactor1: number;
	Precision1: number;
	Inputsource1Fk: number;
	Separator: number;
	QuantityFactor2: number;
	Precision2: number;
	Inputsource2Fk: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
