/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsItemStatusExternalEntity extends IEntityBase, IEntityIdentification {
	ItemStatusFk: number;
	ExternalsourceFk: number;
	ExtCode: string;
	ExtDescription: string;
	CommentText: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
