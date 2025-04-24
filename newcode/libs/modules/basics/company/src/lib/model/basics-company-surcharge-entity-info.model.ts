/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanySurchargeDataService } from '../services/basics-company-surcharge-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICompany2CostCodeEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_SURCHARGE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompany2CostCodeEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listSurchargeTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailSurchargeTitle' },
			    containerUuid: 'fadeac1901cc49589626297a0ee5cd42',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanySurchargeDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'Company2CostCodeDto'},
                permissionUuid: '041F24C6D4B34C0B9C56869B2B4D9E46',
					 layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['MdcCostCodeFk','Rate', 'Extra','Surcharge','Contribution','Remark','IsDefault'],
						 }
					 ],
					 overloads: {
						 //TO do MdcCostCodeFk
					 },
					 labels: {
						 ...prefixAllTranslationKeys('cloud.common.', {
							 IsDefault: {key: 'entityIsDefault'}
						 }),
						 ...prefixAllTranslationKeys('basics.company.', {
							 MdcCostCodeFk: {key: 'entityMdcCostCodeFk'},
							 Rate: {key: 'entityRate'},
							 Extra: {key: 'entityExtra'},
							 Surcharge: {key: 'entitySurcharge'},
							 Contribution: {key: 'entityContribution'},
							 Remark: {key: 'entityRemark'},
							 IsDefault: {key: 'entityRemark'},
						 }),
					 }
				 }

            });