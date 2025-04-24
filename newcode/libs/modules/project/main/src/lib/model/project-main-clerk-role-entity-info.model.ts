/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMainClerkRoleDataService } from '../services/project-main-clerk-role-data.service';
import { IProjectRoleEntity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ProjectMainClerkRoleValidationService } from '../services/project-main-clerk-role-validation.service';


export const PROJECT_MAIN_CLERK_ROLE_ENTITY_INFO: EntityInfo = EntityInfo.create<IProjectRoleEntity>({
	grid: {
		title: {key: 'project.main.listClerkRoleTitle'}
	},
	form: {
		title: {key: 'project.main.detailClerkRoleTitle'},
		containerUuid: '400358467500411da957e0ea5e805ca1',
	},
	dataService: ctx => ctx.injector.get(ProjectMainClerkRoleDataService),
	validationService: ctx => ctx.injector.get(ProjectMainClerkRoleValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'ProjectRoleDto'},
	permissionUuid: 'dc92d091a0d044639d43778058510e8c',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Comment', 'ClerkFk', 'ClerkRoleFk', 'ValidFrom', 'ValidTo', 'CountryFk', 'AddressFk',
					'TelephoneNumberFk', 'TelephoneTelefaxFk', 'TelephoneMobilFk', 'TelephonePrivatFk', 'TelephonePrivatMobilFk', 'Email']}
		],
		overloads: {
			ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true),
			CountryFk: BasicsSharedLookupOverloadProvider.provideCountryLookupOverload(true),
			AddressFk: BasicsSharedLookupOverloadProvider.providerAddressDialogComponentOverload(true),
			TelephoneNumberFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
			TelephoneTelefaxFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
			TelephoneMobilFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
			TelephonePrivatFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
			TelephonePrivatMobilFk:BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				ClerkRoleFk: {key: 'entityClerkRole'},
				Comment: {key: 'entityComment'},
				ClerkFk: {key: 'entityClerk'},
				ValidFrom: {key: 'entityValidFrom'},
				ValidTo: {key: 'entityValidTo'},
				CountryFk: {key: 'entityCountry'},
				AddressFk: {key: 'entityAddress'},
				TelephoneNumberFk: {key: 'TelephoneDialogPhoneNumber'},
				TelephoneTelefaxFk: {key: 'fax'},
				TelephoneMobilFk: {key: 'mobile'},
				TelephonePrivatFk: {key: 'TelephonePrivat'},
				TelephonePrivatMobilFk: {key: 'TelephonePrivatMobil'},
				Email: {key: 'email'},
			})
		}
	},

});