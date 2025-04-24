import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IControllingCommonProjectEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	StatusFk: number;
	ProjectNo: string;
	ProjectName: string;
	ProjectName2: string;
	TypeFk: number;
	CalendarFk?: number | null;
	StartDate: Date | string;
	EndDate: Date | string;
	IsCompletePerformance: boolean;
}
