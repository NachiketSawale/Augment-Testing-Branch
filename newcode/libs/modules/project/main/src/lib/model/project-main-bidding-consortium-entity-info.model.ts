/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMainBiddingConsortiumDataService } from '../services/project-main-bidding-consortium-data.service';
import { IBiddingConsortiumEntity } from '@libs/project/interfaces';
import { createLookup, FieldType } from '@libs/ui/common';
import { BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

 export const projectMainBiddingConsortiumEntityInfo: EntityInfo = EntityInfo.create({
	 grid: {
		 title: {key: 'project.main.biddingConsortiumListTitle'},
	 },
	 form: {
		 title: {key: 'project.main.biddingConsortiumDetailTitle'},
		 containerUuid: '2b0b2115f71e4d30af1a8ee3c244b6dd',
	 },
	 dataService: ctx => ctx.injector.get(ProjectMainBiddingConsortiumDataService),
	 dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'BiddingConsortiumDto'},
	 permissionUuid: '08fbf6f22fe04a619eb91ec02b35c54e',
	 layoutConfiguration: {
		 groups: [
			 {
				 gid: 'baseGroup',
				 attributes: ['Description', 'Comment', 'BusinessPartnerFk', 'SubsidiaryFk']
			 }
		 ],
		 overloads: {
			 BusinessPartnerFk: {
				 type: FieldType.Lookup,
				 lookupOptions: createLookup({
					 dataServiceToken: BusinessPartnerLookupService
				 })
			 },
			 SubsidiaryFk: {
				 type: FieldType.Lookup,
				 lookupOptions: createLookup({
					 dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService
				 })
			 },
		 },
		 labels: {
			 ...prefixAllTranslationKeys('project.main.', {
				 BusinessPartnerFk: { key: 'entityBusinessPartner'},
				 SubsidiaryFk: { key: 'entitySubsidiary'},
			 }),
		 }
	 }
 } as IEntityInfo<IBiddingConsortiumEntity>);