import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IProjectMainBillToEntityGenerated extends IEntityBase, IEntityIdentification {
	ProjectFk: number;
	Code: string;
	Description: string;
	Comment: string;
	Remark: string;
	BusinessPartnerFk: number;
	CustomerFk: number | null;
	QuantityPortion: number;
	SubsidiaryFk: number | null;
}