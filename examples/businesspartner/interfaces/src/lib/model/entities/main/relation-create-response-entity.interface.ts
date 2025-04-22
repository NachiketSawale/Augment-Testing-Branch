/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerEntity } from './business-partner-entity.interface';
import { IBusinessPartnerRelationEntity } from './business-partner-relation-entity.interface';

export interface IRelationCreateResponseEntityInterface {
	BusinessPartner: IBusinessPartnerEntity;
	Dto: IBusinessPartnerRelationEntity;
}