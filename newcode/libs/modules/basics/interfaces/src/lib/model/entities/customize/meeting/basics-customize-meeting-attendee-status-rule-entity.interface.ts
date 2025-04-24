/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMeetingAttendeeStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AttendeeStatusFk: number;
	AttendeeStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
