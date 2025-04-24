/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyTimekeepingGroupDataService } from '../services/basics-company-timekeeping-group-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICompanyDebtorEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_TIMEKEEPING_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyDebtorEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.timekeepingGroupListTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.timekeepingGroupDetailTitle' },
			    containerUuid: '818c680483854e4f9ec50a71203cd49d',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyTimekeepingGroupDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'TimekeepingGroupDto'},
                permissionUuid: 'fad2f7ae9ac24fffa884a5245d4e8d18',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['Code','DescriptionInfo','IsDefault','Sorting','Icon','ClerkFk','RoundingConfigFk'],
						 }
					 ],
					 overloads: {
						 //ClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true)
						 //RoundingConfigFk:BasicsSharedCustomizeLookupOverloadProvider.provideMaterialRoundingConfigTypeLookupOverload(true)
					 },
					 labels: {
						 ...prefixAllTranslationKeys('cloud.common.', {
							 Code: {key: 'entityCode'},
							 DescriptionInfo: {key: 'description'},
							 IsDefault: {key: 'entityIsDefault'},
							 Icon: {key: 'entityIcon'},
						}),
						 ...prefixAllTranslationKeys('basics.company.', {
							 RoundingConfigFk: {key: 'timekeepingRoundingConfig'},
							 ClerkFk: {key: 'entityClerkFk'},
							 Sorting: {key: 'Sorting'},
						}),
					 }
				 }

            });