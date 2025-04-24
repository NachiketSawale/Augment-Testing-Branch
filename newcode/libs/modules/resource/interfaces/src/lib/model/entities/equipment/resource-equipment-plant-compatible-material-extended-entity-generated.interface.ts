/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceEquipmentPlantCompatibleMaterialExtendedEntityGenerated extends IEntityIdentification, IEntityBase {
	 MaterialCatalog: number;
	 MaterialCatalogDesc?: number | null;
	 MaterialCatalogType?: number | null;
	 MaterialCatalogCategoryShortDesc?: number | null;
	 MaterialCatalogCategoryDesc?: number | null;
	 BizPartner?: number | null;
	 BizPartnerName1?: number | null;
	 BizPartnerName2?: number | null;
	 BizPartnerInternet?: number | null;
	 BizPartnerEMail?: number | null;
	 BizPartnerState?: number | null;
	 BizPartnerStateDesc?: number | null;
	 BizPartnerIsApproved?: number | null;
	 BizPartnerCommunicationChannel?: number | null;
	 Contracted?: number | null;
	 ContractedDesc?: number | null;
	 ContractedState?: number | null;
	 ContractedStateDesc?: number | null;
	 ContractedIsAccepted?: number | null;
	 LanguageId: number;
}