/*
 * Copyright(c) RIB Software GmbH
 */

import { IContactEntity } from '../../contact';



/**
 * Business Partner Contact interface
 */

export interface IBusinessPartnerSearchContactEntity extends IContactEntity {
	bpContactCheck: boolean;
}
