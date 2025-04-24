/*
 * Copyright(c) RIB Software GmbH
 */


import { IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';


/**
 * Business Partner response model
 */
export class BusinessPartnerResponse {

	/**
	 * BusinessPartner search entities
	 */

	public main?: IBusinessPartnerSearchMainEntity[];

	/**
	 * BusinessPartner search total Length
	 */
	public totalLength?: number;
}
