import { Injectable } from '@angular/core';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { LazyInjectable, prefixAllTranslationKeys } from '@libs/platform/common';
import { IProjectMainPrj2BusinessPartnerEntity, IProjectMainPrj2BPLayoutService, PROJECT_MAIN_PRJ2BP_LAYOUT_SERVICE_TOKEN } from '@libs/project/interfaces';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext, ServerSideFilterValueType } from '@libs/ui/common';

/**
 * Project 2 Business Parnter Layout service
 */
@LazyInjectable({
    token: PROJECT_MAIN_PRJ2BP_LAYOUT_SERVICE_TOKEN,
    useAngularInjection: true
})
@Injectable({
	providedIn: 'root',
})
export class ProjectMainPrj2BPLayoutService implements IProjectMainPrj2BPLayoutService {

	public generateLayout(): ILayoutConfiguration<IProjectMainPrj2BusinessPartnerEntity> {
		return {
			groups: [
				{ gid: 'baseGroup', attributes: ['BusinessPartnerFk', 'IsLive', 'RoleFk', 'TelephoneNumberFk', 'Email', 'SubsidiaryFk'] },
			],
			overloads: {
				BusinessPartnerFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService,
						displayMember: 'BusinessPartnerName1',
					})
				},
				RoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideBpRoleReadonlyLookupOverload(),
				TelephoneNumberFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
				SubsidiaryFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup<IProjectMainPrj2BusinessPartnerEntity, ISubsidiaryLookupEntity>({
						dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
						serverSideFilter: {
							key: 'businesspartner-main-subsidiary-common-filter',
							execute(context: ILookupContext<ISubsidiaryLookupEntity, IProjectMainPrj2BusinessPartnerEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
								return {
									BusinessPartnerFk: context.entity ? context.entity.BusinessPartnerFk : null,
								};
							}
						},
					})
				},
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					IsLive: { key: 'entityIsLive' },
					Comment: { key: 'entityCommentText' },
					BusinessPartnerFk: { key: 'entityBusinessPartner' },
					SubsidiaryFk: { key: 'entitySubsidiary' },
					Remark: { key: 'entityRemark' },
					TelephoneNumberFk: { key: 'TelephoneDialogPhoneNumber' },
					Email: { key: 'email' },
				}),
			},
		};
	}
}
