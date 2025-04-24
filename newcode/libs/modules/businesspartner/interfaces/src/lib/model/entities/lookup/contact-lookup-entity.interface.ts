/*
 * Copyright(c) RIB Software GmbH
 */

import { IContactEntity } from '../contact';


export interface IContactLookupEntity extends IContactEntity {
	Telephone1fk?: number | null;
	Telephone1?: string | null;
	Telephone2fk?: number | null;
	Telephone2?: string | null;
	Telephone3fk?: number | null;
	Mobile?: string | null;
	Mobilefk?: number | null;
	PrivateTelephone?: string | null;
	TelephonePrivatePattern?: string | null;
	Telefax?: string | null;
	Description?: string | null;
	AddressLine?: string | null;
	BpName1?: string | null;
	BasTitleFk?: number | null;
	BasClerkResponsibleFk?: number | null;
	BasCountryFk?: number | null;
	BpdContactTimelinessFk?: number | null;
	BpdContactOriginFk?: number | null;
	BpdContactAbcFk?: number | null;
	Birthdate?: Date | null;
	BasTelephonePrivatFk?: number | null;
	Nickname?: string | null;
	FrmUserextproviderFk?: number | null;
	BasEncryptionTypeFk: number;
	EmailPrivat?: string | null;
}
