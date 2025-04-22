import {EntityInfo} from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { CommunityDataService } from '../../services/community-data.service';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, ICommunityEntity } from '@libs/businesspartner/interfaces';

export const COMMUNITY_ENTITY = EntityInfo.create<ICommunityEntity>({
	grid: {
		title: { text: 'Joint Business Partners', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.community.title' },
	},
	form: {
		title: { text: 'Joint Business Partner Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.community.detailTitle' },
		containerUuid: '8e943605da2b4c6eb25aacee00c06f47'
	},
	dataService: (ctx) => ctx.injector.get(CommunityDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'CommunityDto' },
	permissionUuid: '0e170479c9cd43dea593492d54ac46be',
	layoutConfiguration: async ctx => {
		const bpRelatedLookupProvider = await (ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN));
		return {
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['BidderFk', 'SubsidiaryFk', 'CommentText', 'Percentage']
				}
			],
			labels: {
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
					BidderFk: { key: 'communityBidderFk' },
					SubsidiaryFk: { key: 'communitySubsidiaryFk' },
					Percentage: { key: 'entityPercentage' },
				}),
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.basicsCommonModuleName + '.', {
					CommentText: { key: 'entityCommentText' },
				}),
			},
			overloads: {
				BidderFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
					displayMember: 'BusinessPartnerName1',
				}),
				SubsidiaryFk: {
					...bpRelatedLookupProvider.getSubsidiaryLookupOverload({
						displayMember: 'SubsidiaryDescription',
					}),
					readonly: true,
				}
			}
		};
	}
});