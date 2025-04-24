import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IGuaranteeUsedEntity extends IEntityBase, IEntityIdentification{
	Id: number;
	CertificateTypeFk: number;
	OrdHeaderFk: number;
	Amount: number;
	CertificateData: Date;
	ValidTo?: Date;
	ValidFrom?: Date;
	DischargeData?: Date;
}