/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { IMtwoPowerbiEntity } from '@libs/mtwo/interfaces';
import { MtwoControlTowerUserDataService } from '../services/mtwo-control-tower-user-data.service';
import { BasicsCompanyLookupService } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, createLookup} from '@libs/ui/common';

export const MTWO_CONTROL_TOWER_USER_ENTITY_INFO: EntityInfo = EntityInfo.create<IMtwoPowerbiEntity>({
	grid: {
		title: { key: 'mtwo.controltower.PowerBIAccount' },
	},
	dataService: (ctx) => ctx.injector.get(MtwoControlTowerUserDataService),
	dtoSchemeId: { moduleSubModule: 'Mtwo.ControlTower', typeName: 'MtoPowerbiDto' },
	permissionUuid: 'e06020acd9eb45569d4c8344d9b657bb',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: 'cloud.common.entityProperties',
				attributes: ['Description', 'Logonname', 'Password', 'Clientid'],
			},
			{
				gid: 'PowerBISettings',
				attributes: ['Resourceurl', 'Authurl', 'Apiurl', 'Accesslevel', 'Authorized', 'azureadIntegrated', 'BasCompanyFk'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('mtwo.controltower.datapine.', {
				Description: { key: 'dashboardDescription', text: 'Description' },
				Logonname: { key: 'logonname', text: 'Logonname' },
			}),
			...prefixAllTranslationKeys('mtwo.controltowerconfiguration.', {
				Logonname: { key: 'Logonname' },
				Password: { key: 'Password' },
				Clientid: { key: 'Clientid' },
				Resourceurl: { key: 'Resourceurl' },
				Authurl: { key: 'Authurl' },
				Apiurl: { key: 'Apiurl' },
				Accesslevel: { key: 'Accesslevel' },
				Authorized: { text: 'Authorized' },
				AzureadIntegrated: { key: 'azureadIntegrated' },
			}),
			...prefixAllTranslationKeys('basics.company.', {
				BasCompanyFk: { key: 'entityBasCompanyFk' },
			}),
		},
		overloads: {
			BasCompanyFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
					showDescription: true,
					descriptionMember: 'CompanyName',
				}),
				additionalFields: [
					{
						displayMember: 'CompanyName',
						label: {
							text: 'Company Name',
							key: 'cloud.common.entityCompanyName',
						},
						column: true,
					},
				],
			},
		},
	},
});