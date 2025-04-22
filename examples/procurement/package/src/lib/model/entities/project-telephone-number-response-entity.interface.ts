/*
 * Copyright(c) RIB Software GmbH
 */

import {AddressEntity, TelephoneEntity} from '@libs/basics/shared';

export interface IProjectTelephoneNumberResponse {
	ProjectFk: number;
	TelephoneNumberFk?: number ;
	TelephoneTelefaxFk?: number ;
	TelephoneMobileFk?: number ;
	AddressFk?: number ;
	TelephoneNumber?: TelephoneEntity ;
	TelephoneNumberTelefax?: TelephoneEntity ;
	TelephoneMobil?: TelephoneEntity ;
	AddressEntity?: AddressEntity ;
	CountryFk?: number ;
	RegionFk?: number ;
	Email?: string ;
}
