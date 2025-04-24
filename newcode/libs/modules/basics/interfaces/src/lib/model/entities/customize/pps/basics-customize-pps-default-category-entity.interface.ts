/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsDefaultCategoryEntity extends IEntityBase, IEntityIdentification {
	EntityFk: number;
	RubricCategoryFk: number;
	CommentText: string;
}
