/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerSearchContactEntity } from '@libs/businesspartner/interfaces';

/**
 * Business Partner Contact response model
 */
export class BusinessPartnerContactResponse {

	/**
	 * BusinessPartner Contact search entities
	 */

	public Main?: IBusinessPartnerSearchContactEntity[];

}