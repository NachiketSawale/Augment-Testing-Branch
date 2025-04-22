import { IDescriptionInfo } from '@libs/platform/common';

export interface WipPrcConfigurationModel {
	ApprovalDealdline?: number;
	ApprovalPeriod?: number;
	BaselineIntegration: boolean;
	DescriptionInfo?: IDescriptionInfo | null;
	Id: number;
	IsDefault: boolean;
	IsFreeItemsAllowed: boolean;
	IsLive: boolean;
	IsMaterial: boolean;
	IsNotAccrualPrr: boolean;
	IsService: boolean;
	PaymentTermFiFk: number;
	PaymentTermPaFk: number;
	PrcAwardMethodFk: number;
	PrcConfigHeaderFk: number;
	PrcConfigHeaderTypeFk: number;
	PrcContractTypeFk: number;
	PrjContractTypeFk: number;
	ProvingDealdline?: number;
	ProvingPeriod?: number;
	RubricCategoryFk: number;
	RubricFk: number;
	Sorting?: number;
}