/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResReservationStatusRuleEntity extends IEntityBase, IEntityIdentification {
	ReservationstatFk: number;
	ReservationstatTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
