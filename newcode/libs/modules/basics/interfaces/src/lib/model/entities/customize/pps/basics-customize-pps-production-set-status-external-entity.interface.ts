/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsProductionSetStatusExternalEntity extends IEntityBase, IEntityIdentification {
	ProdSetStatusFk: number;
	ExternalsourceFk: number;
	ExtCode: string;
	ExtDescription: string;
	CommentText: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
