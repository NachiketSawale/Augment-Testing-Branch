/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyPeriodsDataService } from '../services/basics-company-periods-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICompanyPeriodEntity } from '@libs/basics/interfaces';



 export const BASICS_COMPANY_PERIODS_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyPeriodEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listPeriodsTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailPeriodsTitle' },
			    containerUuid: '0d38d21d14d8475c9206c3eb346f63be',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyPeriodsDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyPeriodDto'},
                permissionUuid: 'EC18C54522AA46FE9848F466875AA03C',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['TradingPeriod','StartDate', 'EndDate','PeriodStatusFk','Remark','PeriodStatusStockFk','PeriodStatusApFk','PeriodStatusArFk','PreliminaryActual'],
						 }
					 ],
					 overloads: {
						 //PeriodStatusFk:BasicsSharedCustomizeLookupOverloadProvider.providePeriodStateLookupOverload(true),
						 // TO DO PeriodStatusStockFk,PeriodStatusApFk,PeriodStatusArFk,PeriodStatusArFk
					 },
					 labels: {
						 ...prefixAllTranslationKeys('basics.company.', {
							 TradingPeriod: {key: 'entityTradingPeriod'},
							 StartDate: {key: 'entityStartDate'},
							 EndDate: {key: 'entityEndDate'},
							 PeriodStatusFk: {key: 'entityPeriodStatus'},
							 Remark: {key: 'entityRemark'},
							 PeriodStatusStockFk: {key: 'entityPeriodStatusStockFk'},
							 PeriodStatusApFk: {key: 'entityPeriodStatusApFk'},
							 PeriodStatusArFk: {key: 'entityPeriodStatusArFk'},
							 PreliminaryActual: {key: 'entityPreliminaryActual'},
						 }),
					 }
				 }

            });