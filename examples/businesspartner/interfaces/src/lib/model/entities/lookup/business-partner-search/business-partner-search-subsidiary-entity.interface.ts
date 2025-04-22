/*
 * Copyright(c) RIB Software GmbH
 */

import { ISubsidiaryEntity } from '../../main/subsidiary-entity.interface';

/**
 * Business Partner Subsidiary interface
 */
export interface IBusinessPartnerSearchSubsidiaryEntity extends ISubsidiaryEntity {
	IsChecked: boolean;
	Distance?: string;
	RegionDistance?: string;
}