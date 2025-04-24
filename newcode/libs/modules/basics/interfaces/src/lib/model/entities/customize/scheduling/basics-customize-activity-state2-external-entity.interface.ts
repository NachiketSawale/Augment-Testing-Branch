/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeActivityState2ExternalEntity extends IEntityBase, IEntityIdentification {
	ActivitystateFk: number;
	ExternalsourceFk: number;
	ExtCode: string;
	ExtDescription: string;
	Color: number;
	CommentText: string;
	Sorting: number;
	IsReadOnly: boolean;
}
