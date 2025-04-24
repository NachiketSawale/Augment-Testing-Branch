/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBpStatus2RuleEntity extends IEntityBase, IEntityIdentification {
	Status2Fk: number;
	Status2TargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
	AccessrightDescriptorFk: number;
}
