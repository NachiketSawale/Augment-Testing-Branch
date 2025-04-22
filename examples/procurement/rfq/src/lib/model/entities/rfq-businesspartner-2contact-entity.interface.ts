/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';


export interface IRfqBusinessPartner2ContactEntity extends IEntityBase, IEntityIdentification {
	RfqBusinessPartnerFk: number;
	ContactFk: number;
}