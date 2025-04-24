/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyYearDataService } from '../services/basics-company-year-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBusinessYearNPeriodEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_YEAR_ENTITY_INFO: EntityInfo = EntityInfo.create<IBusinessYearNPeriodEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listBusinessYearTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailBusinessYearTitle' },
			    containerUuid: '268efaf3c6a6485eb1bb03a6d989ef43',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyYearDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyYearDto'},
                permissionUuid: 'B13485C47DE64239B64A9D573E03ABA4',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['TradingYear','StartDate', 'EndDate','PreliminaryActual'],
						 }
					 ],
					 labels: {
						 ...prefixAllTranslationKeys('basics.company.', {
							 TradingYear: {key: 'entityTradingYear'},
							 StartDate: {key: 'entityStartDate'},
							 EndDate: {key: 'entityEndDate'},
							 PreliminaryActual: {key: 'entityPreliminaryActual'},
						 }),
					 }
				 }

            });