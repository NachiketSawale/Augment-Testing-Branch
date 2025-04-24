/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlanningBoardFilterEntity extends IEntityBase, IEntityIdentification {
	ModuleFk: number;
	ResourceTypeFk: number;
	CommentText: string;
}
