/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerEntity } from './business-partner-entity.interface';

export interface IBusinessPartnerCreatedEntity {
	main: IBusinessPartnerEntity;
	allUniqueColumns: string[];
}