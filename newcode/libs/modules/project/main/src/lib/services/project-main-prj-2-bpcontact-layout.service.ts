import { Injectable } from '@angular/core';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { LazyInjectable, prefixAllTranslationKeys } from '@libs/platform/common';
import { IProjectMainPrj2BPContactEntity, IProjectMainPrj2BPContactLayoutService, PROJECT_MAIN_PRJ2BPCONTACT_LAYOUT_SERVICE_TOKEN } from '@libs/project/interfaces';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext, ServerSideFilterValueType } from '@libs/ui/common';

@LazyInjectable({
	token: PROJECT_MAIN_PRJ2BPCONTACT_LAYOUT_SERVICE_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root',
})
export class ProjectMainPrj2BPContactLayoutService implements IProjectMainPrj2BPContactLayoutService {
	public generateLayout(): ILayoutConfiguration<IProjectMainPrj2BPContactEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup', attributes: ['ContactFk', 'IsLive', 'ProjectContactRoleTypeFk', 'TelephoneNumberFk', 'Email', 'SubsidiaryFk', 'FamilyName',
						'FirstName', 'TelephoneNumber2Fk', 'TelephoneNumberMobileFk', 'Remark']
				},
			],
			overloads: {
				// RoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideBpRoleReadonlyLookupOverload(),
				TelephoneNumberFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
				TelephoneNumber2Fk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
				ProjectContactRoleTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideContactRoleLookupOverload(true),
				SubsidiaryFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup<IProjectMainPrj2BPContactEntity, ISubsidiaryLookupEntity>({
						dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
						serverSideFilter: {
							key: 'businesspartner-main-subsidiary-common-filter',
							execute(context: ILookupContext<ISubsidiaryLookupEntity, IProjectMainPrj2BPContactEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
								return {
									BusinessPartnerFk: context.entity ? context.entity.BusinessPartnerFk : null,
								};
							}
						},
					})
				},
			},
			labels: {
				...prefixAllTranslationKeys('businesspartner.main.', {
					ContactFk: { key: 'synContact.contacts' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					IsLive: { key: 'entityIsLive' },
					SubsidiaryFk: { key: 'entitySubsidiary' },
					Remark: { key: 'entityRemark' },
					TelephoneNumberFk: { key: 'TelephoneDialogPhoneNumber' },
					TelephoneNumber2Fk: { key: 'telephoneNumber2' },
					TelephoneNumberMobileFk: { key: 'mobile' },
					FirstName: { key: 'contactFirstName' },
					FamilyName: { key: 'contactFamilyName' },
					Email: { key: 'email' },
				}),
			},
		};
	}
}
