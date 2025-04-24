/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProcurementPaymentScheduleStatusRuleEntity extends IEntityBase, IEntityIdentification {
	PaymentScheduleStatusFk: number;
	PaymentScheduleStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
