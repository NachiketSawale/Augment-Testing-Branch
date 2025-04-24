import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ContactAssignmentDataService } from '../../services/assignment-data.service';
import { ILookupContext } from '@libs/ui/common';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, IBusinessPartnerAssignmentEntity, ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

export const ASSIGNMENT_ENTITY_INFO = EntityInfo.create<IBusinessPartnerAssignmentEntity>({
	grid: {
		title: { text: 'Business Partner Assignments', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.businessPartnerAssignment.grid' },
	},
	form: {
		title: { text: 'Business Partner Assignment Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.businessPartnerAssignment.detail' },
		containerUuid: '896b30a924a74844a90bfaac0d932a7b',
	},
	dataService: (ctx) => ctx.injector.get(ContactAssignmentDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactPascalCasedModuleName, typeName: 'BusinessPartnerAssignmentDto' },
	permissionUuid: 'b50fb90120804075b294e8378dd1be40',
	layoutConfiguration: async (ctx) => {
		const bpRelatedLookupProvider = await ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'default-group',
					attributes: ['BusinessPartnerFk', 'SubsidiaryFk', 'ContactRoleFk', 'IsLive', 'IsMain', 'IsPortal'],
				},
			],
			overloads: {
				BusinessPartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({ showClearButton: true }),
				SubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					readonly: true,
					customClientSideFilter: {
						// todo chi: need to filter in client side? and override the subsidiary lookup service?
						execute(item: ISubsidiaryLookupEntity, context: ILookupContext<ISubsidiaryLookupEntity, IBusinessPartnerAssignmentEntity>): boolean {
							return context.entity?.BusinessPartnerFk === item.BusinessPartnerFk;
						},
					},
				}),
				ContactRoleFk: bpRelatedLookupProvider.getContactLookupOverload({ showClearButton: true, readonly: true }),
				IsMain: { readonly: true },
			},
			labels: {
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
					BusinessPartnerFk: { key: 'synContact.businessPartners' },
					SubsidiaryFk: { key: 'subsidiaryAddress' },
					ContactRoleFk: { key: 'role' },
				}),
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
					IsLive: { key: 'entityIsLive' },
				}),
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.', {
					IsMain: { key: 'businessPartnerAssignment.isMain' },
					IsPortal: { key: 'businessPartnerAssignment.isPortal' },
				}),
			},
		};
	},
});
