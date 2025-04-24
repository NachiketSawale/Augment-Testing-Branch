/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

/**
 * BusinessPartner agreement entity
 */
export interface IBusinessPartnerAgreementLookupEntity extends IEntityBase, IEntityIdentification {
	Description: string;
	BusinessPartnerFk: number;
	BusinessPartnerName1?: string | null;
	ValidTo?: Date | null;
	ValidFrom?: Date | null;
}