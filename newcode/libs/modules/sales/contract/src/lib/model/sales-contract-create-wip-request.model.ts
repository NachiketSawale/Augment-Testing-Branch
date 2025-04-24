import { IOrdHeaderEntity } from '@libs/sales/interfaces';

export interface salesContractCreateWipRequestModel{
	ConfigurationId: number;
	PreviousWipId: number|null,
	ContractIds: number;
	Description: string;
	IncludeMainContract: boolean;
	IsCollectiveWip: boolean;
	RubricCategoryId: number;
	SideContractIds: number[];
	items?: IOrdHeaderEntity[];
}