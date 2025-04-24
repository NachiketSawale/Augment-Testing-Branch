import { IEntityBase, IEntityIdentification } from '@libs/platform/common';


export interface IPpsAccountingResultLookupEntity extends IEntityBase, IEntityIdentification {
	Id: number,
	Description: string;
	InsertedAt: Date,
	InsertedBy: number,
	UpdatedAt: Date | undefined,
	UpdatedBy: number | undefined,
	Version: number,
}