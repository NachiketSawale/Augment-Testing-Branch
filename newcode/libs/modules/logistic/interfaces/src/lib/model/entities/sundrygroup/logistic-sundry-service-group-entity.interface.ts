import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticSundryServiceGroupEntity extends IEntityIdentification, IEntityBase {

	Code: string;
	DescriptionInfo: IDescriptionInfo;
	SundryServiceGroupFk?: number;
	SundryServiceGroups: ILogisticSundryServiceGroupEntity[];
	LogisticContextFk: number;
	ProcurementStructureTypeFk?: number;
	Specification: string;
	Icon?: number;
	IsLive: boolean;
	IsDefault: boolean;
	Sorting: number;

}