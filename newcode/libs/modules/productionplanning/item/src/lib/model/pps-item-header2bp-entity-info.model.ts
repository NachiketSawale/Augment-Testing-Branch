/*
* Copyright(c) RIB Software GmbH
*/
/*/* it's useless, to be deleted in the future
import {EntityInfo} from '@libs/ui/business-base';
import {
	IPpsCommonBizPartnerEntity,
	IPpsHeader2BpEntity,
} from '@libs/productionplanning/common';
import {PpsItemHeader2bpDataService} from '../services/pps-item-header2bp-data.service';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType, ILayoutConfiguration, ILookupContext} from '@libs/ui/common';
import {
	BusinessPartnerLookupService,
	BusinesspartnerSharedSubsidiaryLookupService,
} from '@libs/businesspartner/shared';
import {BasicsSharedCustomizeLookupOverloadProvider,} from '@libs/basics/shared';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

export const PPS_ITEM_HEADER_TO_BUSINESS_PARTNER_ENTITY_INFO = EntityInfo.create<IPpsHeader2BpEntity>({
	grid: {
		containerUuid: '801b2d34b66f4c3bac0520ce4fea0cc2',
		title: {text: '*PPS Header Partners', key: 'productionplanning.item.listHeader2BpTitle'},
	},
	permissionUuid: '5907fffe0f9b44588254c79a70ba3af1',
	dataService: ctx => ctx.injector.get(PpsItemHeader2bpDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Header', typeName: 'Header2BpDto'},
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['BusinessPartnerFk', 'RoleFk', 'SubsidiaryFk', 'TelephoneNumberFk', 'Email', 'IsLive', 'Remark']
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				basicData: {key: 'entityProperties'},
				BusinessPartnerFk: { key: 'entityBusinessPartner' },
				SubsidiaryFk: { key: 'entitySubsidiary'},
				IsLive: {key: 'entityIsLive'},
				Remark: {key: 'entityRemark'},
				TelephoneNumberFk: {key: 'TelephoneDialogPhoneNumber'},
				Email: {key: 'email'},
			}),
			...prefixAllTranslationKeys('project.main.', {
				RoleFk: {key: 'entityRole'},
			}),
			...prefixAllTranslationKeys('productionplanning.common.', {
				From: {key: 'from'}
			}),
		},
		overloads: {
			BusinessPartnerFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService,
					displayMember: 'BusinessPartnerName1',
				})
			},
			RoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideBpRoleReadonlyLookupOverload(),
			SubsidiaryFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
					displayMember: 'AddressLine',
					showClearButton: true,
					clientSideFilter: {
						execute(item: ISubsidiaryLookupEntity, context: ILookupContext<ISubsidiaryLookupEntity, IPpsCommonBizPartnerEntity>): boolean {
							return (!context.entity?.BusinessPartnerFk || context.entity.BusinessPartnerFk <= 0 || item.BusinessPartnerFk === context.entity.BusinessPartnerFk);
						}
					}
				})
			},
			Email: {
				readonly: true,
			},
		}
	} as ILayoutConfiguration<IPpsHeader2BpEntity>,
});
*/