
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';


export interface IPpsAccountingRuleLookupEntity extends IEntityBase, IEntityIdentification {
	Id: number,
	MatchPattern: string;
	InsertedAt: Date,
	InsertedBy: number,
	UpdatedAt: Date | undefined,
	UpdatedBy: number | undefined,
	Version: number,
}