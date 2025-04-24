import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IPpsFabricationUnitLookupEntity extends IEntityBase, IEntityIdentification {
	Id: number,
	Code: string,
	ExternalCode: string;
	Description: string;
	InsertedAt: Date,
	InsertedBy: number,
	UpdatedAt: Date | undefined,
	UpdatedBy: number | undefined,
	Version: number,
}