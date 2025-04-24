/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyTrsConfigDataService } from '../services/basics-company-trs-config-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ITrsConfigEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_TRS_CONFIG_ENTITY_INFO: EntityInfo = EntityInfo.create<ITrsConfigEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.trsConfigTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.trsConfigDetailTitle' },
			    containerUuid: '6100bba551854fbcb1f2570b02a1405d',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyTrsConfigDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'TrsConfigDto'},
                permissionUuid: 'a855590680c442409dff5ee324e97071',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['ProjectFk','JobFk', 'IsDefault','Remark','SiteFk','SiteStockFk'],
						 }
					 ],
					 overloads: {
						 //To DO ProjectFk,JobFk,SiteStockFk
					 },
					 labels: {
						 ...prefixAllTranslationKeys('cloud.common.', {
							 ProjectFk: {key: 'entityProject'},
							 IsDefault: {key: 'entityIsDefault'},
						 }),
						 ...prefixAllTranslationKeys('logistic.job.', {
							 JobFk: {key: 'entityJob'},
						 }),
						 ...prefixAllTranslationKeys('basics.site.', {
							 SiteStockFk: {key: 'entityStockSite'},
						 }),
						 ...prefixAllTranslationKeys('basics.company.', {
							 Remark: {key: 'entityRemark'},
							 SiteFk: {key: 'entitySite'},
						}),
					 }
				 }

            });