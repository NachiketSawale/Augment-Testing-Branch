/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeInstallmentEntity extends IEntityBase, IEntityIdentification {
	InstallmentagreementFk: number;
	Installment: number;
	InstallmentPercent: number;
	DescriptionInfo?: IDescriptionInfo;
	Description1: string;
	Description2: string;
	CommentText: string;
	Remark: string;
	Specification: string;
}
