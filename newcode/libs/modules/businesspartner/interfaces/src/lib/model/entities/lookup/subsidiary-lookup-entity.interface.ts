/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { ISubsidiaryEntity } from '../main/subsidiary-entity.interface';

export interface ISubsidiaryLookupEntity extends ISubsidiaryEntity {
	Address?: string | null;
	AddressInfo?: string | null;
	AddressLine?: string | null;
	AddressTypeInfo?: IDescriptionInfo | null;
	City?: string | null;
	County?: string | null;
	DisplayText?: string | null;
	Iso2?: string | null;
	Street?: string | null;
	SubsidiaryDescription?: string | null;
	Telefax?: string | null;
	TelefaxPattern?: string | null;
	TelephoneNumber1?: string | null;
	TelephonePattern?: string | null;
	ZipCode?: string | null;
}
