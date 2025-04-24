/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsClerkDataService } from '../services/basics-clerk-data.service';
import { BasicsClerkValidationService } from '../services/basics-clerk-validation.service';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsCompanyLookupService, BasicsSharedAddressDialogComponent, BasicsSharedClerkLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, createFormDialogLookupProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';


export const BASICS_CLERK_ENTITY_INFO = EntityInfo.create<IBasicsClerkEntity>({
	grid: {
		title: {key: 'basics.clerk.listClerkTitle'},
	},
	form: {
		title: {key: 'basics.clerk.detailClerkTitle' },
		containerUuid:'8b10861ea9564d60ba1a86be7e7da568'
	},
	dataService: (ctx) => ctx.injector.get(BasicsClerkDataService),
	validationService: (ctx) => ctx.injector.get(BasicsClerkValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.Clerk', typeName: 'ClerkDto' },
	permissionUuid: 'f01193df20e34b8d917250ad17a433f1',
	layoutConfiguration: {
		// TODO: userFk lookup is not available
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Code','Description','FamilyName','FirstName','TitleFk', 'ValidFrom','ValidTo',
					/*'UserFk',*/'CompanyFk','Title','Department','Signature','TelephoneNumberFk',
					'TelephoneTelefaxFk','TelephoneMobilFk','Email','AddressFk','TelephonePrivatFk',
					'TelephonePrivatMobilFk','PrivatEmail', 'Birthdate', 'WorkflowType','NotificationEmails',
					'EscalationEmails','EscalationTo','ClerkProxyFk','Userdefined1','Userdefined2','Userdefined3','Userdefined4',
					'Userdefined5','Remark','IsLive','TxUser','TxPw','ClerkSuperiorFk','ProcurementOrganization',
					'ProcurementGroup','IsClerkGroup'],
			}
		],
		overloads: {
			CompanyFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
					showDescription: true,
					descriptionMember: 'CompanyName'
				})
			},
			TitleFk: BasicsSharedCustomizeLookupOverloadProvider.provideTitleLookupOverload(true),
			ClerkProxyFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			ClerkSuperiorFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description'
				}),
				width: 145
			},
			AddressFk: {
				type: FieldType.CustomComponent,
				componentType: BasicsSharedAddressDialogComponent,
				providers: createFormDialogLookupProvider({
					showSearchButton: true,
					showPopupButton: true
				}),
			},
			TelephoneNumberFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
			TelephoneTelefaxFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
			TelephoneMobilFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
			TelephonePrivatFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
			TelephonePrivatMobilFk:BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Description: {key: 'entityDescription'},
				CompanyFk: {key: 'entityCompany'},
				Department: {key: 'entityDepartment'},
				AddressFk: {key: 'entityAddress'},
				Remark: {key: 'DocumentBackup_Remark'},
				IsLive: {key: 'entityIsLive'},
				SearchPattern: {key: 'entitySearchPattern'},
			}),
			...prefixAllTranslationKeys('basics.clerk.', {
				TitleFk: {key: 'entityTitleFk'},
				FamilyName: {key: 'entityFamilyName'},
				FirstName: {key: 'entityFirstName'},
				UserFk: {key: 'entityUserFk'},
				ValidFrom: {key: 'entityValidFrom'},
				ValidTo: {key: 'entityValidTo'},
				Title: {key: 'entityTitle'},
				Signature: {key: 'entitySignature'},
				TelephoneNumberFk: {key: 'entityTelephoneNumberFk'},
				TelephoneTelefaxFk: {key: 'entityTelephoneTelefaxFk'},
				TelephoneMobilFk: {key: 'entityTelephoneMobilFk'},
				TelephonePrivatMobilFk: {key: 'entityTelephonePrivatMobilFk'},
				TelephonePrivatFk: {key: 'entityTelephonePrivatFk'},
				Email: {key: 'entityEmail'},
				PrivatEmail: {key: 'entityPrivatEmail'},
				BlobsFooterFk: {key: 'entityBlobsFooterFk'},
				BlobsEmailfooterFk: {key: 'entityBlobsEmailfooterFk'},
				Birthdate: {key: 'entityBirthdate'},
				WorkflowType: {key: 'entityWorkflowType'},
				NotificationEmails: {key: 'entityNotificationEmails'},
				EscalationEmails: {key: 'entityEscalationEmails'},
				EscalationTo: {key: 'entityEscalationTo'},
				ClerkProxyFk: {key: 'entityClerkProxyFk'},
				BlobsPhotoFk: {key: 'entityBlobsPhotoFk'},
				TxUser: {key: 'entityTxUser'},
				TxPw: {key: 'entityTxPw'},
				ClerkSuperiorFk: {key: 'clerkSuperior'},
				ProcurementOrganization: {key: 'procurementOrganization'},
				ProcurementGroup: {key: 'procurementGroup'},
				IsClerkGroup: {key: 'entityIsClerkGroup'},
			})

		}
	},

} );