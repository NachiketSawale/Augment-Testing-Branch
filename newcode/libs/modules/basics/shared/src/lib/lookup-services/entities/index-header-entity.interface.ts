/**
 * IndexHeader Entity
 */
import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export interface IIndexHeaderEntity extends  IEntityIdentification {
	Id: number;
	Code: string;
	DescriptionInfo: IDescriptionInfo;
	CommentText?: string;
	CurrencyFk?: number | null;
	RateFactorFk: number;
	Userdefined1?: string;
	Userdefined2?: string;
	Userdefined3?: string;
	Userdefined4?: string;
	Userdefined5?: string;
	InsertedAt: Date;
	InsertedBy: number;
	UpdatedAt: Date;
	UpdatedBy: number;
	Version: number;
}