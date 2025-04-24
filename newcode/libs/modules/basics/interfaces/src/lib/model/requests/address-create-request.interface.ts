/*
 * Copyright(c) RIB Software GmbH
 */

/*
AddressCreationDto
 */
export interface IAddressCreateRequest {
	CountryId?: number;
	Street: string;
	ZipCode?: string | null;
	City: string;
	County: string;
	StateId?: number;
}
