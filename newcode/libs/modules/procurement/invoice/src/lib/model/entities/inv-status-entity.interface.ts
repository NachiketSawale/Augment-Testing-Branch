/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvStatusEntityGenerated } from './inv-status-entity-generated.interface';

export interface IInvStatusEntity extends IInvStatusEntityGenerated {
	HasAccessRightDescriptor?: boolean | null;
	HasAccessRightDescriptorToPes?: boolean | null;
	HasAccessRightDescriptorToContract?: boolean | null;
	HasAccessRightDescriptorToOther?: boolean | null;
	HasAccessRightDescriptorToChain?: boolean | null;
	HasAccessRightDescriptorToPayment?: boolean | null;
}
