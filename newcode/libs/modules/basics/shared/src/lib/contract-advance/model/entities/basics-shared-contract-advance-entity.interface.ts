/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsSharedContractAdvanceEntity extends IEntityBase, IEntityIdentification {
	Description: string;
	DateDue: Date;
	AmountDue: number;
	PercentProrata: number;
	DateDone?: Date;
	AmountDone: number;
	CommentText: string;
	Userdefined1: string;
	Userdefined2: string;
	Userdefined3: string;
	Userdefined4: string;
	Userdefined5: string;
	AmountDueOc: number;
	AmountDoneOc: number;
	PaymentTermFk?: number;
}
