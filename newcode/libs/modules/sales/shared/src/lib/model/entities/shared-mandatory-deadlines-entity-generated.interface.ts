import { IEntityBase } from '@libs/platform/common';

export interface ISharedMandatoryDeadlinesEntityGenerated extends IEntityBase {
	Id: number;
	BidHeaderFk?: number | null;
	OrdHeaderFk?: number | null;
	IndividualPerformance : string;
	Start? : string | null;
	End? : string | null;
	Version: number;
}