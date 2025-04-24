/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyDeferaltypeDataService } from '../services/basics-company-deferaltype-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICompanyDeferaltypeEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_DEFERALTYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyDeferaltypeEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listDeferaltypeTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailDeferaltypeTitle' },
			    containerUuid: '29f12eb12f6f4f639569f812c24cc282',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyDeferaltypeDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyDeferaltypeDto'},
                permissionUuid: 'd2e263bf9a1240f3bcf041c4fcad67dc',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['DescriptionInfo','Sorting', 'IsDefault','IsLive','CodeFinance','IsStartDateMandatory'],
						 }
					 ],
					 labels: {
						 ...prefixAllTranslationKeys('cloud.common.', {
							 DescriptionInfo: {key: 'DescriptionInfo'},
							 IsLive: {key: 'entityIsLive'},
							 IsDefault: {key: 'entityIsDefault'}
						 }),
						 ...prefixAllTranslationKeys('basics.company.', {
							 Sorting: {key: 'Sorting'},
							 CodeFinance: {key: 'entityCodeFinance'},
							 IsStartDateMandatory: {key: 'entityIsStartDateMandatory'}
						 }),
					 }
				 }

            });