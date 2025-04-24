/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCertificateTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsBond: boolean;
	IsEmitted: boolean;
	HasCompany: boolean;
	HasCertificateDate: boolean;
	HasIssuer: boolean;
	HasIssuerBp: boolean;
	HasValidFrom: boolean;
	HasValidTo: boolean;
	HasReference: boolean;
	HasReferenceDate: boolean;
	HasProject: boolean;
	HasContract: boolean;
	HasAmount: boolean;
	HasExpirationDate: boolean;
	Reference: number;
	IsValued: boolean;
	IsLive: boolean;
	AccessrightDescriptorFk: number;
	HasOrder: boolean;
	IsForAccounting: boolean;
}
