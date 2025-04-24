import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { LookupSimpleEntity } from '@libs/ui/common';

export interface IExcelProfile extends IEntityBase, IEntityIdentification, LookupSimpleEntity {
	Id: number;
	Description: string;
	DescriptionTr: null;
	ProfileContext: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	ExcelProfileDetails: unknown[];
}