/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeReference04Entity extends IEntityBase, IEntityIdentification {
	CompanyFk: number;
	OldValue: string;
	NewValue: string;
	CommentText: string;
}
