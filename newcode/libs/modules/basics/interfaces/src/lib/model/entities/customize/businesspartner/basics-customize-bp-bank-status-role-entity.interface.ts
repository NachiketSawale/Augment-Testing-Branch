/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBpBankStatusRoleEntity extends IEntityBase, IEntityIdentification {
	BankStatusFk: number;
	BankStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
