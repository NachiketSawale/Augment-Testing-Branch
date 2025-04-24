/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeModelObjectSetStatusRuleEntity extends IEntityBase, IEntityIdentification {
	ObjectsetstatusFk: number;
	ObjectsetstatusTrgtFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
