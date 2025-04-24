/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeReference01Entity extends IEntityBase, IEntityIdentification {
	CompanyFk: number;
	OldValue: string;
	NewValue: string;
	CommentText: string;
}
