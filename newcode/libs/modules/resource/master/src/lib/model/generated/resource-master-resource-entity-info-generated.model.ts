/*
 * Copyright(c) RIB Software GmbH
 * ----------------------------------------------------------------------
 * This is auto-generated code by ClientTypeScriptModuleInfoGenerator.
 * ----------------------------------------------------------------------
 * This code was generated by RIB Model Generator tool.
 *
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
 * ----------------------------------------------------------------------
 */

import { ResourceMasterResourceDataService } from '../../services/data/resource-master-resource-data.service';
import { ResourceMasterResourceValidationService } from '../../services/validation/resource-master-resource-validation.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IResourceMasterResourceEntity } from '@libs/resource/interfaces';
import { IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const resourceMasterResourceEntityInfoGenerated = <IEntityInfo<IResourceMasterResourceEntity>>{
	grid: {
		title: {
			text: 'Resource',
			key: 'resource.master.listMasterTitle'
		}
	},
	form: {
		title: {
			text: 'Resource',
			key: 'resource.master.detailMasterTitle'
		},
		containerUuid: 'd9391c21eaac4fb7b5db3178af56bdaa'
	},
	dataService: (ctx) => ctx.injector.get(ResourceMasterResourceDataService),
	validationService: (ctx) => ctx.injector.get(ResourceMasterResourceValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Master',
		typeName: 'ResourceDto'
	},
	permissionUuid: '1046a3bd867147feb794bdb60a805eca',
	layoutConfiguration: async (ctx) => {
		return <ILayoutConfiguration<IResourceMasterResourceEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'SiteFk',
						'TypeFk',
						'KindFk',
						'GroupFk',
						'DispatcherGroupFk',
						'CompanyFk',
						'CalendarFk',
						'UomBasisFk',
						'UomTimeFk',
						'Code',
						'DescriptionInfo',
						'ExternalCode',
						'Capacity',
						'Validfrom',
						'Validto',
						'Remark',
						'Userdefined1',
						'Userdefined2',
						'Userdefined3',
						'Userdefined4',
						'Userdefined5',
						'IsLive',
						'SearchPattern',
						'SortCode',
						'ItemFk',
						//'BusinessPartnerFk',
						//'ClerkFk',
					]
				},
			],
			overloads: {},
			labels: { 
				...prefixAllTranslationKeys('resource.master.', {
					SiteFk: { key: 'SiteFk' },
					TypeFk: { key: 'partType' },
					UomBasisFk: { key: 'UomBasisFk' },
					UomTimeFk: { key: 'UomTimeFk' },
					ExternalCode: { key: 'externalCode' },
					Capacity: { key: 'Capacity' },
					Userdefined1: { key: 'entityUserdefined1' },
					Userdefined2: { key: 'entityUserdefined2' },
					Userdefined3: { key: 'entityUserdefined3' },
					Userdefined4: { key: 'entityUserdefined4' },
					Userdefined5: { key: 'entityUserdefined5' },
					SearchPattern: { key: 'entitySearchPattern' },
					SortCode: { key: 'entitySortCode' },
					ItemFk: { key: 'entityItemFk' },
					BusinessPartnerFk: { key: 'entityBusinessPartnerFk' },
					ClerkFk: { key: 'entityClerkFk' }
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					KindFk: { key: 'resourcekind' },
					GroupFk: { key: 'logisticsdispatchergroup' },
					DispatcherGroupFk: { key: 'logisticsdispatchergroup' }
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CompanyFk: { key: 'entityCompany' },
					CalendarFk: { key: 'entityCalCalendarFk' },
					Code: { key: 'entityCode' },
					DescriptionInfo: { key: 'entityDescription' },
					Validfrom: { key: 'entityValidFrom' },
					Validto: { key: 'entityValidTo' },
					Remark: { key: 'entityRemark' },
					IsLive: { key: 'entityIsLive' }
				}),
			 }
		};
	}
};