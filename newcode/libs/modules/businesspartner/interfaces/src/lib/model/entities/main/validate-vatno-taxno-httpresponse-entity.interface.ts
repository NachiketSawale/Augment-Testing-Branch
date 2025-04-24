/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerEntity } from './business-partner-entity.interface';

export interface IValidateVatNoOrTaxNoHttpResponse{
	duplicateBPs: IBusinessPartnerEntity[],
	checkRegex: boolean,
	countryISO: string,
	pattern: string,
	validExample: string
}