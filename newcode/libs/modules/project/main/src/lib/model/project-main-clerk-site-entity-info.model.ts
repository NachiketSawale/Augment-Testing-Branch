/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMainClerkSiteDataService } from '../services/project-main-clerk-site-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IProjectClerkSiteEntity } from '@libs/project/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';


export const PROJECT_MAIN_CLERK_SITE_ENTITY_INFO: EntityInfo = EntityInfo.create<IProjectClerkSiteEntity>({
	grid: {
		title: {key: 'project.main.listClerkSiteTitle'},
	},
	form: {
		title: {key: 'project.main.detailClerkSiteTitle'},
		containerUuid: '635efc6ae0534575b2a93847cef76139',
	},
	dataService: ctx => ctx.injector.get(ProjectMainClerkSiteDataService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'ProjectClerkSiteDto'},
	permissionUuid: 'dd03663c3664443c9a25f2187bddba84',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Comment', 'Remark', 'LocationFk', /*'AssetMasterFk',*/ 'CountryFk', 'AddressFk', 'TelephoneNumberFk', 'TelephoneTelefaxFk',
				'TelephoneMobilFk', 'TelephonePrivatFk', 'TelephonePrivatMobilFk', 'Email']}
		],
		overloads: {
			// TODO: AssetMasterFk lookup
			LocationFk: ProjectSharedLookupOverloadProvider.provideProjectLocationLookupOverload(false),
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
				Comment: {key: 'entityComment'},
				Remark: {key: 'entityRemark'},
				CountryFk: {key: 'entityCountry'},
				AddressFk: {key: 'entityAddress'},
				TelephoneNumberFk: {key: 'TelephoneDialogPhoneNumber'},
				TelephoneTelefaxFk: {key: 'fax'},
				TelephoneMobilFk: {key: 'mobile'},
				TelephonePrivatFk: {key: 'TelephonePrivat'},
				TelephonePrivatMobilFk: {key: 'TelephonePrivatMobil'},
				Email: {key: 'email'},
			}),
			...prefixAllTranslationKeys('project.location.', {
				LocationFk: {key: 'location'},
			}),
			...prefixAllTranslationKeys('estimate.main.', {
				AssetMasterFk: {key: 'mdcAssetMasterFk'},
			})
		}
	},
});