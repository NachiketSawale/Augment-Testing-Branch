/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerSearchMainEntity } from '../lookup/business-partner-search/business-partner-search-main-entity.interface';
import { IBusinessPartnerRelationEntity } from './business-partner-relation-entity.interface';
import { IBpRelationType, IBusinessPartnerInfo } from './relation.interface';
import { ISubsidiaryEntity } from './subsidiary-entity.interface';

export interface IRelationLoadedEntity {
	Main: IBusinessPartnerRelationEntity[];
	AllBusinessPartnerRelationTypeDto: IBpRelationType[];
	BusinessPartnerInfo: IBusinessPartnerInfo[];
	RelationSubsidiaryDto: ISubsidiaryEntity[];
	BusinessPartner: IBusinessPartnerSearchMainEntity[];
	BusinessPartnerRelationTypeDto: IBpRelationType[];
}