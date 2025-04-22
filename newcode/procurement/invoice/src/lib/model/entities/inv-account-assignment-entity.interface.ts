/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvAccountAssignmentEntityGenerated } from './inv-account-assignment-entity-generated.interface';

export interface IInvAccountAssignmentEntity extends IInvAccountAssignmentEntityGenerated {
	ParentFk: number;
}
