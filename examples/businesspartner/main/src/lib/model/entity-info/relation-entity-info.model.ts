import { EntityInfo } from '@libs/ui/business-base';
import { BusinessPartnerMainRelationDataService } from '../../services/relation-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, IBusinessPartnerRelationEntity } from '@libs/businesspartner/interfaces';

export const RELATION_ENTITY_INFO = EntityInfo.create<IBusinessPartnerRelationEntity>({
	grid: {
		title: {
			text: 'Relation',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.bpRelation',
		},
		containerUuid: '12394ae7fb944ba1b1006bd13864149a'
	},
	form: {
		title: {
			text: 'Relation Detail',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.bpRelationDetail',
		},
		containerUuid: 'A2V6EQ1F6DJ84FD8BR6J25E6C3A43VUG',
	},
	// eslint-disable-next-line strict
	dataService: (ctx) => ctx.injector.get(BusinessPartnerMainRelationDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'BusinessPartnerRelationDto' },
	permissionUuid: 'ddf49471e5944a5f8b8de31c9715375e',
	layoutConfiguration: async ctx => {
		const bpRelatedLookupProvider = await (ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN));
		return {
			groups: [
				{ gid: 'basicData', attributes: ['BusinessPartnerFk', 'BusinessPartner2Fk', 'RelationTypeFk', 'Remark', 'BpSubsidiaryFk', 'BpSubsidiary2Fk'] }
			],
			overloads: {
				BusinessPartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload(),
				BusinessPartner2Fk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload(),
				BpSubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({ showClearButton: true }),
				BpSubsidiary2Fk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({ showClearButton: true, displayMember: 'SubsidiaryDescription', serverFilterKey: 'businesspartner-main-relation-subsidiary2-filter' }),
				RelationTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideRelationTypeLookupOverload(false),
			},
			labels: {
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
					BusinessPartnerFk: { key: 'entityBpOwner'},
				BusinessPartner2Fk: { key: 'entityBpOpposite'},
				RelationTypeFk: { key: 'bpRelation'},
				BpSubsidiaryFk: { key: 'bpBranch'},
				BpSubsidiary2Fk: { key: 'bpOppositeBranch'}
				}),
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
					Remark: { key: 'entityRemark'}
				})
			}
		};
	}
});