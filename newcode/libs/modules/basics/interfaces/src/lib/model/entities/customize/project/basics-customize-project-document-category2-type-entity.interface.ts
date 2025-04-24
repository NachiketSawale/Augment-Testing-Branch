/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectDocumentCategory2TypeEntity extends IEntityBase, IEntityIdentification {
	DocumentCategoryFk: number;
	DocumentTypeFk: number;
	CommentText: string;
}
