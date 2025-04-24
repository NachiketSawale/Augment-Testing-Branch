/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDefectStatus2ExternalEntity extends IEntityBase, IEntityIdentification {
	StatusFk: number;
	ExternalsourceFk: number;
	ExtCode: string;
	ExtDescription: string;
	Color: number;
	CommentText: string;
	Sorting: number;
	IsReadOnly: boolean;
}
