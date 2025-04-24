/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IAddressEntity } from '@libs/ui/map';

export interface IProjectLookupEntity extends IEntityBase {
	Id: number;
	ProjectNo: string;
	ProjectLongNo: string;
	ProjectName: string;
	ProjectName2: string;
	ContractNo: string;
	AddressFk?: number | null;
	StartDate: Date;
	CurrencyFk: number;
	StatusFk: number;
	AssetMasterFk?: number | null;
	CompanyFk: number;
	IsAdministration: boolean;
	GroupDescription: string;
	ProjectContextFk?: number | null;
	RubricCatLocationFk?: number | null;
	IsInterCompany: boolean;
	IsPercentageBased: boolean;

	AddressEntity?: IAddressEntity | null;
}